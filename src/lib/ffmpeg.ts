import type { AspectRatio, MediaItem } from "@/data/schema";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { resolveMediaUrl } from "./utils";

const videoSizeMap = {
  "16:9": { width: 1024, height: 576 },
  "9:16": { width: 576, height: 1024 },
  "1:1": { width: 1024, height: 1024 },
};

interface ExportKeyframe {
  timestamp: number;
  duration: number;
  url: string | null;
  mediaId: string;
}

interface ExportTrack {
  id: string;
  type: "video" | "audio";
  keyframes: ExportKeyframe[];
}

export async function exportVideoClientSide(
  tracks: ExportTrack[],
  mediaItems: Record<string, MediaItem>,
  totalDuration: number,
  aspectRatio: AspectRatio,
  onProgress?: (progress: number) => void,
): Promise<Blob> {
  const ffmpeg = new FFmpeg();

  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  if (onProgress) {
    ffmpeg.on("progress", ({ progress }) => {
      // Validate and normalize progress value
      // FFmpeg can return unexpected values (NaN, negative, or very large numbers)
      if (
        typeof progress !== "number" ||
        !Number.isFinite(progress) ||
        progress < 0
      ) {
        return;
      }

      // Clamp progress between 0 and 99
      const normalizedProgress = Math.min(Math.max(progress * 100, 0), 99);
      onProgress(normalizedProgress);
    });
  }

  const videoTrack = tracks.find((t) => t.type === "video");
  if (!videoTrack || !videoTrack.keyframes.length) {
    throw new Error("No video track found");
  }

  const audioTracks = tracks.filter((t) => t.type === "audio");

  const dimensions = videoSizeMap[aspectRatio] || videoSizeMap["16:9"];
  const { width, height } = dimensions;

  const keyframes = [...videoTrack.keyframes].sort(
    (a, b) => a.timestamp - b.timestamp,
  );

  const segments: Array<{
    type: "frame" | "gap";
    start: number;
    duration: number;
    keyframe?: ExportKeyframe;
  }> = [];

  let currentTime = 0;
  for (const keyframe of keyframes) {
    if (keyframe.timestamp > currentTime) {
      segments.push({
        type: "gap",
        start: currentTime,
        duration: keyframe.timestamp - currentTime,
      });
    }

    segments.push({
      type: "frame",
      start: keyframe.timestamp,
      duration: keyframe.duration,
      keyframe,
    });

    currentTime = keyframe.timestamp + keyframe.duration;
  }

  if (currentTime < totalDuration) {
    segments.push({
      type: "gap",
      start: currentTime,
      duration: totalDuration - currentTime,
    });
  }

  const clips: string[] = [];
  const videoAudioClips: string[] = [];
  let clipIndex = 0;

  for (const segment of segments) {
    const durationSeconds = segment.duration / 1000;
    const outputFilename = `clip_${clipIndex}.mp4`;

    if (segment.type === "gap") {
      await ffmpeg.exec([
        "-f",
        "lavfi",
        "-i",
        `color=c=black:s=${width}x${height}:d=${durationSeconds}`,
        "-pix_fmt",
        "yuv420p",
        "-r",
        "30",
        outputFilename,
      ]);

      const videoAudioFilename = `video_audio_${clipIndex}.wav`;
      await ffmpeg.exec([
        "-f",
        "lavfi",
        "-i",
        `anullsrc=channel_layout=stereo:sample_rate=44100:duration=${durationSeconds}`,
        videoAudioFilename,
      ]);
      videoAudioClips.push(videoAudioFilename);
    } else {
      const { keyframe } = segment;
      if (!keyframe || !keyframe.url) continue;

      const url = keyframe.url;

      let mediaData: Uint8Array;
      if (url.startsWith("blob:")) {
        mediaData = await fetchFile(url);
      } else {
        mediaData = await fetchFile(
          `${window.location.origin}/api/download?url=${encodeURIComponent(url)}`,
        );
      }

      const inputFilename = `input_${clipIndex}.${getExtension(url)}`;
      await ffmpeg.writeFile(inputFilename, mediaData);

      const media = mediaItems[keyframe.mediaId];
      const isImage =
        media?.mediaType === "image" || /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

      if (isImage) {
        await ffmpeg.exec([
          "-loop",
          "1",
          "-i",
          inputFilename,
          "-t",
          durationSeconds.toString(),
          "-vf",
          `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
          "-pix_fmt",
          "yuv420p",
          "-r",
          "30",
          outputFilename,
        ]);

        const videoAudioFilename = `video_audio_${clipIndex}.wav`;
        await ffmpeg.exec([
          "-f",
          "lavfi",
          "-i",
          `anullsrc=channel_layout=stereo:sample_rate=44100:duration=${durationSeconds}`,
          videoAudioFilename,
        ]);
        videoAudioClips.push(videoAudioFilename);
      } else {
        await ffmpeg.exec([
          "-i",
          inputFilename,
          "-t",
          durationSeconds.toString(),
          "-vf",
          `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
          "-r",
          "30",
          "-pix_fmt",
          "yuv420p",
          "-an",
          outputFilename,
        ]);

        const videoAudioFilename = `video_audio_${clipIndex}.wav`;
        await ffmpeg.exec([
          "-i",
          inputFilename,
          "-t",
          durationSeconds.toString(),
          "-vn",
          "-ar",
          "44100",
          "-ac",
          "2",
          videoAudioFilename,
        ]);
        videoAudioClips.push(videoAudioFilename);
      }
    }

    clips.push(outputFilename);
    clipIndex++;
  }

  const concatContent = clips.map((clip) => `file '${clip}'`).join("\n");
  await ffmpeg.writeFile("concat.txt", new TextEncoder().encode(concatContent));

  await ffmpeg.exec([
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    "concat.txt",
    "-c",
    "copy",
    "output.mp4",
  ]);

  const videoAudioConcatContent = videoAudioClips
    .map((clip) => `file '${clip}'`)
    .join("\n");
  await ffmpeg.writeFile(
    "video_audio_concat.txt",
    new TextEncoder().encode(videoAudioConcatContent),
  );

  await ffmpeg.exec([
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    "video_audio_concat.txt",
    "-c",
    "copy",
    "video_audio_track.wav",
  ]);

  if (audioTracks.length > 0 || videoAudioClips.length > 0) {
    const audioInputs: string[] = [];

    if (videoAudioClips.length > 0) {
      audioInputs.push("video_audio_track.wav");
    }

    for (let trackIdx = 0; trackIdx < audioTracks.length; trackIdx++) {
      const audioTrack = audioTracks[trackIdx];
      const audioKeyframes = [...audioTrack.keyframes].sort(
        (a, b) => a.timestamp - b.timestamp,
      );

      const audioSegments: Array<{
        type: "sound" | "silence";
        start: number;
        duration: number;
        keyframe?: ExportKeyframe;
      }> = [];

      let currentTime = 0;
      for (const keyframe of audioKeyframes) {
        if (keyframe.timestamp > currentTime) {
          audioSegments.push({
            type: "silence",
            start: currentTime,
            duration: keyframe.timestamp - currentTime,
          });
        }

        audioSegments.push({
          type: "sound",
          start: keyframe.timestamp,
          duration: keyframe.duration,
          keyframe,
        });

        currentTime = keyframe.timestamp + keyframe.duration;
      }

      if (currentTime < totalDuration) {
        audioSegments.push({
          type: "silence",
          start: currentTime,
          duration: totalDuration - currentTime,
        });
      }

      const trackAudioClips: string[] = [];
      let audioClipIndex = 0;

      for (const segment of audioSegments) {
        const durationSeconds = segment.duration / 1000;
        const outputFilename = `audio_track${trackIdx}_clip${audioClipIndex}.wav`;

        if (segment.type === "silence") {
          await ffmpeg.exec([
            "-f",
            "lavfi",
            "-i",
            `anullsrc=channel_layout=stereo:sample_rate=44100:duration=${durationSeconds}`,
            outputFilename,
          ]);
        } else {
          const { keyframe } = segment;
          if (!keyframe || !keyframe.url) continue;

          const url = keyframe.url;

          let audioData: Uint8Array;
          if (url.startsWith("blob:")) {
            audioData = await fetchFile(url);
          } else {
            audioData = await fetchFile(
              `${window.location.origin}/api/download?url=${encodeURIComponent(url)}`,
            );
          }

          const inputFilename = `audio_track${trackIdx}_input${audioClipIndex}.${getExtension(url)}`;
          await ffmpeg.writeFile(inputFilename, audioData);

          await ffmpeg.exec([
            "-i",
            inputFilename,
            "-t",
            durationSeconds.toString(),
            "-ar",
            "44100",
            "-ac",
            "2",
            outputFilename,
          ]);
        }

        trackAudioClips.push(outputFilename);
        audioClipIndex++;
      }

      const trackConcatContent = trackAudioClips
        .map((clip) => `file '${clip}'`)
        .join("\n");
      const trackConcatFilename = `audio_track${trackIdx}_concat.txt`;
      await ffmpeg.writeFile(
        trackConcatFilename,
        new TextEncoder().encode(trackConcatContent),
      );

      const trackOutputFilename = `audio_track${trackIdx}_final.wav`;
      await ffmpeg.exec([
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        trackConcatFilename,
        "-c",
        "copy",
        trackOutputFilename,
      ]);

      audioInputs.push(trackOutputFilename);
    }

    let mixedAudioFilename = "audio_mixed.wav";
    if (audioInputs.length === 1) {
      mixedAudioFilename = audioInputs[0];
    } else {
      const amixInputs = audioInputs.map((_, idx) => `[${idx}:a]`).join("");
      const amixFilter = `${amixInputs}amix=inputs=${audioInputs.length}:duration=longest[aout]`;

      const ffmpegArgs = [];
      for (const input of audioInputs) {
        ffmpegArgs.push("-i", input);
      }
      ffmpegArgs.push(
        "-filter_complex",
        amixFilter,
        "-map",
        "[aout]",
        mixedAudioFilename,
      );

      await ffmpeg.exec(ffmpegArgs);
    }

    await ffmpeg.exec([
      "-i",
      "output.mp4",
      "-i",
      mixedAudioFilename,
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-shortest",
      "output_with_audio.mp4",
    ]);

    const finalData = await ffmpeg.readFile("output_with_audio.mp4");
    await ffmpeg.writeFile("output.mp4", finalData);
  }

  const data = await ffmpeg.readFile("output.mp4");

  if (onProgress) {
    onProgress(100);
  }

  return new Blob([data], { type: "video/mp4" });
}

function getExtension(url: string): string {
  const match = url.match(/\.([^./?#]+)(?:[?#]|$)/);
  return match ? match[1] : "mp4";
}

export async function getMediaMetadata(media: MediaItem) {
  try {
    const mediaUrl = resolveMediaUrl(media);
    if (!mediaUrl) {
      return { media: {} };
    }

    // Handle images separately to extract dimensions
    if (media.mediaType === "image") {
      return new Promise<{ media: any }>((resolve) => {
        const img = document.createElement("img");

        img.addEventListener("load", () => {
          const metadata = {
            width: img.naturalWidth,
            height: img.naturalHeight,
          };
          resolve({ media: metadata });
        });

        img.addEventListener("error", () => {
          console.error("Failed to load image metadata");
          resolve({ media: {} });
        });

        if (mediaUrl.startsWith("blob:")) {
          img.src = mediaUrl;
        } else {
          img.src = `${window.location.origin}/api/download?url=${encodeURIComponent(mediaUrl)}`;
        }
      });
    }

    return new Promise<{ media: any }>((resolve) => {
      const mediaElement =
        media.mediaType === "video"
          ? document.createElement("video")
          : document.createElement("audio");

      mediaElement.addEventListener("loadedmetadata", () => {
        const metadata = {
          duration: mediaElement.duration,
        };
        resolve({ media: metadata });
      });

      mediaElement.addEventListener("error", () => {
        console.error("Failed to load media metadata");
        resolve({ media: mediaElement });
      });

      if (mediaUrl.startsWith("blob:")) {
        mediaElement.src = mediaUrl;
      } else {
        mediaElement.src = `${window.location.origin}/api/download?url=${encodeURIComponent(mediaUrl)}`;
      }
      mediaElement.load();
    });
  } catch (error) {
    console.error("Error extracting metadata:", error);
    return { media: {} };
  }
}

export async function extractVideoThumbnail(
  videoUrl: string,
): Promise<Blob | null> {
  try {
    const video = document.createElement("video");

    // Use proxy for external URLs to avoid CORS issues
    if (videoUrl.startsWith("blob:")) {
      video.src = videoUrl;
    } else {
      video.src = `${window.location.origin}/api/download?url=${encodeURIComponent(videoUrl)}`;
    }

    video.crossOrigin = "anonymous";
    video.muted = true;

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("Failed to load video"));
    });

    video.currentTime = 0;

    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
    });

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to Blob instead of data URL
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.8,
      );
    });
  } catch (error) {
    console.error("Failed to generate video thumbnail:", error);
    return null;
  }
}

"use client";

import { db } from "@/data/db";
import {
  EMPTY_VIDEO_COMPOSITION,
  useProject,
  useVideoComposition,
} from "@/data/queries";
import {
  type MediaItem,
  PROJECT_PLACEHOLDER,
  TRACK_TYPE_ORDER,
  type VideoKeyFrame,
  type VideoProject,
  type VideoTrack,
} from "@/data/schema";
import { useProjectId, useVideoProjectStore } from "@/data/store";
import { cn, resolveDuration, resolveMediaUrl } from "@/lib/utils";
import { Player, type PlayerRef } from "@remotion/player";
import { preloadAudio, preloadVideo } from "@remotion/preload";
import { DownloadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  Sequence,
  Video,
} from "remotion";
import { throttle } from "throttle-debounce";
import { Button } from "./ui/button";

interface VideoCompositionProps {
  project: VideoProject;
  tracks: VideoTrack[];
  frames: Record<string, VideoKeyFrame[]>;
  mediaItems: Record<string, MediaItem>;
}

const FPS = 30;
const DEFAULT_DURATION = 5;
const VIDEO_WIDTH = 1024;
const VIDEO_HEIGHT = 720;

const videoSizeMap = {
  "16:9": { width: 1024, height: 576 },
  "9:16": { width: 576, height: 1024 },
  "1:1": { width: 1024, height: 1024 },
};

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  project,
  tracks,
  frames,
  mediaItems,
}) => {
  const sortedTracks = [...tracks].sort((a, b) => {
    return TRACK_TYPE_ORDER[a.type] - TRACK_TYPE_ORDER[b.type];
  });

  let width = VIDEO_WIDTH;
  let height = VIDEO_HEIGHT;

  if (project.aspectRatio) {
    const size = videoSizeMap[project.aspectRatio];
    if (size) {
      width = size.width;
      height = size.height;
    }
  }

  return (
    <Composition
      id={project.id}
      component={MainComposition as any}
      durationInFrames={DEFAULT_DURATION * FPS}
      fps={FPS}
      width={width}
      height={height}
      defaultProps={{
        project,
        tracks: sortedTracks,
        frames,
        mediaItems,
      }}
    />
  );
};

const MainComposition: React.FC<VideoCompositionProps> = ({
  tracks,
  frames,
  mediaItems,
}) => {
  return (
    <AbsoluteFill>
      {tracks.map((track) => (
        <Sequence key={track.id}>
          {track.type === "video" && (
            <VideoTrackSequence
              track={track}
              frames={frames[track.id] || []}
              mediaItems={mediaItems}
            />
          )}
          {(track.type === "music" || track.type === "voiceover") && (
            <AudioTrackSequence
              track={track}
              frames={frames[track.id] || []}
              mediaItems={mediaItems}
            />
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

interface TrackSequenceProps {
  track: VideoTrack;
  frames: VideoKeyFrame[];
  mediaItems: Record<string, MediaItem>;
}

const VideoTrackSequence: React.FC<TrackSequenceProps> = ({
  frames,
  mediaItems,
}) => {
  return (
    <AbsoluteFill>
      {frames.map((frame) => {
        const media = mediaItems[frame.data.mediaId];
        if (!media || media.status !== "completed") return null;

        const mediaUrl = resolveMediaUrl(media);
        if (!mediaUrl) return null;

        const duration = frame.duration || resolveDuration(media) || 5000;
        const durationInFrames = Math.floor(duration / (1000 / FPS));

        return (
          <Sequence
            key={frame.id}
            from={Math.floor(frame.timestamp / (1000 / FPS))}
            durationInFrames={durationInFrames}
            premountFor={3000}
          >
            {media.mediaType === "video" && <Video src={mediaUrl} volume={1} />}
            {media.mediaType === "image" && (
              <Img src={mediaUrl} style={{ objectFit: "cover" }} />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const AudioTrackSequence: React.FC<TrackSequenceProps> = ({
  frames,
  mediaItems,
}) => {
  return (
    <>
      {frames.map((frame) => {
        const media = mediaItems[frame.data.mediaId];
        if (!media || media.status !== "completed") return null;

        const audioUrl = resolveMediaUrl(media);
        if (!audioUrl) return null;

        const duration = frame.duration || resolveDuration(media) || 5000;
        const durationInFrames = Math.floor(duration / (1000 / FPS));

        return (
          <Sequence
            key={frame.id}
            from={Math.floor(frame.timestamp / (1000 / FPS))}
            durationInFrames={durationInFrames}
            premountFor={3000}
          >
            <Audio src={audioUrl} />
          </Sequence>
        );
      })}
    </>
  );
};

export default function VideoPreview() {
  const t = useTranslations("app.videoPreview");
  const projectId = useProjectId();
  const setPlayer = useVideoProjectStore((s) => s.setPlayer);

  const { data: project = PROJECT_PLACEHOLDER } = useProject(projectId);
  const {
    data: composition = EMPTY_VIDEO_COMPOSITION,
    isLoading: isCompositionLoading,
  } = useVideoComposition(projectId);
  const { tracks = [], frames = {}, mediaItems = {} } = composition;

  useEffect(() => {
    const mediaIds = Object.values(frames)
      .flat()
      .flatMap((f) => f.data.mediaId);
    for (const media of Object.values(mediaItems)) {
      if (media.status === "completed" && mediaIds.includes(media.id)) {
        const mediaUrl = resolveMediaUrl(media);
        if (!mediaUrl) continue;
        if (media.mediaType === "video") {
          preloadVideo(mediaUrl);
        }
        if (
          mediaUrl.indexOf("v2.") === -1 &&
          (media.mediaType === "music" || media.mediaType === "voiceover")
        ) {
          preloadAudio(mediaUrl);
        }
      }
    }
  }, [frames, mediaItems]);

  // Calculate the effective duration based on the latest keyframe
  const calculateDuration = useCallback(() => {
    let maxTimestamp = 0;
    for (const trackFrames of Object.values(frames)) {
      for (const frame of trackFrames) {
        maxTimestamp = Math.max(maxTimestamp, frame.timestamp);
      }
    }
    // Add 5 seconds padding after the last frame
    return Math.max(DEFAULT_DURATION, Math.ceil((maxTimestamp + 5000) / 1000));
  }, [frames]);

  const duration = calculateDuration();

  const setPlayerCurrentTimestamp = useVideoProjectStore(
    (s) => s.setPlayerCurrentTimestamp,
  );

  const setPlayerState = useVideoProjectStore((s) => s.setPlayerState);
  // Frame updates are super frequent, so we throttle the updates to the timestamp
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updatePlayerCurrentTimestamp = useCallback(
    throttle(64, setPlayerCurrentTimestamp),
    [],
  );

  // Register events on the player
  const playerRef = useCallback(
    (player: PlayerRef) => {
      if (!player) return;
      setPlayer(player);
      player.addEventListener("play", (e) => {
        setPlayerState("playing");
      });
      player.addEventListener("pause", (e) => {
        setPlayerState("paused");
      });
      player.addEventListener("seeked", (e) => {
        const currentFrame = e.detail.frame;
        updatePlayerCurrentTimestamp(currentFrame / FPS);
      });
      player.addEventListener("frameupdate", (e) => {
        const currentFrame = e.detail.frame;
        updatePlayerCurrentTimestamp(currentFrame / FPS);
      });
    },
    [setPlayer, setPlayerState, updatePlayerCurrentTimestamp],
  );

  const setExportDialogOpen = useVideoProjectStore(
    (s) => s.setExportDialogOpen,
  );

  let width = VIDEO_WIDTH;
  let height = VIDEO_HEIGHT;

  if (project.aspectRatio) {
    const size = videoSizeMap[project.aspectRatio];
    if (size) {
      width = size.width;
      height = size.height;
    }
  }

  return (
    <div className="flex-grow flex-1 h-full flex items-center justify-center bg-background-dark dark:bg-background-light relative">
      <Button
        className="absolute top-4 right-4 z-40"
        variant="default"
        onClick={() => setExportDialogOpen(true)}
        disabled={isCompositionLoading || tracks.length === 0}
      >
        <DownloadIcon className="w-4 h-4" />
        {t("export")}
      </Button>
      <div className="w-full h-full flex items-center justify-center mx-6  max-h-[calc(100vh-25rem)]">
        <Player
          className={cn(
            "[&_video]:shadow-2xl inline-flex items-center justify-center mx-auto w-full h-full max-h-[500px] 3xl:max-h-[800px]",
            {
              "aspect-[16/9]": project.aspectRatio === "16:9",
              "aspect-[9/16]": project.aspectRatio === "9:16",
              "aspect-[1/1]": project.aspectRatio === "1:1",
            },
          )}
          ref={playerRef}
          component={MainComposition}
          inputProps={{
            project,
            tracks,
            frames,
            mediaItems,
          }}
          durationInFrames={duration * FPS}
          fps={FPS}
          compositionWidth={width}
          compositionHeight={height}
          style={{
            width: "100%",
            height: "100%",
          }}
          clickToPlay={true}
          showPosterWhenPaused={false}
          autoPlay={false}
          loop={false}
          controls={false}
        />
      </div>
    </div>
  );
}

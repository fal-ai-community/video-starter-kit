import { db } from "@/data/db";
import {
  EMPTY_VIDEO_COMPOSITION,
  queryKeys,
  useProject,
  useVideoComposition,
  VideoCompositionData,
} from "@/data/queries";
import {
  type GenerationJob,
  PROJECT_PLACEHOLDER,
  TRACK_TYPE_ORDER,
  type VideoKeyFrame,
  type VideoProject,
  type VideoTrack,
} from "@/data/schema";
import { useProjectId, useVideoProjectStore } from "@/data/store";
import { resolveMediaUrl } from "@/lib/utils";
import { Player, type PlayerRef } from "@remotion/player";
import { preloadVideo, preloadAudio } from "@remotion/preload";
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
import { DownloadIcon } from "lucide-react";
import { fal } from "@/lib/fal";

interface VideoCompositionProps {
  project: VideoProject;
  tracks: VideoTrack[];
  frames: Record<string, VideoKeyFrame[]>;
  jobs: Record<string, GenerationJob>;
}

const FPS = 30;
const DEFAULT_DURATION = 5;
const VIDEO_WIDTH = 1024;
const VIDEO_HEIGHT = 720;

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  project,
  tracks,
  frames,
  jobs,
}) => {
  const sortedTracks = [...tracks].sort((a, b) => {
    return TRACK_TYPE_ORDER[a.type] - TRACK_TYPE_ORDER[b.type];
  });

  return (
    <Composition
      id={project.id}
      component={MainComposition as any}
      durationInFrames={DEFAULT_DURATION * FPS}
      fps={FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      defaultProps={{
        project,
        tracks: sortedTracks,
        frames,
        jobs,
      }}
    />
  );
};

const MainComposition: React.FC<VideoCompositionProps> = ({
  tracks,
  frames,
  jobs,
}) => {
  return (
    <AbsoluteFill>
      {tracks.map((track) => (
        <Sequence key={track.id}>
          {track.type === "video" && (
            <VideoTrackSequence
              track={track}
              frames={frames[track.id] || []}
              jobs={jobs}
            />
          )}
          {track.type === "music" && (
            <MusicTrackSequence
              track={track}
              frames={frames[track.id] || []}
              jobs={jobs}
            />
          )}
          {track.type === "voiceover" && (
            <VoiceoverTrackSequence
              track={track}
              frames={frames[track.id] || []}
              jobs={jobs}
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
  jobs: Record<string, GenerationJob>;
}

const VideoTrackSequence: React.FC<TrackSequenceProps> = ({ frames, jobs }) => {
  return (
    <AbsoluteFill>
      {frames.map((frame) => {
        const job = jobs[frame.data.jobId];
        if (!job || job.status !== "completed") return null;

        const mediaUrl = resolveMediaUrl(job.output);
        if (!mediaUrl) return null;

        return (
          <Sequence
            key={frame.id}
            from={Math.floor(frame.timestamp / (1000 / FPS))}
          >
            {job.mediaType === "video" && <Video src={mediaUrl} />}
            {job.mediaType === "image" && (
              <Img src={mediaUrl} style={{ objectFit: "cover" }} />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const MusicTrackSequence: React.FC<TrackSequenceProps> = ({ frames, jobs }) => {
  return (
    <>
      {frames.map((frame) => {
        const job = jobs[frame.data.jobId];
        if (!job || job.status !== "completed") return null;

        const audioUrl = resolveMediaUrl(job.output);
        if (!audioUrl) return null;

        return (
          <Sequence
            key={frame.id}
            from={Math.floor(frame.timestamp / (1000 / FPS))}
          >
            <Audio src={audioUrl} />
          </Sequence>
        );
      })}
    </>
  );
};

const VoiceoverTrackSequence: React.FC<TrackSequenceProps> = ({
  frames,
  jobs,
}) => {
  return (
    <>
      {frames.map((frame) => {
        const job = jobs[frame.data.jobId];
        if (!job || job.status !== "completed") return null;

        const audioUrl = resolveMediaUrl(job.output);
        if (!audioUrl) return null;

        return (
          <Sequence
            key={frame.id}
            from={Math.floor(frame.timestamp / (1000 / FPS))}
          >
            <Audio src={audioUrl} />
          </Sequence>
        );
      })}
    </>
  );
};

export default function VideoPreview() {
  const projectId = useProjectId();
  const setPlayer = useVideoProjectStore((s) => s.setPlayer);

  const { data: project = PROJECT_PLACEHOLDER } = useProject(projectId);
  const {
    data: composition = EMPTY_VIDEO_COMPOSITION,
    isLoading: isCompositionLoading,
  } = useVideoComposition(projectId);
  const { tracks = [], frames = {}, jobs = {} } = composition;
  useEffect(() => {
    const jobIds = Object.values(frames)
      .flatMap((f) => f)
      .map((f) => f.data.jobId);
    Object.values(jobs)
      .filter((job) => job.status === "completed" && jobIds.includes(job.id))
      .forEach((job) => {
        // if (job.output?.video?.url) {
        //   preloadVideo(job.output.video.url);
        // }
        // if (job.output?.audio_file?.url) {
        //   preloadAudio(job.output.audio_file.url);
        // }
        // if (job.output?.audio_url?.url) {
        //   preloadAudio(job.output.audio_url.url);
        // }
      });
  }, [frames]);

  // Calculate the effective duration based on the latest keyframe
  const calculateDuration = useCallback(() => {
    let maxTimestamp = 0;
    Object.values(frames).forEach((trackFrames) => {
      trackFrames.forEach((frame) => {
        maxTimestamp = Math.max(maxTimestamp, frame.timestamp);
      });
    });
    // Add 5 seconds padding after the last frame
    return Math.max(DEFAULT_DURATION, Math.ceil((maxTimestamp + 5000) / 1000));
  }, [frames]);

  const duration = calculateDuration();

  const setPlayerCurrentTimestamp = useVideoProjectStore(
    (s) => s.setPlayerCurrentTimestamp,
  );

  const setPlayerState = useVideoProjectStore((s) => s.setPlayerState);
  // Frame updates are super frequent, so we throttle the updates to the timestamp
  const updatePlayerCurrentTimestamp = useCallback(
    throttle(64, setPlayerCurrentTimestamp),
    [],
  );

  // Register events on the player
  const playerRef = useCallback((player: PlayerRef) => {
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
  }, []);

  const setExportDialogOpen = useVideoProjectStore(
    (s) => s.setExportDialogOpen,
  );

  return (
    <div className="flex-grow flex-1 h-full flex items-center justify-center bg-background-dark dark:bg-background-light relative">
      <Button
        className="absolute top-4 right-4"
        variant="default"
        onClick={() => setExportDialogOpen(true)}
        disabled={isCompositionLoading || tracks.length === 0}
      >
        <DownloadIcon className="w-4 h-4" />
        Export
      </Button>
      <div className="w-3/5 aspect-video">
        <Player
          ref={playerRef}
          component={MainComposition}
          inputProps={{
            project,
            tracks,
            frames,
            jobs,
          }}
          durationInFrames={duration * FPS}
          fps={FPS}
          compositionWidth={VIDEO_WIDTH}
          compositionHeight={VIDEO_HEIGHT}
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

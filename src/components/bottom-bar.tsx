import { db } from "@/data/db";
import {
  TRACK_TYPE_ORDER,
  type MediaItem,
  type VideoTrack,
} from "@/data/schema";
import { useProjectId, useVideoProjectStore } from "@/data/store";
import { cn, resolveDuration } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type DragEventHandler, useMemo, useState } from "react";
import { VideoControls } from "./video-controls";
import { TimelineRuler } from "./video/timeline";
import { VideoTrackRow } from "./video/track";
import { queryKeys, refreshVideoCache } from "@/data/queries";

export default function BottomBar() {
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  const playerCurrentTimestamp = useVideoProjectStore(
    (s) => s.playerCurrentTimestamp,
  );
  const formattedTimestamp =
    (playerCurrentTimestamp < 10 ? "0" : "") +
    playerCurrentTimestamp.toFixed(2);
  const minTrackWidth = `${((2 / 30) * 100).toFixed(2)}%`;
  const [dragOverTracks, setDragOverTracks] = useState(false);

  const handleOnDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setDragOverTracks(true);
    const jobPayload = event.dataTransfer.getData("job");
    if (!jobPayload) return false;
    const job: MediaItem = JSON.parse(jobPayload);
    return job.status === "completed";
  };

  const addToTrack = useMutation({
    mutationFn: async (media: MediaItem) => {
      const tracks = await db.tracks.tracksByProject(media.projectId);
      const trackType = media.mediaType === "image" ? "video" : media.mediaType;
      let track = tracks.find((t) => t.type === trackType);
      if (!track) {
        const id = await db.tracks.create({
          projectId: media.projectId,
          type: trackType,
          label: media.mediaType,
          locked: true,
        });
        const newTrack = await db.tracks.find(id.toString());
        if (!newTrack) return;
        track = newTrack;
      }
      const keyframes = await db.keyFrames.keyFramesByTrack(track.id);

      const lastKeyframe = [...keyframes]
        .sort((a, b) => a.timestamp - b.timestamp)
        .reduce(
          (acc, frame) => {
            if (frame.timestamp + frame.duration > acc.timestamp + acc.duration)
              return frame;
            return acc;
          },
          { timestamp: 0, duration: 0 },
        );

      const duration = resolveDuration(media) ?? 5000;

      const newId = await db.keyFrames.create({
        trackId: track.id,
        data: {
          mediaId: media.id,
          type: media.input?.image_url ? "image" : "prompt",
          prompt: media.input?.prompt || "",
          url: media.input?.image_url?.url,
        },
        timestamp: lastKeyframe
          ? lastKeyframe.timestamp + 1 + lastKeyframe.duration
          : 0,
        duration,
      });
      return db.keyFrames.find(newId.toString());
    },
    onSuccess: (data) => {
      if (!data) return;
      refreshVideoCache(queryClient, projectId);
    },
  });

  const { data: tracks = [] } = useQuery({
    queryKey: queryKeys.projectTracks(projectId),
    queryFn: async () => {
      const result = await db.tracks.tracksByProject(projectId);
      return result.toSorted(
        (a, b) => TRACK_TYPE_ORDER[a.type] - TRACK_TYPE_ORDER[b.type],
      );
    },
  });

  const trackObj: Record<string, VideoTrack> = useMemo(() => {
    return {
      video:
        tracks.find((t) => t.type === "video") ||
        ({
          id: "video",
          type: "video",
          label: "Video",
          locked: true,
          keyframes: [],
          projectId: projectId,
        } as VideoTrack),
      music:
        tracks.find((t) => t.type === "music") ||
        ({
          id: "music",
          type: "music",
          label: "Music",
          locked: true,
          keyframes: [],
          projectId: projectId,
        } as VideoTrack),
      voiceover:
        tracks.find((t) => t.type === "voiceover") ||
        ({
          id: "voiceover",
          type: "voiceover",
          label: "Voiceover",
          locked: true,
          keyframes: [],
          projectId: projectId,
        } as VideoTrack),
    };
  }, [tracks, projectId]);

  const handleOnDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setDragOverTracks(false);
    const jobPayload = event.dataTransfer.getData("job");
    if (!jobPayload) return false;
    const job: MediaItem = JSON.parse(jobPayload);
    addToTrack.mutate(job);
    return true;
  };

  return (
    <div className="border-t pb-2 border-border flex flex-col bg-background-light ">
      <div className="border-b border-border bg-background-dark px-2 flex flex-row gap-8 py-2 justify-between items-center flex-1">
        <div className="h-full flex flex-col justify-center px-4 bg-muted/50 rounded-md font-mono cursor-default select-none shadow-inner">
          <div className="flex flex-row items-baseline font-thin tabular-nums">
            <span className="text-muted-foreground">00:</span>
            <span>{formattedTimestamp}</span>
            <span className="text-muted-foreground/50 mx-2">/</span>
            <span className="text-sm opacity-50">
              <span className="text-muted-foreground">00:</span>30.00
            </span>
          </div>
        </div>
        <VideoControls />
      </div>
      <div
        className={cn(
          "min-h-64  max-h-72 h-full flex flex-row overflow-y-scroll transition-colors",
          {
            "bg-white/5": dragOverTracks,
          },
        )}
        onDragOver={handleOnDragOver}
        onDragLeave={() => setDragOverTracks(false)}
        onDrop={handleOnDrop}
      >
        <div className="flex flex-col justify-start w-full h-full relative">
          <div
            className="absolute z-[32] top-6 bottom-0 w-[2px] bg-white/30 ms-4"
            style={{
              left: `${((playerCurrentTimestamp / 30) * 100).toFixed(2)}%`,
            }}
          />
          <TimelineRuler className="z-30 pointer-events-none" />
          <div className="flex timeline-container flex-col h-full mx-4 mt-10 gap-2 z-[31] pb-2">
            {Object.values(trackObj).map((track, index) =>
              track ? (
                <VideoTrackRow
                  key={track.id}
                  data={track}
                  style={{
                    minWidth: minTrackWidth,
                  }}
                />
              ) : (
                <div
                  key={`empty-track-${index}`}
                  className="flex flex-row relative w-full h-full timeline-container"
                />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { db } from "@/data/db";
import {
  TRACK_TYPE_ORDER,
  type GenerationJob,
  type VideoTrack,
} from "@/data/schema";
import { useProjectId, useVideoProjectStore } from "@/data/store";
import { cn, resolveDuration } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AudioLinesIcon,
  ChevronRightIcon,
  FilmIcon,
  ListPlusIcon,
  ListXIcon,
  MicIcon,
  MoreHorizontalIcon,
  MusicIcon,
} from "lucide-react";
import { type DragEventHandler, type HTMLAttributes, useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { VideoControls } from "./video-controls";
import { TimelineRuler } from "./video/timeline";
import { VideoTrackRow, VideoTrackView } from "./video/track";
import { queryKeys, refreshVideoCache } from "@/data/queries";

export default function BottomBar() {
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  const playerCurrentTimestamp = useVideoProjectStore(
    (s) => s.playerCurrentTimestamp
  );
  const formattedTimestamp =
    (playerCurrentTimestamp < 10 ? "0" : "") +
    playerCurrentTimestamp.toFixed(2);
  const minTrackWidth = ((2 / 30) * 100).toFixed(2) + "%";
  const [dragOverTracks, setDragOverTracks] = useState(false);

  const handleOnDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setDragOverTracks(true);
    const jobPayload = event.dataTransfer.getData("job");
    if (!jobPayload) return false;
    const job: GenerationJob = JSON.parse(jobPayload);
    return job.status === "completed";
  };

  const addToTrack = useMutation({
    mutationFn: async (job: GenerationJob) => {
      const tracks = await db.tracks.tracksByProject(job.projectId);
      const trackType = job.mediaType === "image" ? "video" : job.mediaType;
      let track = tracks.find((t) => t.type === trackType);
      if (!track) {
        const id = await db.tracks.create({
          projectId: job.projectId,
          type: trackType,
          label: job.mediaType,
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
          { timestamp: 0, duration: 0 }
        );

      const newId = await db.keyFrames.create({
        trackId: track.id,
        data: {
          jobId: job.id,
          type: job.input?.image_url ? "image" : "prompt",
          prompt: job.input?.prompt || "",
          url: job.input?.image_url?.url,
        },
        timestamp: lastKeyframe
          ? lastKeyframe.timestamp + 1 + lastKeyframe.duration / 1000
          : 0,
        duration:
          resolveDuration(job.input) ?? resolveDuration(job.output) ?? 5000,
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
        (a, b) => TRACK_TYPE_ORDER[a.type] - TRACK_TYPE_ORDER[b.type]
      );
    },
  });

  const handleOnDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setDragOverTracks(false);
    const jobPayload = event.dataTransfer.getData("job");
    if (!jobPayload) return false;
    const job: GenerationJob = JSON.parse(jobPayload);
    addToTrack.mutate(job);
    return true;
  };

  return (
    <div className="border-t border-border flex flex-col">
      <div className="border-b border-border px-2 flex flex-row gap-8 py-2 justify-center items-center flex-1">
        <VideoControls />
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
      </div>
      {/* <div className="border-b border-border p-1 flex flex-row gap-1">
        <div className="flex flex-row gap-0.5 flex-1 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <ListPlusIcon className="w-4 h-4 opacity-50" />
                Add Track
                <ChevronRightIcon className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
              <DropdownMenuItem className="text-sm">
                <MusicIcon className="w-4 h-4 opacity-50" />
                Music
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm">
                <MicIcon className="w-4 h-4 opacity-50" />
                Voiceover
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm">
                <FilmIcon className="w-4 h-4 opacity-50" />
                Video
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" className="px-2" disabled>
            <ListXIcon className="w-4 h-4 opacity-50" />
            Remove Track
          </Button>
        </div>
        <div className="flex flex-row gap-0.5 items-center justify-end">
          <Button variant="ghost" size="sm" disabled>
            <TrashIcon className="w-4 h-4 opacity-50" />
            Clear All
          </Button>
        </div>
      </div> */}
      <div
        className={cn(
          "min-h-64 max-h-72 h-full flex flex-row bg-background-light overflow-y-scroll transition-colors",
          {
            "bg-white/5": dragOverTracks,
          }
        )}
        onDragOver={handleOnDragOver}
        onDragLeave={() => setDragOverTracks(false)}
        onDrop={handleOnDrop}
      >
        <div className="flex flex-col justify-start w-full h-full relative">
          <div
            className="absolute z-[32] top-6 bottom-0 w-[2px] bg-white/30 ms-4"
            style={{
              left: ((playerCurrentTimestamp / 30) * 100).toFixed(2) + "%",
            }}
          ></div>
          <TimelineRuler className="z-30 pointer-events-none" />
          <div className="flex timeline-container flex-col h-full mx-4 mt-10 gap-2 z-[31] pb-2">
            {tracks.map((track) => (
              <VideoTrackRow
                key={track.id}
                data={track}
                style={{
                  minWidth: minTrackWidth,
                }}
              />
            ))}
          </div>
        </div>
        {/* <div className="flex flex-col gap-2 items-center justify-center h-full text-sm">
          <span className="text-muted-foreground">No tracks added</span>
          <Button variant="outline" className="ml-2">
            <ListPlusIcon className="w-4 h-4 opacity-50" />
            Add first track
          </Button>
        </div> */}
      </div>
    </div>
  );
}

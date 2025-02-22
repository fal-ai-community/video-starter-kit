import { db } from "@/data/db";
import {
  queryKeys,
  refreshVideoCache,
  useProjectMediaItems,
} from "@/data/queries";
import type { MediaItem, VideoKeyFrame, VideoTrack } from "@/data/schema";
import { cn, resolveDuration, resolveMediaUrl, trackIcons } from "@/lib/utils";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import {
  type HTMLAttributes,
  type MouseEventHandler,
  createElement,
  useMemo,
  useRef,
} from "react";
import { WithTooltip } from "../ui/tooltip";
import { useProjectId, useVideoProjectStore } from "@/data/store";
import { fal } from "@/lib/fal";

type VideoTrackRowProps = {
  data: VideoTrack;
} & HTMLAttributes<HTMLDivElement>;

export function VideoTrackRow({ data, ...props }: VideoTrackRowProps) {
  const { data: keyframes = [] } = useQuery({
    queryKey: ["frames", data],
    queryFn: () => db.keyFrames.keyFramesByTrack(data.id),
  });

  const mediaType = useMemo(() => keyframes[0]?.data.type, [keyframes]);

  return (
    <div
      className={cn(
        "relative w-full timeline-container",
        "flex flex-col select-none rounded overflow-hidden shrink-0",
        {
          "min-h-[64px]": mediaType,
          "min-h-[56px]": !mediaType,
        },
      )}
      {...props}
    >
      {keyframes.map((frame) => (
        <VideoTrackView
          key={frame.id}
          className="absolute top-0 bottom-0"
          style={{
            left: `${(frame.timestamp / 10 / 30).toFixed(2)}%`,
            width: `${(frame.duration / 10 / 30).toFixed(2)}%`,
          }}
          track={data}
          frame={frame}
        />
      ))}
    </div>
  );
}

type AudioWaveformProps = {
  data: MediaItem;
};

function AudioWaveform({ data }: AudioWaveformProps) {
  const { data: waveform = [] } = useQuery({
    queryKey: ["media", "waveform", data.id],
    queryFn: async () => {
      if (data.metadata?.waveform && Array.isArray(data.metadata.waveform)) {
        return data.metadata.waveform;
      }
      const { data: waveformInfo } = await fal.subscribe(
        "fal-ai/ffmpeg-api/waveform",
        {
          input: {
            media_url: resolveMediaUrl(data),
            points_per_second: 5,
            precision: 3,
          },
        },
      );
      await db.media.update(data.id, {
        ...data,
        metadata: {
          ...data.metadata,
          waveform: waveformInfo.waveform,
        },
      });
      return waveformInfo.waveform as number[];
    },
    placeholderData: keepPreviousData,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const svgWidth = waveform.length * 3;
  const svgHeight = 100;

  return (
    <div className="h-full flex items-center">
      <svg
        width="100%"
        height="80%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
      >
        <title>Audio Waveform</title>
        {waveform.map((v, index) => {
          const amplitude = Math.abs(v);
          const height = Math.max(amplitude * svgHeight, 2);
          const x = index * 3;
          const y = (svgHeight - height) / 2;

          return (
            <rect
              key={index}
              x={x}
              y={y}
              width="2"
              height={height}
              className="fill-black/40"
              rx="4"
            />
          );
        })}
      </svg>
    </div>
  );
}

type VideoTrackViewProps = {
  track: VideoTrack;
  frame: VideoKeyFrame;
} & HTMLAttributes<HTMLDivElement>;

export function VideoTrackView({
  className,
  track,
  frame,
  ...props
}: VideoTrackViewProps) {
  const queryClient = useQueryClient();
  const deleteKeyframe = useMutation({
    mutationFn: () => db.keyFrames.delete(frame.id),
    onSuccess: () => refreshVideoCache(queryClient, track.projectId),
  });
  const handleOnDelete = () => {
    deleteKeyframe.mutate();
  };

  const isSelected = useVideoProjectStore((state) =>
    state.selectedKeyframes.includes(frame.id),
  );
  const selectKeyframe = useVideoProjectStore((state) => state.selectKeyframe);
  const handleOnClick: MouseEventHandler = (e) => {
    if (e.detail > 1) {
      return;
    }
    selectKeyframe(frame.id);
  };

  const projectId = useProjectId();
  const { data: mediaItems = [] } = useProjectMediaItems(projectId);

  const media = mediaItems.find((item) => item.id === frame.data.mediaId);
  // TODO improve missing data
  if (!media) return null;

  const mediaUrl = resolveMediaUrl(media);

  const imageUrl = useMemo(() => {
    if (media.mediaType === "image") {
      return mediaUrl;
    }
    if (media.mediaType === "video") {
      return (
        media.input?.image_url ||
        media.metadata?.start_frame_url ||
        media.metadata?.end_frame_url
      );
    }
    return undefined;
  }, [media, mediaUrl]);

  const label = media.mediaType ?? "unknown";

  const trackRef = useRef<HTMLDivElement>(null);

  const calculateBounds = (trackElement: HTMLElement) => {
    const timelineElement = trackElement.closest(".timeline-container");
    const timelineRect = timelineElement?.getBoundingClientRect();
    const trackRect = trackElement.getBoundingClientRect();
    const previousTrack = trackElement.previousElementSibling;
    const nextTrack = trackElement.nextElementSibling;

    if (!timelineElement || !timelineRect) return null;

    const parentWidth = (timelineElement as HTMLElement).offsetWidth;
    const leftBoundPixels = previousTrack
      ? previousTrack.getBoundingClientRect().right - timelineRect.left
      : 0;
    const rightBoundPixels = nextTrack
      ? nextTrack.getBoundingClientRect().left - timelineRect.left - trackRect.width
      : timelineRect.width - trackRect.width;

    return {
      parentWidth,
      timelineRect,
      trackRect,
      leftBoundPixels,
      rightBoundPixels,
      leftBoundPercent: (leftBoundPixels / parentWidth) * 100,
      rightBoundPercent: (rightBoundPixels / parentWidth) * 100
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const trackElement = trackRef.current;
    if (!trackElement) return;
    const bounds = calculateBounds(trackElement);
    if (!bounds) return;
    
    const startX = e.clientX;
    const startLeft = trackElement.offsetLeft;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newLeft = startLeft + deltaX;

      if (newLeft < bounds.leftBoundPixels) {
        newLeft = bounds.leftBoundPixels;
      } else if (newLeft > bounds.rightBoundPixels) {
        newLeft = bounds.rightBoundPixels;
      }

      const newTimestamp = (newLeft / bounds.parentWidth) * 30;
      frame.timestamp = (newTimestamp < 0 ? 0 : newTimestamp) * 1000;

      trackElement.style.left = `${((frame.timestamp / 30) * 100) / 1000}%`;
      db.keyFrames.update(frame.id, { timestamp: frame.timestamp });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      queryClient.invalidateQueries({
        queryKey: queryKeys.projectPreview(projectId),
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleResize = (
    e: React.MouseEvent<HTMLDivElement>,
    direction: "left" | "right",
  ) => {
    e.stopPropagation();
    const trackElement = trackRef.current;
    if (!trackElement) return;
    
    const bounds = calculateBounds(trackElement);
    if (!bounds) return;

    const startX = e.clientX;
    const startWidth = trackElement.offsetWidth;
    const startLeft = trackElement.offsetLeft;
    const startTimestamp = frame.timestamp;
    const originalStartTime = frame.startTime || 0;
    const originalDuration = frame.duration;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newWidth = startWidth + (direction === "right" ? deltaX : -deltaX);
      let newLeft = startLeft;

      const minDuration = 1000;
      const maxDuration: number = resolveDuration(media) ?? 5000;

      if (direction === "left") {
        // Calculate new position and width while maintaining the end point
        const endPoint = startLeft + startWidth;
        
        // Calculate new left position in percentage
        const proposedLeftPercent = ((startLeft + deltaX) / bounds.parentWidth) * 100;
        
        // Ensure we don't go beyond the previous clip
        const constrainedLeftPercent = Math.max(bounds.leftBoundPercent, proposedLeftPercent);
        
        // Calculate maximum left position based on minimum duration
        const maxLeftPercent = ((endPoint - (minDuration / 1000 / 30) * bounds.parentWidth) / bounds.parentWidth) * 100;
        
        // Apply all constraints
        newLeft = Math.min(maxLeftPercent, constrainedLeftPercent) * bounds.parentWidth / 100;
        newWidth = endPoint - newLeft;
        
        // Update timestamp based on new position
        const newTimestamp = (newLeft / bounds.parentWidth) * 30 * 1000;
        frame.timestamp = Math.max(0, newTimestamp);

        // Calculate how much of the original video we're trimming from the start
        const trimAmount = startWidth - newWidth;
        const trimTime = (trimAmount / bounds.parentWidth) * 30 * 1000;
        frame.startTime = originalStartTime + trimTime;
      }

      let newDuration = (newWidth / bounds.parentWidth) * 30 * 1000;

      // Enforce duration constraints
      if (newDuration < minDuration) {
        newDuration = minDuration;
        newWidth = (minDuration / 1000 / 30) * bounds.parentWidth;
        if (direction === "left") {
          const endPoint = startLeft + startWidth;
          newLeft = endPoint - newWidth;
          frame.timestamp = (newLeft / bounds.parentWidth) * 30 * 1000;
          
          // Recalculate startTime based on how much we trimmed
          const trimAmount = startWidth - newWidth;
          const trimTime = (trimAmount / bounds.parentWidth) * 30 * 1000;
          frame.startTime = originalStartTime + trimTime;
        }
      } else if (newDuration > maxDuration) {
        newDuration = maxDuration;
        newWidth = (maxDuration / 1000 / 30) * bounds.parentWidth;
        if (direction === "left") {
          const endPoint = startLeft + startWidth;
          newLeft = endPoint - newWidth;
          frame.timestamp = (newLeft / bounds.parentWidth) * 30 * 1000;
          
          // Recalculate startTime based on how much we trimmed
          const trimAmount = startWidth - newWidth;
          const trimTime = (trimAmount / bounds.parentWidth) * 30 * 1000;
          frame.startTime = originalStartTime + trimTime;
        }
      }

      frame.duration = newDuration;
      trackElement.style.width = `${((frame.duration / 30) * 100) / 1000}%`;
      
      if (direction === "left") {
        trackElement.style.left = `${(frame.timestamp / 30 / 10).toFixed(2)}%`;
      }
    };

    const handleMouseUp = () => {
      // Round values to prevent floating point imprecision
      frame.duration = Math.round(frame.duration / 100) * 100;
      frame.timestamp = Math.round(frame.timestamp / 100) * 100;
      frame.startTime = Math.round(frame.startTime / 100) * 100;
      
      // Update styles with rounded values
      trackElement.style.width = `${((frame.duration / 30) * 100) / 1000}%`;
      trackElement.style.left = `${(frame.timestamp / 30 / 10).toFixed(2)}%`;
      
      db.keyFrames.update(frame.id, { 
        duration: frame.duration,
        timestamp: frame.timestamp,
        startTime: frame.startTime
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.projectPreview(projectId),
      });
      
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={trackRef}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => e.preventDefault()}
      aria-checked={isSelected}
      onClick={handleOnClick}
      className={cn(
        "flex flex-col border border-white/10 rounded-lg",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex flex-col select-none rounded overflow-hidden group h-full",
          {
            "bg-sky-600": track.type === "video",
            "bg-teal-500": track.type === "music",
            "bg-indigo-500": track.type === "voiceover",
          },
        )}
      >
        <div className="p-0.5 pl-1 bg-black/10 flex flex-row items-center">
          <div className="flex flex-row gap-1 text-sm items-center font-semibold text-white/60 w-full">
            <div className="flex flex-row truncate gap-1 items-center">
              {createElement(trackIcons[track.type], {
                className: "w-5 h-5 text-white",
              } as React.ComponentProps<
                (typeof trackIcons)[typeof track.type]
              >)}
              <span className="line-clamp-1 truncate text-sm mb-[2px] w-full ">
                {media.input?.prompt || label}
              </span>
            </div>
            <div className="flex flex-row shrink-0 flex-1 items-center justify-end">
              <WithTooltip tooltip="Remove content">
                <button
                  type="button"
                  className="p-1 rounded hover:bg-black/5 group-hover:text-white"
                  onClick={handleOnDelete}
                >
                  <TrashIcon className="w-3 h-3 text-white" />
                </button>
              </WithTooltip>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "p-px flex-1 items-center bg-repeat-x h-full max-h-full overflow-hidden relative"
          )}
          style={
            imageUrl
              ? {
                  background: `url(${imageUrl})`,
                  backgroundSize: "auto 100%",
                }
              : undefined
          }
        >
          {(media.mediaType === "music" || media.mediaType === "voiceover") && (
            <AudioWaveform data={media} />
          )}
          <div
            className={cn(
              "absolute left-0 z-50 top-0 bg-black/20 group-hover:bg-black/40",
              "rounded-md bottom-0 w-2 m-1 p-px cursor-ew-resize backdrop-blur-md text-white/40",
              "transition-colors flex flex-col items-center justify-center text-xs tracking-tighter",
            )}
            onMouseDown={(e) => handleResize(e, "left")}
          >
            <span className="flex gap-[1px]">
              <span className="w-px h-2 rounded bg-white/40" />
              <span className="w-px h-2 rounded bg-white/40" />
            </span>
          </div>
          <div
            className={cn(
              "absolute right-0 z-50 top-0 bg-black/20 group-hover:bg-black/40",
              "rounded-md bottom-0 w-2 m-1 p-px cursor-ew-resize backdrop-blur-md text-white/40",
              "transition-colors flex flex-col items-center justify-center text-xs tracking-tighter",
            )}
            onMouseDown={(e) => handleResize(e, "right")}
          >
            <span className="flex gap-[1px]">
              <span className="w-px h-2 rounded bg-white/40" />
              <span className="w-px h-2 rounded bg-white/40" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

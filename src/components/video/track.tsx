import { db } from "@/data/db";
import {
  queryKeys,
  refreshVideoCache,
  useProjectMediaItems,
} from "@/data/queries";
import type { VideoKeyFrame, VideoTrack } from "@/data/schema";
import { cn, resolveMediaUrl, trackIcons } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import {
  type HTMLAttributes,
  MouseEventHandler,
  createElement,
  useMemo,
  useRef,
} from "react";
import { WithTooltip } from "../ui/tooltip";
import { useProjectId, useVideoProjectStore } from "@/data/store";

type VideoTrackRowProps = {
  data: VideoTrack;
} & HTMLAttributes<HTMLDivElement>;

export function VideoTrackRow({ data, ...props }: VideoTrackRowProps) {
  const { data: keyframes = [] } = useQuery({
    queryKey: ["frames", data],
    queryFn: () => db.keyFrames.keyFramesByTrack(data.id),
  });
  return (
    <div
      className="flex flex-row relative w-full h-full timeline-container"
      {...props}
    >
      {keyframes.map((frame) => (
        <VideoTrackView
          key={frame.id}
          className="absolute top-0 bottom-0 h-[4.5rem]"
          style={{
            left: (frame.timestamp / 10 / 30).toFixed(2) + "%",
            width: (frame.duration / 10 / 30).toFixed(2) + "%",
          }}
          track={data}
          frame={frame}
        />
      ))}
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
    state.selectedKeyframes.includes(frame.id)
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
  }, [media]);
  const label = media.mediaType ?? "unknown";

  const trackRef = useRef<HTMLDivElement>(null);

  const calculateBounds = () => {
    const timelineElement = document.querySelector(".timeline-container");
    const timelineRect = timelineElement?.getBoundingClientRect();
    const trackElement = trackRef.current;
    const trackRect = trackElement?.getBoundingClientRect();

    if (!timelineRect || !trackRect || !trackElement)
      return { left: 0, right: 0 };

    const previousTrack = trackElement?.previousElementSibling;
    const nextTrack = trackElement?.nextElementSibling;

    const leftBound = previousTrack
      ? previousTrack.getBoundingClientRect().right - (timelineRect?.left || 0)
      : 0;
    const rightBound = nextTrack
      ? nextTrack.getBoundingClientRect().left -
        (timelineRect?.left || 0) -
        trackRect.width
      : timelineRect.width - trackRect.width;

    return {
      left: leftBound,
      right: rightBound,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const trackElement = trackRef.current;
    if (!trackElement) return;
    const bounds = calculateBounds();
    const startX = e.clientX;
    const startLeft = trackElement.offsetLeft;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newLeft = startLeft + deltaX;

      if (newLeft < bounds.left) {
        newLeft = bounds.left;
      } else if (newLeft > bounds.right) {
        newLeft = bounds.right;
      }

      const timelineElement = trackElement.closest(".timeline-container");
      const parentWidth = timelineElement
        ? (timelineElement as HTMLElement).offsetWidth
        : 1;
      const newTimestamp = (newLeft / parentWidth) * 30;
      frame.timestamp = (newTimestamp < 0 ? 0 : newTimestamp) * 1000;

      trackElement.style.left = `${((frame.timestamp / 30) * 100) / 1000}%`;
      db.keyFrames.update(frame.id, { timestamp: frame.timestamp });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleResize = (
    e: React.MouseEvent<HTMLDivElement>,
    direction: "left" | "right"
  ) => {
    e.stopPropagation();
    const trackElement = trackRef.current;
    if (!trackElement) return;
    const startX = e.clientX;
    const startWidth = trackElement.offsetWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newWidth = startWidth + (direction === "right" ? deltaX : -deltaX);

      const minDuration = 3000;
      const maxDuration = (media.metadata?.duration ?? 5) * 1000; // max duration in milliseconds

      const timelineElement = trackElement.closest(".timeline-container");
      const parentWidth = timelineElement
        ? (timelineElement as HTMLElement).offsetWidth
        : 1;
      let newDuration = (newWidth / parentWidth) * 30 * 1000;

      if (newDuration < minDuration) {
        newWidth = (minDuration / 1000 / 30) * parentWidth;
        newDuration = minDuration;
      } else if (newDuration > maxDuration) {
        newWidth = (maxDuration / 1000 / 30) * parentWidth;
        newDuration = maxDuration;
      }

      frame.duration = newDuration;
      trackElement.style.width = `${((frame.duration / 30) * 100) / 1000}%`;
    };

    const handleMouseUp = () => {
      frame.duration = Math.round(frame.duration / 100) * 100;
      trackElement.style.width = `${((frame.duration / 30) * 100) / 1000}%`;
      db.keyFrames.update(frame.id, { duration: frame.duration });
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
      role="checkbox"
      aria-checked={isSelected}
      onClick={handleOnClick}
      className={cn(
        "flex flex-col border border-transparent rounded-lg h-full",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex flex-col select-none rounded overflow-hidden group h-full",
          {
            "bg-gradient-to-t from-green-800 to-green-600":
              track.type === "video",
            "bg-gradient-to-t from-sky-800 to-sky-600": track.type === "music",
            "bg-gradient-to-t from-violet-800 to-violet-600":
              track.type === "voiceover",
          }
        )}
      >
        <div className="px-2 py-0.5 bg-black/10 flex flex-row items-center">
          <div className="flex flex-row gap-1 text-sm items-center font-semibold text-white/60 w-full">
            <div className="flex flex-row gap-1 items-center">
              {createElement(trackIcons[track.type], {
                className: "w-3 h-3 opacity-70 stroke-[3px]",
              } as any)}
              <span>{label}</span>
            </div>
            <div className="flex flex-row flex-1 items-center justify-end">
              <WithTooltip tooltip="Remove content">
                <button
                  className="p-1 rounded hover:bg-black/5 group-hover:text-white"
                  onClick={handleOnDelete}
                >
                  <TrashIcon className="w-3 h-3 stroke-2" />
                </button>
              </WithTooltip>
            </div>
          </div>
        </div>
        <div className="p-px flex-1 items-center h-full relative">
          {imageUrl && <img src={imageUrl} className="rounded h-8" alt="" />}
          {/* TODO: Add audio waveform */}
          {/* {(media.mediaType === "music" || media.mediaType === "voiceover") && (
            <AudioWaveform data={media} />
          )} */}
          {/* <div
            className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize"
            onMouseDown={(e) => handleResize(e, "left")}
          /> */}
          <div
            className={cn(
              "absolute right-0 top-0 bg- bottom-0 w-2 m-1 cursor-ew-resize",
              {
                "bg-green-400/50 rounded-md": track.type === "video",
                "bg-sky-400/50 rounded-md": track.type === "music",
                "bg-violet-400/50 rounded-md": track.type === "voiceover",
              }
            )}
            onMouseDown={(e) => handleResize(e, "right")}
          />
        </div>
      </div>
    </div>
  );
}

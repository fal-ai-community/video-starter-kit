import { db } from "@/data/db";
import {
  queryKeys,
  refreshVideoCache,
  useProjectMediaItems,
} from "@/data/queries";
import type { MediaItem, VideoKeyFrame, VideoTrack } from "@/data/schema";
import { useProjectId, useVideoProjectStore } from "@/data/store";
import {
  cn,
  getOrCreateBlobUrl,
  resolveDuration,
  resolveMediaUrl,
  trackIcons,
} from "@/lib/utils";
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

type VideoTrackRowProps = {
  data: VideoTrack;
  pixelsPerMs: number;
  timelineDurationMs: number;
} & HTMLAttributes<HTMLDivElement>;

export function VideoTrackRow({
  data,
  pixelsPerMs,
  timelineDurationMs,
  ...props
}: VideoTrackRowProps) {
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
            left: `${frame.timestamp * pixelsPerMs}px`,
            width: `${frame.duration * pixelsPerMs}px`,
          }}
          track={data}
          frame={frame}
          pixelsPerMs={pixelsPerMs}
          timelineDurationMs={timelineDurationMs}
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

      const audioUrl = resolveMediaUrl(data);
      if (!audioUrl) {
        throw new Error("No media URL found");
      }

      try {
        const proxyUrl = `${window.location.origin}/api/download?url=${encodeURIComponent(audioUrl)}`;
        const response = await fetch(proxyUrl);
        const arrayBuffer = await response.arrayBuffer();

        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const pointsPerSecond = 5;
        const precision = 3;
        const channelData = audioBuffer.getChannelData(0);
        const duration = audioBuffer.duration;
        const totalPoints = Math.floor(duration * pointsPerSecond);
        const samplesPerPoint = Math.floor(channelData.length / totalPoints);

        const waveformData: number[] = [];
        for (let i = 0; i < totalPoints; i++) {
          const start = i * samplesPerPoint;
          const end = Math.min(start + samplesPerPoint, channelData.length);

          let sum = 0;
          for (let j = start; j < end; j++) {
            sum += channelData[j] * channelData[j];
          }
          const rms = Math.sqrt(sum / (end - start));
          waveformData.push(Number(rms.toFixed(precision)));
        }

        await db.media.update(data.id, {
          ...data,
          metadata: {
            ...data.metadata,
            waveform: waveformData,
          },
        });

        return waveformData;
      } catch (error) {
        console.error("Failed to generate waveform locally:", error);
        return [];
      }
    },
    placeholderData: keepPreviousData,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const svgHeight = 100;

  if (waveform.length === 0) {
    return null;
  }

  return (
    <div className="h-full flex items-center overflow-hidden">
      <div className="w-full">
        <svg
          width="100%"
          height="80%"
          viewBox={`0 0 ${waveform.length} ${svgHeight}`}
          preserveAspectRatio="none"
        >
          <title>Audio Waveform</title>
          {waveform.map((v, index) => {
            const amplitude = Math.abs(v);
            const height = Math.max(amplitude * svgHeight, 2);
            const x = index;
            const y = (svgHeight - height) / 2;

            return (
              <rect
                key={`waveform-${index}-${x}`}
                x={x}
                y={y}
                width="1"
                height={height}
                className="fill-black/40"
                rx="4"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

type VideoTrackViewProps = {
  track: VideoTrack;
  frame: VideoKeyFrame;
  pixelsPerMs: number;
  timelineDurationMs: number;
} & HTMLAttributes<HTMLDivElement>;

export function VideoTrackView({
  className,
  track,
  frame,
  pixelsPerMs,
  timelineDurationMs,
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
  const mediaUrl = media ? resolveMediaUrl(media) : null;

  const trackRef = useRef<HTMLDivElement>(null);

  const imageUrl = useMemo(() => {
    if (!media) return undefined;
    if (media.mediaType === "image") {
      return mediaUrl;
    }
    if (media.mediaType === "video") {
      // Prioritize thumbnailBlob over URLs
      if (media.thumbnailBlob) {
        return getOrCreateBlobUrl(`${media.id}-thumbnail`, media.thumbnailBlob);
      }
      return (
        media.metadata?.thumbnail_url ||
        media.input?.image_url ||
        media.metadata?.start_frame_url ||
        media.metadata?.end_frame_url
      );
    }
    return undefined;
  }, [media, mediaUrl]);

  // TODO improve missing data
  if (!media) return null;

  const label = media.mediaType ?? "unknown";

  const calculateBounds = () => {
    const trackElement = trackRef.current;
    const timelineElement = trackElement?.closest(
      ".timeline-container",
    ) as HTMLElement | null;
    const timelineRect = timelineElement?.getBoundingClientRect();
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
    if (
      (e.target as HTMLElement).closest(
        'button,[role="button"],a,input,textarea,select',
      )
    ) {
      return;
    }

    console.debug("[DRAG] Starting drag operation");
    const trackElement = trackRef.current;
    if (!trackElement) return;
    const bounds = calculateBounds();
    const startX = e.clientX;
    const startLeft = trackElement.offsetLeft;
    const duplicateMode = e.ctrlKey || e.metaKey;
    const originalTimestamp = frame.timestamp;
    const originalLeftStyle = trackElement.style.left;
    let duplicateTimestamp = frame.timestamp;

    const applyLeftStyle = (timestamp: number) => {
      trackElement.style.left = `${timestamp * pixelsPerMs}px`;
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newLeft = startLeft + deltaX;

      if (newLeft < bounds.left) {
        newLeft = bounds.left;
      } else if (newLeft > bounds.right) {
        newLeft = bounds.right;
      }

      const maxTimestamp = Math.max(timelineDurationMs - frame.duration, 0);
      const calculatedTimestamp = newLeft / pixelsPerMs;
      const sanitizedTimestamp = Math.max(
        0,
        Math.min(calculatedTimestamp, maxTimestamp),
      );
      const normalizedTimestamp = Math.round(sanitizedTimestamp);

      if (duplicateMode) {
        duplicateTimestamp = normalizedTimestamp;
        applyLeftStyle(normalizedTimestamp);
        return;
      }

      frame.timestamp = normalizedTimestamp;
      applyLeftStyle(frame.timestamp);
      db.keyFrames.update(frame.id, { timestamp: frame.timestamp });
    };

    const handleMouseUp = async () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      if (duplicateMode) {
        if (originalLeftStyle) {
          trackElement.style.left = originalLeftStyle;
        } else {
          applyLeftStyle(originalTimestamp);
        }

        await db.keyFrames.create({
          trackId: frame.trackId,
          data: { ...frame.data },
          timestamp: duplicateTimestamp,
          duration: frame.duration,
        });
      }

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
    console.debug(`[TRIM-${direction.toUpperCase()}] Starting trim operation`);
    const trackElement = trackRef.current;
    if (!trackElement) return;
    const startX = e.clientX;
    const startTimestamp = frame.timestamp;
    const startDuration = frame.duration;
    const minDuration = 1000;
    const mediaDuration = resolveDuration(media) ?? 5000;
    const maxDuration = mediaDuration;

    // Track current values during drag
    let currentTimestamp = startTimestamp;
    let currentDuration = startDuration;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaMs = deltaX / pixelsPerMs;

      if (direction === "right") {
        // Right trim: keep LEFT edge fixed, move RIGHT edge
        // Timestamp stays unchanged, duration changes
        currentDuration = startDuration + deltaMs;

        const availableDuration = Math.max(
          timelineDurationMs - currentTimestamp,
          minDuration,
        );
        const maxAllowedDuration = Math.min(maxDuration, availableDuration);

        // Apply constraints
        if (currentDuration < minDuration) {
          currentDuration = minDuration;
        } else if (currentDuration > maxAllowedDuration) {
          currentDuration = maxAllowedDuration;
        }

        // Mutate frame directly so React uses updated values on re-render
        frame.duration = currentDuration;

        // Update DOM for visual feedback
        trackElement.style.width = `${currentDuration * pixelsPerMs}px`;
      } else {
        // Left trim: keep RIGHT edge fixed, move LEFT edge
        // This is standard video editor behavior for left trim
        const rightEdge = startTimestamp + startDuration;
        currentTimestamp = startTimestamp + deltaMs;
        currentDuration = rightEdge - currentTimestamp;

        // Ensure timestamp doesn't go negative
        if (currentTimestamp < 0) {
          currentTimestamp = 0;
          currentDuration = rightEdge;
        }

        // Ensure duration doesn't go below minimum
        if (currentDuration < minDuration) {
          currentDuration = minDuration;
          currentTimestamp = rightEdge - minDuration;
        }

        // Ensure duration doesn't exceed max
        if (currentDuration > maxDuration) {
          currentDuration = maxDuration;
          currentTimestamp = rightEdge - maxDuration;
        }

        // Mutate frame directly so React uses updated values on re-render
        frame.timestamp = currentTimestamp;
        frame.duration = currentDuration;

        // Update DOM for visual feedback
        trackElement.style.left = `${currentTimestamp * pixelsPerMs}px`;
        trackElement.style.width = `${currentDuration * pixelsPerMs}px`;
      }
    };

    const handleMouseUp = () => {
      if (direction === "right") {
        // Right trim: round duration, timestamp stays unchanged
        currentDuration = Math.round(currentDuration / 100) * 100;

        // Ensure final constraints
        currentDuration = Math.min(
          Math.max(currentDuration, minDuration),
          Math.max(timelineDurationMs - currentTimestamp, minDuration),
        );

        // Update database with new duration only
        db.keyFrames.update(frame.id, { duration: currentDuration });
      } else {
        // Left trim: round timestamp, recalculate duration to preserve right edge
        const rightEdge = startTimestamp + startDuration;
        currentTimestamp = Math.round(currentTimestamp / 100) * 100;
        currentDuration = rightEdge - currentTimestamp;

        // Ensure constraints while keeping right edge fixed
        if (currentDuration < minDuration) {
          currentDuration = minDuration;
          currentTimestamp = rightEdge - minDuration;
        }
        if (currentDuration > maxDuration) {
          currentDuration = maxDuration;
          currentTimestamp = rightEdge - maxDuration;
        }

        // Update database with both timestamp and duration
        db.keyFrames.update(frame.id, {
          timestamp: currentTimestamp,
          duration: currentDuration,
        });
      }

      // Invalidate queries to trigger React re-render with new values
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
        <div className="relative z-60 p-0.5 pl-1 bg-black/10 flex flex-row items-center pointer-events-auto">
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
                  onPointerDownCapture={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOnDelete();
                  }}
                >
                  <TrashIcon className="w-3 h-3 text-white" />
                </button>
              </WithTooltip>
            </div>
          </div>
        </div>
        <div
          className="p-px flex-1 items-center bg-repeat-x h-full max-h-full overflow-hidden relative"
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
          {/* Right trim handle */}
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

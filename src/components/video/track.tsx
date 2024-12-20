import { db } from "@/data/db";
import { refreshVideoCache } from "@/data/queries";
import type { VideoKeyFrame, VideoTrack } from "@/data/schema";
import { cn, trackIcons } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { type HTMLAttributes, createElement } from "react";
import { WithTooltip } from "../ui/tooltip";

type VideoTrackRowProps = {
  data: VideoTrack;
} & HTMLAttributes<HTMLDivElement>;

export function VideoTrackRow({ data, ...props }: VideoTrackRowProps) {
  const { data: keyframes = [] } = useQuery({
    queryKey: ["frames", data],
    queryFn: () => db.keyFrames.keyFramesByTrack(data.id),
  });
  return (
    <div className="flex flex-row relative h-16 w-full" {...props}>
      {keyframes.map((frame) => (
        <VideoTrackView
          key={frame.id}
          className="absolute top-0 bottom-0"
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

// const colors = ["teal", "sky", "violet", "rose", "orange"] as const;
// type VideoTrackColor = (typeof colors)[number];

type VideoTrackViewProps = {
  // color?: VideoTrackColor;
  track: VideoTrack;
  frame: VideoKeyFrame;
} & HTMLAttributes<HTMLDivElement>;

export function VideoTrackView({
  className,
  // color = colors[0],
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
  return (
    <div
      className={cn(
        "flex flex-col rounded overflow-hidden group",
        // https://tailwindcss.com/docs/content-configuration#dynamic-class-names
        {
          "bg-teal-500 dark:bg-teal-600": track.type === "video",
          "bg-sky-500 dark:bg-sky-600": track.type === "music",
          "bg-violet-500 dark:bg-violet-600": track.type === "voiceover",
        },
        className,
      )}
      {...props}
    >
      <div className="px-2 py-0.5 bg-black/10 flex flex-row items-center">
        <div className="flex flex-row gap-1 text-sm items-center font-semibold text-white/60 w-full">
          <div className="flex flex-row gap-1 items-center">
            {createElement(trackIcons[track.type], {
              className: "w-3 h-3 opacity-70 stroke-[3px]",
            } as any)}
            <span>{track.label}</span>
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
      <div className="p-px flex-1"></div>
    </div>
  );
}

import { db } from "@/data/db";
import { refreshVideoCache, useProjectJobs } from "@/data/queries";
import type { VideoKeyFrame, VideoTrack } from "@/data/schema";
import { cn, trackIcons } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { type HTMLAttributes, MouseEventHandler, createElement } from "react";
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
  const { data: jobs = [] } = useProjectJobs(projectId);

  const output = jobs.find((s) => s.id === frame.data.jobId)?.output;

  const imageUrl = output?.images?.[0]?.url;
  const videoUrl = output?.video?.url;

  const label = imageUrl ? "Image" : videoUrl ? "Video" : track.label;

  return (
    <div
      className={cn(
        "flex flex-col select-none rounded overflow-hidden group opacity-90",
        // https://tailwindcss.com/docs/content-configuration#dynamic-class-names
        {
          "bg-teal-500 dark:bg-teal-600": track.type === "video",
          "bg-sky-500 dark:bg-sky-600": track.type === "music",
          "bg-violet-500 dark:bg-violet-600": track.type === "voiceover",
          "opacity-100": isSelected,
        },
        className
      )}
      role="checkbox"
      aria-checked={isSelected}
      onClick={handleOnClick}
      {...props}
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
      <div className="p-px flex-1 relative">
        {imageUrl && (
          <img
            src={imageUrl}
            className="rounded-md h-8 m-1 absolute top-0 left-0"
            alt=""
          />
        )}
        {videoUrl && (
          <video
            src={videoUrl}
            className="rounded-md h-8 m-1 absolute top-0 left-0"
            controls={false}
            poster={imageUrl}
            style={{ pointerEvents: "none" }}
          />
        )}
      </div>
    </div>
  );
}

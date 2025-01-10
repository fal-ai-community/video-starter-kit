import { db } from "@/data/db";
import { queryKeys } from "@/data/queries";
import type { GenerationJob } from "@/data/schema";
import { useProjectId, useVideoProjectStore } from "@/data/store";
import { fal } from "@/lib/fal";
import { cn, trackIcons } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow, formatDuration } from "date-fns";
import { CircleXIcon, HourglassIcon } from "lucide-react";
import {
  type DragEventHandler,
  Fragment,
  type HTMLAttributes,
  createElement,
  useMemo,
} from "react";
import { Badge } from "./ui/badge";
import { LoadingIcon } from "./ui/icons";
import { Separator } from "./ui/separator";
import { useToast } from "@/hooks/use-toast";

type JobItemProps = {
  data: GenerationJob;
  onOpen: (data: GenerationJob) => void;
  draggable?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export function JobItem({
  data,
  className,
  onOpen,
  draggable = true,
  ...props
}: JobItemProps) {
  const isDone = data.status === "completed" || data.status === "failed";
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  const { toast } = useToast();
  useQuery({
    queryKey: queryKeys.projectJob(projectId, data.id),
    queryFn: async () => {
      const queueStatus = await fal.queue.status(data.endpointId, {
        requestId: data.requestId,
      });
      if (queueStatus.status === "IN_PROGRESS") {
        await db.jobs.update(data.id, {
          ...data,
          status: "running",
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.projectJobs(data.projectId),
        });
      }
      if (queueStatus.status === "COMPLETED") {
        try {
          const result = await fal.queue.result(data.endpointId, {
            requestId: data.requestId,
          });
          await db.jobs.update(data.id, {
            ...data,
            output: result.data,
            endedAt: Date.now(),
            status: "completed",
          });
          toast({
            title: "Generation completed",
            description: `Your ${data.mediaType} has been generated successfully.`,
          });
        } catch {
          await db.jobs.update(data.id, {
            ...data,
            endedAt: Date.now(),
            status: "failed",
          });
          toast({
            title: "Generation failed",
            description: `Failed to generate ${data.mediaType}.`,
          });
        } finally {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.projectJobs(data.projectId),
          });
        }
      }
      return null;
    },
    enabled: !isDone,
    refetchInterval: data.mediaType === "video" ? 20000 : 500,
  });
  const mediaUrl = Array.isArray(data.output?.images)
    ? data.output.images[0].url
    : data.output?.video?.url || "";
  const jobId = data.id.split("-")[0];
  const handleOnDragStart: DragEventHandler<HTMLDivElement> = (event) => {
    event.dataTransfer.setData("job", JSON.stringify(data));
    return true;
    // event.dataTransfer.dropEffect = "copy";
  };
  return (
    <div
      className={cn(
        "flex items-start space-x-2 py-2 w-full px-4 hover:bg-accent transition-all",
        className
      )}
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        onOpen(data);
      }}
      draggable={draggable && data.status === "completed"}
      onDragStart={handleOnDragStart}
    >
      {draggable && data.status === "completed" && (
        <div className="flex items-center h-full cursor-grab text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
      )}
      <div className="w-16 h-16 aspect-square relative rounded overflow-hidden border border-transparent hover:border-accent transition-all">
        {data.status === "completed" ? (
          <>
            {data.mediaType === "image" && (
              <img
                src={mediaUrl}
                alt="Generated media"
                className="h-full w-full object-cover"
              />
            )}
            {data.mediaType === "video" && (
              <video
                src={mediaUrl}
                className="h-full w-full object-cover"
                controls={false}
                style={{ pointerEvents: "none" }}
              />
            )}
            <div
              className={cn(
                "w-full h-full flex items-center justify-center top-0 left-0 absolute p-2 z-50",
                (data.mediaType === "music" ||
                  data.mediaType === "voiceover") &&
                  "rounded-full bg-white/5"
              )}
            >
              <div className="z-50 bg-black/60 p-2 rounded-full flex items-center justify-center text-muted-foreground">
                {createElement(trackIcons[data.mediaType], {
                  className: "w-5 h-5 text-white",
                } as any)}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center text-muted-foreground">
            {data.status === "running" && <LoadingIcon className="w-8 h-8" />}
            {data.status === "pending" && (
              <HourglassIcon className="w-8 h-8 animate-spin ease-in-out delay-700 duration-1000" />
            )}
            {data.status === "failed" && (
              <CircleXIcon className="w-8 h-8 text-rose-700" />
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col h-full gap-1 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex flex-row gap-1 items-center">
            {createElement(trackIcons[data.mediaType], {
              className: "w-4 h-4 stroke-1",
            } as any)}
            Job <code className="text-muted-foreground">#{jobId}</code>
          </h3>
          {data.status !== "completed" && (
            <Badge
              variant="outline"
              className={cn({
                "text-rose-700": data.status === "failed",
                "text-sky-500": data.status === "running",
                "text-muted-foreground": data.status === "pending",
              })}
            >
              {data.status}
            </Badge>
          )}
        </div>
        <div className="flex flex-row gap-2 justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(data.createdAt, { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
}

type JobsPanelProps = {
  jobs: GenerationJob[];
  mediaType: string;
} & HTMLAttributes<HTMLDivElement>;

export function JobsPanel({ className, jobs, mediaType }: JobsPanelProps) {
  const setSelectedMediaId = useVideoProjectStore((s) => s.setSelectedMediaId);
  const handleOnOpen = (data: GenerationJob) => {
    setSelectedMediaId(data.id);
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden divide-y divide-border",
        className
      )}
    >
      {jobs
        .filter((job) => {
          if (mediaType === "all") return true;
          return job.mediaType === mediaType;
        })
        .map((job, index) => (
          <Fragment key={job.id}>
            <JobItem data={job} onOpen={handleOnOpen} />
          </Fragment>
        ))}
    </div>
  );
}

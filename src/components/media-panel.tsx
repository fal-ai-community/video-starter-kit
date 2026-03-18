"use client";

import { db } from "@/data/db";
import { queryKeys } from "@/data/queries";
import type { MediaItem } from "@/data/schema";
import { useProjectId, useVideoProjectStore } from "@/data/store";
import { useToast } from "@/hooks/use-toast";
import { calculateModelCost, fal, getEnhancedApiInfo } from "@/lib/fal";
import { extractVideoThumbnail, getMediaMetadata } from "@/lib/ffmpeg";
import { getRunwareClient } from "@/lib/runware";
import { RUNWARE_ENDPOINTS } from "@/lib/runware-models";
import {
  cn,
  downloadUrlAsBlob,
  getOrCreateBlobUrl,
  resolveMediaUrl,
  trackIcons,
} from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  CircleXIcon,
  GripVerticalIcon,
  HourglassIcon,
  ImageIcon,
  MicIcon,
  MusicIcon,
  VideoIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  type DragEventHandler,
  Fragment,
  type HTMLAttributes,
  createElement,
} from "react";
import { Badge } from "./ui/badge";
import { LoadingIcon } from "./ui/icons";

type MediaItemRowProps = {
  data: MediaItem;
  onOpen: (data: MediaItem) => void;
  draggable?: boolean;
} & HTMLAttributes<HTMLDivElement>;

type GeneratedMediaItem = Extract<MediaItem, { kind: "generated" }>;

export function MediaItemRow({
  data,
  className,
  onOpen,
  draggable = true,
  ...props
}: MediaItemRowProps) {
  const t = useTranslations("app.toast");
  const isDone = data.status === "completed" || data.status === "failed";
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  const { toast } = useToast();
  useQuery({
    queryKey: queryKeys.projectMedia(projectId, data.id),
    queryFn: async () => {
      // Handle uploaded videos without thumbnails
      if (
        data.kind === "uploaded" &&
        data.mediaType === "video" &&
        !data.thumbnailBlob
      ) {
        console.log(
          "[DEBUG] Generating thumbnail for uploaded video:",
          data.id,
        );
        const videoUrl = resolveMediaUrl(data);
        if (videoUrl) {
          const thumbnailBlob = await extractVideoThumbnail(videoUrl);
          if (thumbnailBlob) {
            console.log(
              "[DEBUG] Thumbnail blob generated for uploaded video:",
              {
                size: thumbnailBlob.size,
                type: thumbnailBlob.type,
              },
            );
            await db.media.update(data.id, {
              ...data,
              thumbnailBlob: thumbnailBlob,
            });
            await queryClient.invalidateQueries({
              queryKey: queryKeys.projectMediaItems(data.projectId),
            });
          }
        }
        return null;
      }

      if (data.kind === "uploaded") return null;

      // Check for timeout (10 minutes)
      const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
      const elapsedTime = Date.now() - data.createdAt;

      if (elapsedTime > TIMEOUT_MS && data.status !== "completed") {
        console.error("[DEBUG] Task timed out after 10 minutes:", data.id);
        await db.media.update(data.id, {
          ...data,
          status: "failed",
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.projectMediaItems(data.projectId),
        });
        toast({
          title: t("generationFailed"),
          description: `${t("generationFailedDesc", {
            mediaType: data.mediaType,
          })} (timeout)`,
        });
        return null;
      }

      const provider = data.provider || "fal";
      console.log(
        "[DEBUG] Polling - provider:",
        provider,
        "requestId:",
        data.requestId,
        "taskUUID:",
        data.taskUUID,
      );
      console.log("[DEBUG] Polling - endpointId:", data.endpointId);

      if (provider === "fal") {
        if (!data.requestId) {
          console.error("[DEBUG] requestId is missing for FAL job!", data);
          throw new Error("requestId is required for fal provider");
        }
        const queueStatus = await fal.queue.status(data.endpointId, {
          requestId: data.requestId,
        });

        if (queueStatus.status === "IN_PROGRESS") {
          await db.media.update(data.id, {
            ...data,
            status: "running",
          });
          await queryClient.invalidateQueries({
            queryKey: queryKeys.projectMediaItems(data.projectId),
          });
        }

        let media: Partial<MediaItem> = {};

        if (queueStatus.status === "COMPLETED") {
          try {
            if (!data.requestId) {
              throw new Error("Request ID is missing");
            }
            const result = await fal.queue.result(data.endpointId, {
              requestId: data.requestId,
            });

            console.log("[DEBUG] FAL result:", JSON.stringify(result, null, 2));

            // Calculate estimated cost for FAL (FAL API doesn't return actual cost)
            // Use stored input parameters from media item to calculate
            const inputParams = data.input || {};
            const cost = calculateModelCost(data.endpointId, {
              duration: inputParams.duration,
              width: inputParams.width,
              height: inputParams.height,
              textLength:
                inputParams.prompt?.length || inputParams.text?.length || 0,
              quantity: 1,
            });

            // Download media from FAL URL and store as Blob
            let blob: Blob | undefined;
            let mediaUrl: string | undefined;

            // Extract URL from different FAL output formats
            if (result.data) {
              if (
                "video" in result.data &&
                typeof result.data.video === "object" &&
                result.data.video !== null &&
                "url" in result.data.video
              ) {
                mediaUrl = (result.data.video as { url: string }).url;
              } else if (
                "images" in result.data &&
                Array.isArray(result.data.images)
              ) {
                mediaUrl = result.data.images[0]?.url;
              } else if (
                "audio_file" in result.data &&
                typeof result.data.audio_file === "object" &&
                result.data.audio_file !== null &&
                "url" in result.data.audio_file
              ) {
                mediaUrl = (result.data.audio_file as { url: string }).url;
              } else if (
                "audio" in result.data &&
                typeof result.data.audio === "object" &&
                result.data.audio !== null &&
                "url" in result.data.audio
              ) {
                mediaUrl = (result.data.audio as { url: string }).url;
              }
            }

            if (mediaUrl) {
              try {
                console.log("[DEBUG] Downloading FAL media from:", mediaUrl);
                blob = await downloadUrlAsBlob(mediaUrl);
                console.log("[DEBUG] Downloaded FAL blob:", {
                  size: blob.size,
                  type: blob.type,
                });
              } catch (error) {
                console.error("[DEBUG] Failed to download FAL media:", error);
                // Continue without blob - will use URL as fallback
              }
            }

            media = {
              ...data,
              output: result.data,
              status: "completed",
              blob,
              metadata: {
                ...(data.metadata || {}),
                cost: cost,
              },
            };

            await db.media.update(data.id, media);

            toast({
              title: t("generationCompleted"),
              description: t("generationCompletedDesc", {
                mediaType: data.mediaType,
              }),
            });
          } catch (error: any) {
            console.error("[DEBUG] FAL job FAILED during result fetch");
            console.error("[DEBUG] FAL job failure error object:", error);
            console.error(
              "[DEBUG] FAL job failure error message:",
              error?.message,
            );
            console.error("[DEBUG] FAL job failure error body:", error?.body);
            console.error(
              "[DEBUG] FAL job failure error response:",
              error?.response,
            );

            await db.media.update(data.id, {
              ...data,
              status: "failed",
            });
            toast({
              title: t("generationFailed"),
              description: t("generationFailedDesc", {
                mediaType: data.mediaType,
              }),
            });
          } finally {
            await queryClient.invalidateQueries({
              queryKey: queryKeys.projectMediaItems(data.projectId),
            });
          }

          if (media.mediaType !== "image") {
            const mediaMetadata = await getMediaMetadata(media as MediaItem);

            let thumbnailBlob: Blob | null = null;
            if (media.mediaType === "video") {
              const videoUrl = resolveMediaUrl(media as MediaItem);
              if (videoUrl) {
                thumbnailBlob = await extractVideoThumbnail(videoUrl);
                if (thumbnailBlob) {
                  console.log("[DEBUG] FAL thumbnail blob generated:", {
                    size: thumbnailBlob.size,
                    type: thumbnailBlob.type,
                  });
                }
              }
            }

            await db.media.update(data.id, {
              ...media,
              thumbnailBlob: thumbnailBlob ?? undefined,
              metadata: {
                ...(mediaMetadata?.media || {}),
                cost: media.metadata?.cost, // Preserve cost
                start_frame_url: media.output?.start_frame_url,
                end_frame_url: media.output?.end_frame_url,
              },
            });

            await queryClient.invalidateQueries({
              queryKey: queryKeys.projectMediaItems(data.projectId),
            });
          }
        }
      } else {
        console.log("[DEBUG] Runware item - checking for thumbnail generation");

        if (data.kind !== "generated") {
          return null;
        }

        let currentData: GeneratedMediaItem = data;

        if (data.status !== "completed") {
          if (!data.taskUUID) {
            console.error("[DEBUG] taskUUID is missing for Runware job!", data);
            throw new Error("taskUUID is required for runware provider");
          }

          const runware = await getRunwareClient();

          if (!runware) {
            console.error("[DEBUG] Runware client is not initialized");
            return null;
          }

          const response = await runware.getResponse({
            taskUUID: data.taskUUID,
          });

          const result = Array.isArray((response as any)?.data)
            ? (response as any).data[0]
            : (response as any)?.data || response;

          console.log("[DEBUG] Runware getResponse result:", result);

          if (!result) {
            return null;
          }

          if (result.error || result.status === "failed") {
            await db.media.update(data.id, {
              ...data,
              status: "failed",
            });

            toast({
              title: t("generationFailed"),
              description: t("generationFailedDesc", {
                mediaType: data.mediaType,
              }),
            });

            await queryClient.invalidateQueries({
              queryKey: queryKeys.projectMediaItems(data.projectId),
            });

            return null;
          }

          const hasOutput = Boolean(
            result.imageURL ||
              result.videoURL ||
              result.audioURL ||
              result.audioDataURI ||
              result.audioBase64Data,
          );

          if (!hasOutput && result.status !== "completed") {
            if (data.status !== "running") {
              await db.media.update(data.id, {
                ...data,
                status: "running",
              });

              await queryClient.invalidateQueries({
                queryKey: queryKeys.projectMediaItems(data.projectId),
              });
            }

            return null;
          }

          // Download media from Runware URL and store as Blob
          let blob: Blob | undefined;
          const mediaUrl =
            result.videoURL || result.imageURL || result.audioURL;

          if (mediaUrl) {
            try {
              console.log(
                "[DEBUG] Downloading Runware media from async task:",
                mediaUrl,
              );
              blob = await downloadUrlAsBlob(mediaUrl);
              console.log("[DEBUG] Downloaded blob from async task:", {
                size: blob.size,
                type: blob.type,
              });
            } catch (error) {
              console.error(
                "[DEBUG] Failed to download Runware media from async task:",
                error,
              );
              // Continue without blob - will use URL as fallback
            }
          }

          currentData = {
            ...data,
            output: result,
            status: "completed",
            blob,
          } as GeneratedMediaItem;

          await db.media.update(data.id, currentData);

          toast({
            title: t("generationCompleted"),
            description: t("generationCompletedDesc", {
              mediaType: data.mediaType,
            }),
          });

          await queryClient.invalidateQueries({
            queryKey: queryKeys.projectMediaItems(data.projectId),
          });
        }

        if (currentData.status === "completed") {
          // Generate and store thumbnail as Blob if not already present
          if (currentData.mediaType === "video" && !currentData.thumbnailBlob) {
            console.log("[DEBUG] Generating thumbnail blob for video");
            const videoUrl = resolveMediaUrl(currentData);
            if (videoUrl) {
              const thumbnailBlob = await extractVideoThumbnail(videoUrl);
              if (thumbnailBlob) {
                console.log("[DEBUG] Thumbnail blob generated:", {
                  size: thumbnailBlob.size,
                  type: thumbnailBlob.type,
                });
                await db.media.update(data.id, {
                  ...currentData,
                  thumbnailBlob: thumbnailBlob,
                });
                await queryClient.invalidateQueries({
                  queryKey: queryKeys.projectMediaItems(data.projectId),
                });

                currentData = {
                  ...currentData,
                  thumbnailBlob: thumbnailBlob,
                } as GeneratedMediaItem;
              }
            }
          }

          if (
            currentData.mediaType !== "image" &&
            !currentData.metadata?.duration
          ) {
            console.log(
              "[DEBUG] Extracting metadata for Runware",
              currentData.mediaType,
            );
            const mediaMetadata = await getMediaMetadata(currentData);
            await db.media.update(data.id, {
              ...currentData,
              metadata: {
                ...(currentData.metadata || {}),
                ...(mediaMetadata?.media || {}),
              },
            });
            await queryClient.invalidateQueries({
              queryKey: queryKeys.projectMediaItems(data.projectId),
            });
            console.log("[DEBUG] Metadata extracted:", mediaMetadata?.media);

            currentData = {
              ...currentData,
              metadata: {
                ...(currentData.metadata || {}),
                ...(mediaMetadata?.media || {}),
              },
            } as GeneratedMediaItem;
          }

          if (!currentData.thumbnailBlob && !currentData.metadata?.duration) {
            console.log(
              "[DEBUG] Runware item should already be completed, skipping polling",
            );
            await db.media.update(data.id, {
              ...currentData,
              status: "completed",
            });
            await queryClient.invalidateQueries({
              queryKey: queryKeys.projectMediaItems(data.projectId),
            });
          }
        }
        return null;
      }

      return null;
    },
    enabled:
      (!isDone && data.kind === "generated") ||
      (data.provider === "runware" &&
        data.status === "completed" &&
        data.mediaType === "video" &&
        !data.thumbnailBlob) ||
      (data.kind === "uploaded" &&
        data.mediaType === "video" &&
        !data.thumbnailBlob),
    refetchInterval: () => {
      // Enable polling for uploaded videos without thumbnails
      if (
        data.kind === "uploaded" &&
        data.mediaType === "video" &&
        !data.thumbnailBlob
      ) {
        return 5000; // Check every 5 seconds
      }
      if (data.kind === "uploaded") return false;
      const provider = data.provider || "fal";

      if (provider === "fal") {
        return data.mediaType === "video" ? 20000 : 1000;
      }
      return 5000;
    },
  });
  const mediaUrl = resolveMediaUrl(data) ?? "";
  const mediaId = data.id.split("-")[0];
  const handleOnDragStart: DragEventHandler<HTMLDivElement> = (event) => {
    const { blob, ...safeData } = data;
    const jobData = JSON.stringify(safeData);
    event.dataTransfer.setData("job", jobData);
    event.dataTransfer.setData("application/json", jobData);
    event.dataTransfer.setData("text/plain", jobData);
    event.dataTransfer.effectAllowed = "copyMove";
    return true;
  };

  const coverImage =
    data.mediaType === "video"
      ? data.thumbnailBlob
        ? getOrCreateBlobUrl(`${data.id}-thumbnail`, data.thumbnailBlob)
        : data.metadata?.start_frame_url || data?.metadata?.end_frame_url
      : resolveMediaUrl(data);

  // Get model name for generated items
  const getModelName = () => {
    if (data.kind !== "generated" || !data.endpointId) {
      return null;
    }

    // Try to find in FAL endpoints first
    const falEndpoint = getEnhancedApiInfo(data.endpointId);
    if (falEndpoint?.label) {
      return falEndpoint.label;
    }

    // Try to find in Runware endpoints
    const runwareEndpoint = RUNWARE_ENDPOINTS.find(
      (e) => e.endpointId === data.endpointId,
    );
    if (runwareEndpoint?.label) {
      return runwareEndpoint.label;
    }

    return null;
  };

  const modelName = getModelName();

  return (
    <div
      className={cn(
        "flex items-start space-x-2 py-2 w-full px-4 hover:bg-accent transition-all",
        className,
      )}
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        onOpen(data);
      }}
      draggable={draggable && data.status === "completed"}
      onDragStart={handleOnDragStart}
    >
      {!!draggable && (
        <div
          className={cn(
            "flex items-center h-full cursor-grab text-muted-foreground",
            {
              "text-muted": data.status !== "completed",
            },
          )}
        >
          <GripVerticalIcon className="w-4 h-4" />
        </div>
      )}
      <div className="w-16 h-16 aspect-square relative rounded overflow-hidden border border-transparent hover:border-accent bg-accent transition-all">
        {data.status === "completed" ? (
          <>
            {(data.mediaType === "image" || data.mediaType === "video") &&
              (coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverImage}
                  alt="Generated media"
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center top-0 left-0 absolute p-2 z-50">
                  {data.mediaType === "image" ? (
                    <ImageIcon className="w-7 h-7 text-muted-foreground" />
                  ) : (
                    <VideoIcon className="w-7 h-7 text-muted-foreground" />
                  )}
                </div>
              ))}
            {data.mediaType === "music" && (
              <div className="w-full h-full flex items-center justify-center top-0 left-0 absolute p-2 z-50">
                <MusicIcon className="w-7 h-7 text-muted-foreground" />
              </div>
            )}
            {data.mediaType === "voiceover" && (
              <div className="w-full h-full flex items-center justify-center top-0 left-0 absolute p-2 z-50">
                <MicIcon className="w-7 h-7 text-muted-foreground" />
              </div>
            )}
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
        <div className="flex flex-col items-start justify-center">
          <div className="flex w-full justify-between">
            <h3 className="text-sm font-medium flex flex-row gap-1 items-center">
              {createElement(trackIcons[data.mediaType], {
                className: "w-4 h-4 stroke-1",
              } as React.ComponentProps<
                (typeof trackIcons)[keyof typeof trackIcons]
              >)}
              {data.kind === "generated" ? (
                <span>{modelName || `Job #${mediaId}`}</span>
              ) : (
                <>
                  <span>File</span>
                  <code className="text-muted-foreground">#{mediaId}</code>
                </>
              )}
              {data.kind === "uploaded" ? (
                <Badge variant="outline" className="text-xs ml-1">
                  Uploaded
                </Badge>
              ) : data.endpointId?.startsWith("fal-ai/") ? (
                <Badge variant="outline" className="text-xs ml-1">
                  FAL
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs ml-1">
                  Runware
                </Badge>
              )}
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
          <p className="opacity-40 text-sm line-clamp-1 ">
            {data.input?.prompt}
          </p>
        </div>
        <div className="flex flex-row gap-2 justify-between text-xs text-muted-foreground">
          <div className="flex flex-col gap-0.5">
            <span>
              {formatDistanceToNow(data.createdAt, { addSuffix: true })}
            </span>
            {data.metadata?.duration && (
              <span>Duration: {data.metadata.duration.toFixed(1)}s</span>
            )}
          </div>
          {data.metadata?.cost !== undefined && (
            <span
              className={cn(
                "font-mono",
                data.provider === "runware"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-white/80",
              )}
            >
              $
              {typeof data.metadata.cost === "number"
                ? data.metadata.cost.toFixed(4)
                : data.metadata.cost}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

type MediaItemsPanelProps = {
  data: MediaItem[];
  mediaType: string;
} & HTMLAttributes<HTMLDivElement>;

export function MediaItemPanel({
  className,
  data,
  mediaType,
}: MediaItemsPanelProps) {
  const setSelectedMediaId = useVideoProjectStore((s) => s.setSelectedMediaId);
  const handleOnOpen = (item: MediaItem) => {
    setSelectedMediaId(item.id);
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden divide-y divide-border",
        className,
      )}
    >
      {data
        .filter((media) => {
          if (mediaType === "all") return true;
          return media.mediaType === mediaType;
        })
        .map((media) => (
          <Fragment key={media.id}>
            <MediaItemRow data={media} onOpen={handleOnOpen} />
          </Fragment>
        ))}
    </div>
  );
}

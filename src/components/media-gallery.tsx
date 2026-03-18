"use client";

import { db } from "@/data/db";
import {
  queryKeys,
  refreshVideoCache,
  useProjectMediaItems,
} from "@/data/queries";
import type { MediaItem } from "@/data/schema";
import { useProjectId, useVideoProjectStore } from "@/data/store";
import { AVAILABLE_ENDPOINTS } from "@/lib/fal";
import { RUNWARE_ENDPOINTS } from "@/lib/runware-models";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDuration } from "date-fns";
import {
  CopyIcon,
  FilmIcon,
  ImageUpscale,
  ImagesIcon,
  MicIcon,
  MusicIcon,
  TrashIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  type ComponentProps,
  type HTMLAttributes,
  type MouseEventHandler,
  type PropsWithChildren,
  useMemo,
} from "react";
import { Button } from "./ui/button";
import { LoadingIcon } from "./ui/icons";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetPanel,
  SheetPortal,
  SheetTitle,
} from "./ui/sheet";

const ALL_ENDPOINTS = [...AVAILABLE_ENDPOINTS, ...RUNWARE_ENDPOINTS];

type MediaGallerySheetProps = ComponentProps<typeof Sheet> & {
  selectedMediaId: string;
};

type AudioPlayerProps = {
  media: MediaItem;
} & HTMLAttributes<HTMLAudioElement>;

function AudioPlayer({ media, ...props }: AudioPlayerProps) {
  const src = resolveMediaUrl(media);
  if (!src) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square bg-accent text-muted-foreground flex flex-col items-center justify-center">
        {media.mediaType === "music" && <MusicIcon className="w-1/2 h-1/2" />}
        {media.mediaType === "voiceover" && <MicIcon className="w-1/2 h-1/2" />}
      </div>
      <div>
        <audio src={src} {...props} controls className="rounded" />
      </div>
    </div>
  );
}

type MediaPropertyItemProps = {
  className?: string;
  label: string;
  value: string;
};

function MediaPropertyItem({
  children,
  className,
  label,
  value,
}: PropsWithChildren<MediaPropertyItemProps>) {
  return (
    <div
      className={cn(
        "group relative flex flex-col gap-1 rounded bg-black/50 p-3 text-sm flex-wrap text-wrap overflow-hidden",
        className,
      )}
    >
      <div className="absolute right-2 top-2 opacity-30 transition-opacity group-hover:opacity-70">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            navigator.clipboard.writeText(value);
          }}
        >
          <CopyIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="font-medium text-muted-foreground">{label}</div>
      <div className="font-semibold text-foreground text-ellipsis">
        {children ?? value}
      </div>
    </div>
  );
}

const MEDIA_PLACEHOLDER: MediaItem = {
  id: "placeholder",
  kind: "generated",
  input: { prompt: "n/a" },
  mediaType: "image",
  status: "pending",
  createdAt: 0,
  endpointId: "n/a",
  projectId: "",
  requestId: "",
};

export function MediaGallerySheet({
  selectedMediaId,
  ...props
}: MediaGallerySheetProps) {
  const t = useTranslations("app.mediaGallery");
  const projectId = useProjectId();
  const { data: mediaItems = [] } = useProjectMediaItems(projectId);
  const selectedMedia =
    mediaItems.find((media) => media.id === selectedMediaId) ??
    MEDIA_PLACEHOLDER;
  const setSelectedMediaId = useVideoProjectStore((s) => s.setSelectedMediaId);
  const openGenerateDialog = useVideoProjectStore((s) => s.openGenerateDialog);
  const setGenerateData = useVideoProjectStore((s) => s.setGenerateData);
  const setEndpointId = useVideoProjectStore((s) => s.setEndpointId);
  const setGenerateMediaType = useVideoProjectStore(
    (s) => s.setGenerateMediaType,
  );
  const onGenerate = useVideoProjectStore((s) => s.onGenerate);

  const handleUpscaleDialog = () => {
    setGenerateMediaType("video");
    const video = selectedMedia.output?.video?.url;

    // video upscale model
    setEndpointId("fal-ai/topaz/upscale/video");

    setGenerateData({
      ...(selectedMedia.input || {}),
      video_url: video,
    });
    setSelectedMediaId(null);
    openGenerateDialog();
  };

  const handleOpenGenerateDialog = () => {
    setGenerateMediaType("video");
    const image = selectedMedia.output?.images?.[0]?.url;

    const endpoint = ALL_ENDPOINTS.find(
      (endpoint) => endpoint.category === "video",
    );

    setEndpointId(endpoint?.endpointId ?? ALL_ENDPOINTS[0].endpointId);

    setGenerateData({
      ...(selectedMedia.input || {}),
      image,
      duration: undefined,
    });
    setSelectedMediaId(null);
    openGenerateDialog();
  };

  const handleVary = () => {
    setGenerateMediaType(selectedMedia.mediaType);
    setEndpointId(selectedMedia.endpointId as string);
    setGenerateData(selectedMedia.input || {});
    setSelectedMediaId(null);
    onGenerate();
  };

  // Event handlers
  const preventClose: MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const preventPointerClose = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const close = () => {
    setSelectedMediaId(null);
  };
  const mediaUrl = useMemo(
    () => resolveMediaUrl(selectedMedia),
    [selectedMedia],
  );
  const prompt = selectedMedia?.input?.prompt;

  const queryClient = useQueryClient();
  const deleteMedia = useMutation({
    mutationFn: () => db.media.delete(selectedMediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projectMediaItems(projectId),
      });
      refreshVideoCache(queryClient, projectId);
      close();
    },
  });
  return (
    <Sheet {...props}>
      <SheetOverlay className="pointer-events-none flex flex-col" />
      <SheetPortal>
        <button
          type="button"
          className="pointer-events-auto fixed inset-0 z-[51] mr-[42rem] flex flex-col items-center justify-center gap-4 px-32 py-16 border-0 bg-transparent p-0"
          onClick={close}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              close();
            }
          }}
        >
          {!!mediaUrl && (
            <>
              {selectedMedia.mediaType === "image" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl}
                  alt={"Media preview"}
                  className="animate-fade-scale-in h-auto max-h-[90%] w-auto max-w-[90%] object-contain transition-all"
                  onClick={preventClose}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      preventClose(e as any);
                    }
                  }}
                />
              )}
              {selectedMedia.mediaType === "video" && (
                <video
                  src={mediaUrl}
                  className="animate-fade-scale-in h-auto max-h-[90%] w-auto max-w-[90%] object-contain transition-all"
                  controls
                  onClick={preventClose}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      preventClose(e as any);
                    }
                  }}
                >
                  <track kind="captions" />
                </video>
              )}
              {(selectedMedia.mediaType === "music" ||
                selectedMedia.mediaType === "voiceover") && (
                <AudioPlayer media={selectedMedia} />
              )}
            </>
          )}
          <style jsx>{`
            @keyframes fadeScaleIn {
              from {
                opacity: 0;
                transform: scale(0.8);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            .animate-fade-scale-in {
              animation: fadeScaleIn 0.3s ease-out forwards;
            }
          `}</style>
        </button>
        <SheetPanel
          className="flex h-screen max-h-screen min-h-screen flex-col overflow-hidden sm:max-w-2xl"
          onPointerDownOutside={preventPointerClose}
        >
          <SheetHeader>
            <SheetTitle>{t("title")}</SheetTitle>
            <SheetDescription className="sr-only">
              {t("description")}
            </SheetDescription>
          </SheetHeader>
          <div className="flex h-full max-h-full flex-1 flex-col gap-8 overflow-y-hidden">
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground">
                {prompt ?? <span className="italic">{t("noDescription")}</span>}
              </p>
              <div />
            </div>
            <div className="flex flex-row gap-2">
              {selectedMedia?.mediaType === "video" && (
                <Button
                  onClick={handleUpscaleDialog}
                  variant="secondary"
                  disabled={deleteMedia.isPending}
                >
                  <ImageUpscale className="w-4 h-4 opacity-50" />
                  {t("upscaleVideo")}
                </Button>
              )}
              {selectedMedia?.mediaType === "image" && (
                <Button
                  onClick={handleOpenGenerateDialog}
                  variant="secondary"
                  disabled={deleteMedia.isPending}
                >
                  <FilmIcon className="w-4 h-4 opacity-50" />
                  {t("makeVideo")}
                </Button>
              )}
              <Button
                onClick={handleVary}
                variant="secondary"
                disabled={deleteMedia.isPending}
              >
                <ImagesIcon className="w-4 h-4 opacity-50" />
                {t("rerun")}
              </Button>
              <Button
                variant="secondary"
                disabled={deleteMedia.isPending}
                onClick={() => deleteMedia.mutate()}
              >
                {deleteMedia.isPending ? (
                  <LoadingIcon />
                ) : (
                  <TrashIcon className="w-4 h-4 opacity-50" />
                )}
                {t("delete")}
              </Button>
            </div>
            <div className="flex-1 flex flex-col gap-2 justify-end overflow-y-auto">
              <MediaPropertyItem
                label={t("mediaUrl")}
                value={mediaUrl ?? "n/a"}
              />
              <MediaPropertyItem
                label={t("model")}
                value={selectedMedia.endpointId ?? "n/a"}
              >
                <a
                  href={`https://fal.ai/models/${selectedMedia.endpointId}`}
                  target="_blank"
                  className="underline underline-offset-4 decoration-muted-foreground/70 decoration-dotted"
                  rel="noreferrer"
                >
                  <code>{selectedMedia.endpointId}</code>
                </a>
              </MediaPropertyItem>
              <MediaPropertyItem
                label={t("status")}
                value={selectedMedia.status ?? "n/a"}
              />
              <MediaPropertyItem
                label={t("requestId")}
                value={selectedMedia.requestId ?? "n/a"}
              >
                <code>{selectedMedia.requestId}</code>
              </MediaPropertyItem>

              <Separator className="my-2" />

              {/* Generation Parameters Section */}
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                Generation Parameters
              </div>
              {selectedMedia.input &&
                Object.entries(selectedMedia.input).map(([key, value]) => {
                  // Skip rendering complex objects and null/undefined values
                  if (
                    value === null ||
                    value === undefined ||
                    (typeof value === "object" && !Array.isArray(value))
                  ) {
                    return null;
                  }

                  const displayValue =
                    typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value);

                  return (
                    <MediaPropertyItem
                      key={key}
                      label={key}
                      value={displayValue}
                    />
                  );
                })}

              {selectedMedia.metadata &&
                Object.keys(selectedMedia.metadata).length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <div className="text-xs font-semibold text-muted-foreground mb-2">
                      Generation Metadata
                    </div>
                    {Object.entries(selectedMedia.metadata).map(
                      ([key, value]) => {
                        // Skip rendering complex objects and null/undefined values
                        if (
                          value === null ||
                          value === undefined ||
                          (typeof value === "object" && !Array.isArray(value))
                        ) {
                          return null;
                        }

                        const displayValue =
                          typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value);

                        return (
                          <MediaPropertyItem
                            key={key}
                            label={key}
                            value={displayValue}
                          />
                        );
                      },
                    )}
                  </>
                )}
            </div>
          </div>
        </SheetPanel>
      </SheetPortal>
    </Sheet>
  );
}

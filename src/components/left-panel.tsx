"use client";

import { db } from "@/data/db";
import { useProjectUpdater } from "@/data/mutations";
import {
  queryKeys,
  useProject,
  useProjectMediaItems,
  useVideoComposition,
} from "@/data/queries";
import { type MediaItem, PROJECT_PLACEHOLDER } from "@/data/schema";
import {
  type MediaType,
  useProjectId,
  useVideoProjectStore,
} from "@/data/store";
import { toast } from "@/hooks/use-toast";
import { extractVideoThumbnail, getMediaMetadata } from "@/lib/ffmpeg";
import { resolveMediaUrl } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  CloudUploadIcon,
  FilmIcon,
  FolderOpenIcon,
  GalleryVerticalIcon,
  ImageIcon,
  ImagePlusIcon,
  ListPlusIcon,
  LoaderCircleIcon,
  MicIcon,
  MusicIcon,
  SparklesIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const DEFAULT_TIMELINE_DURATION_MS = PROJECT_PLACEHOLDER.duration ?? 30000;
const MIN_TIMELINE_DURATION_MS = 1000;
import { MediaItemPanel } from "./media-panel";
import { ProjectStatsDialog } from "./project-stats-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export default function LeftPanel() {
  const t = useTranslations("app.leftPanel");
  const tToast = useTranslations("app.toast");
  const projectId = useProjectId();
  const { data: project = PROJECT_PLACEHOLDER } = useProject(projectId);
  const { data: composition } = useVideoComposition(projectId);
  const projectUpdate = useProjectUpdater(projectId);
  const [mediaType, setMediaType] = useState("all");
  const queryClient = useQueryClient();

  const { data: mediaItems = [], isLoading } = useProjectMediaItems(projectId);
  const setProjectDialogOpen = useVideoProjectStore(
    (s) => s.setProjectDialogOpen,
  );
  const openGenerateDialog = useVideoProjectStore((s) => s.openGenerateDialog);
  const [timelineDurationInput, setTimelineDurationInput] = useState(
    () =>
      `${((project.duration ?? DEFAULT_TIMELINE_DURATION_MS) / 1000).toFixed(2)}`,
  );

  const frames = composition?.frames ?? {};
  const hasFrames = Object.values(frames).some((trackFrames) =>
    Array.isArray(trackFrames) ? trackFrames.length > 0 : false,
  );

  const [isUploading, setIsUploading] = useState(false);
  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  const commitTimelineDuration = (value: string) => {
    const parsedSeconds = Number.parseFloat(value);
    if (!Number.isFinite(parsedSeconds) || parsedSeconds <= 0) {
      const fallbackMs = project.duration ?? DEFAULT_TIMELINE_DURATION_MS;
      setTimelineDurationInput(`${(fallbackMs / 1000).toFixed(2)}`);
      return;
    }

    const roundedSeconds = Number(parsedSeconds.toFixed(2));
    const nextDurationMs = Math.max(
      roundedSeconds * 1000,
      MIN_TIMELINE_DURATION_MS,
    );
    setTimelineDurationInput(`${(nextDurationMs / 1000).toFixed(2)}`);
    projectUpdate.mutate({ duration: nextDurationMs });
  };

  const handleFitTimelineToContent = () => {
    if (!hasFrames) {
      commitTimelineDuration(`${DEFAULT_TIMELINE_DURATION_MS / 1000}`);
      return;
    }

    const maxEndMs = Object.values(frames)
      .flat()
      .reduce((max, frame) => {
        const end = frame.timestamp + frame.duration;
        return end > max ? end : max;
      }, 0);

    const computedSeconds = maxEndMs / 1000;
    commitTimelineDuration(`${computedSeconds}`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const oversizedFiles = fileArray.filter(
      (file) => file.size > MAX_FILE_SIZE,
    );

    if (oversizedFiles.length > 0) {
      toast({
        title: tToast("uploadFailed"),
        description: `${tToast("uploadFailedDesc")}: Files must be under 50MB`,
      });
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    try {
      await handleUploadComplete(fileArray);
    } catch (err) {
      console.warn(`ERROR! ${err}`);
      toast({
        title: tToast("uploadFailed"),
        description: tToast("uploadFailedDesc"),
      });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleUploadComplete = async (files: File[]) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const mediaType = file.type.split("/")[0];
      const outputType = mediaType === "audio" ? "music" : mediaType;

      const data: Omit<MediaItem, "id"> = {
        projectId,
        kind: "uploaded",
        createdAt: Date.now(),
        mediaType: outputType as MediaType,
        status: "completed",
        url: file.name,
        blob: file,
      };

      const mediaId = await db.media.create(data);
      const media = await db.media.find(mediaId as string);

      if (media) {
        const mediaMetadata = await getMediaMetadata(media as MediaItem);

        let thumbnailBlob: Blob | undefined = undefined;
        if (media.mediaType === "video") {
          const videoUrl = resolveMediaUrl(media);
          if (videoUrl) {
            thumbnailBlob =
              (await extractVideoThumbnail(videoUrl)) ?? undefined;
          }
        }

        await db.media
          .update(media.id, {
            ...media,
            metadata: {
              ...(mediaMetadata?.media || {}),
            },
            thumbnailBlob,
          })
          .finally(() => {
            queryClient.invalidateQueries({
              queryKey: queryKeys.projectMediaItems(projectId),
            });
          });
      }
    }
  };

  return (
    <div className="flex flex-col border-r border-border w-96">
      <div className="p-4 flex items-center gap-4 border-b border-border">
        <div className="flex w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="py-4 h-10">
                <div className="flex flex-row items-center">
                  <h2 className="text-sm text-muted-foreground font-semibold flex-1">
                    {project?.title || t("projectSettings")}
                  </h2>
                </div>
              </AccordionTrigger>
              <AccordionContent className="border-b-0">
                <div className="flex flex-col gap-4">
                  <Input
                    id="projectName"
                    name="name"
                    placeholder={t("untitled")}
                    value={project.title}
                    onChange={(e) =>
                      projectUpdate.mutate({ title: e.target.value })
                    }
                    onBlur={(e) =>
                      projectUpdate.mutate({ title: e.target.value.trim() })
                    }
                  />

                  <Textarea
                    id="projectDescription"
                    name="description"
                    placeholder={t("describeVideo")}
                    className="resize-none"
                    value={project.description}
                    rows={6}
                    onChange={(e) =>
                      projectUpdate.mutate({ description: e.target.value })
                    }
                    onBlur={(e) =>
                      projectUpdate.mutate({
                        description: e.target.value.trim(),
                      })
                    }
                  />
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="timelineDuration"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      {t("timelineDuration")}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="timelineDuration"
                        type="number"
                        inputMode="decimal"
                        min={MIN_TIMELINE_DURATION_MS / 1000}
                        step={0.5}
                        value={timelineDurationInput}
                        onChange={(event) =>
                          setTimelineDurationInput(event.target.value)
                        }
                        onBlur={(event) =>
                          commitTimelineDuration(event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.currentTarget.blur();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleFitTimelineToContent}
                        disabled={!hasFrames}
                      >
                        {t("fitToContent")}
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="self-start">
          <Button
            className="mt-2"
            variant="secondary"
            size="sm"
            onClick={() => setProjectDialogOpen(true)}
          >
            <FolderOpenIcon className="w-4 h-4 opacity-50" />
          </Button>
        </div>
      </div>
      <div className="flex-1 py-4 flex flex-col gap-4 border-b border-border h-full overflow-hidden relative">
        <div className="flex flex-row items-center gap-2 px-4">
          <h2 className="text-sm text-muted-foreground font-semibold flex-1">
            {t("gallery")}
          </h2>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="px-2">
                  <ListPlusIcon className="w-4 h-4 opacity-50" />
                  <span className="capitalize">{mediaType}</span>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="start">
                <DropdownMenuItem
                  className="text-sm"
                  onClick={() => setMediaType("all")}
                >
                  <GalleryVerticalIcon className="w-4 h-4 opacity-50" />
                  {t("all")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-sm"
                  onClick={() => setMediaType("image")}
                >
                  <ImageIcon className="w-4 h-4 opacity-50" />
                  {t("image")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-sm"
                  onClick={() => setMediaType("music")}
                >
                  <MusicIcon className="w-4 h-4 opacity-50" />
                  {t("music")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-sm"
                  onClick={() => setMediaType("voiceover")}
                >
                  <MicIcon className="w-4 h-4 opacity-50" />
                  {t("voiceover")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-sm"
                  onClick={() => setMediaType("video")}
                >
                  <FilmIcon className="w-4 h-4 opacity-50" />
                  {t("video")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="secondary"
              size="sm"
              disabled={isUploading}
              className="cursor-pointer disabled:cursor-default disabled:opacity-50"
              asChild
            >
              <label htmlFor="fileUploadButton">
                <Input
                  id="fileUploadButton"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  multiple={false}
                  disabled={isUploading}
                  accept="image/*,audio/*,video/*"
                />
                {isUploading ? (
                  <LoaderCircleIcon className="w-4 h-4 opacity-50 animate-spin" />
                ) : (
                  <CloudUploadIcon className="w-4 h-4 opacity-50" />
                )}
              </label>
            </Button>
            <ProjectStatsDialog />
          </div>
          {mediaItems.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => openGenerateDialog()}
            >
              <SparklesIcon className="w-4 h-4 opacity-50" />
              {t("generate")}
            </Button>
          )}
        </div>
        {!isLoading && mediaItems.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-4 px-4">
            <p className="text-sm text-center">{t("emptyMessage")}</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => openGenerateDialog()}
            >
              <ImagePlusIcon className="w-4 h-4 opacity-50" />
              {t("generate")}
            </Button>
          </div>
        )}

        {mediaItems.length > 0 && (
          <MediaItemPanel
            data={mediaItems}
            mediaType={mediaType}
            className="overflow-y-auto"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent via-background via-60% h-8 pointer-events-none" />
      </div>
    </div>
  );
}

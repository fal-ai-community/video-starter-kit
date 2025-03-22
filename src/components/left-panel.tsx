"use client";

import { useProjectUpdater } from "@/data/mutations";
import { queryKeys, useProject, useProjectMediaItems } from "@/data/queries";
import { type MediaItem, PROJECT_PLACEHOLDER } from "@/data/schema";
import {
  type MediaType,
  useProjectId,
  useVideoProjectStore,
} from "@/data/store";
import {
  ChevronDown,
  FilmIcon,
  FolderOpenIcon,
  GalleryVerticalIcon,
  ImageIcon,
  ImagePlusIcon,
  ListPlusIcon,
  MicIcon,
  MusicIcon,
  LoaderCircleIcon,
  CloudUploadIcon,
  SparklesIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  MinusCircleIcon,
  ListFilterIcon,
} from "lucide-react";
import { MediaItemPanel } from "./media-panel";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import type { ClientUploadedFileData } from "uploadthing/types";
import { db } from "@/data/db";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { getMediaMetadata } from "@/lib/ffmpeg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export default function LeftPanel() {
  const projectId = useProjectId();
  const { data: project = PROJECT_PLACEHOLDER } = useProject(projectId);
  const projectUpdate = useProjectUpdater(projectId);
  const [mediaType, setMediaType] = useState("all");
  const [ratingFilter, setRatingFilter] = useState<
    "all" | "positive" | "negative" | "unrated" | "not_disliked"
  >("not_disliked");
  const queryClient = useQueryClient();

  const { data: mediaItems = [], isLoading } = useProjectMediaItems(projectId);
  const setProjectDialogOpen = useVideoProjectStore(
    (s) => s.setProjectDialogOpen,
  );
  const openGenerateDialog = useVideoProjectStore((s) => s.openGenerateDialog);

  const { startUpload, isUploading } = useUploadThing("fileUploader");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const uploadedFiles = await startUpload(Array.from(files));
      if (uploadedFiles) {
        await handleUploadComplete(uploadedFiles);
      }
    } catch (err) {
      console.warn(`ERROR! ${err}`);
      toast({
        title: "Failed to upload file",
        description: "Please try again",
      });
    }
  };

  const handleUploadComplete = async (
    files: ClientUploadedFileData<{
      uploadedBy: string;
    }>[],
  ) => {
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
        url: file.url,
      };

      const mediaId = await db.media.create(data);
      const media = await db.media.find(mediaId as string);

      if (media) {
        const mediaMetadata = await getMediaMetadata(media as MediaItem);

        await db.media
          .update(media.id, {
            ...media,
            metadata: mediaMetadata?.media || {},
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
                    {project?.title || "Project Settings"}
                  </h2>
                </div>
              </AccordionTrigger>
              <AccordionContent className="border-b-0">
                <div className="flex flex-col gap-4">
                  <Input
                    id="projectName"
                    name="name"
                    placeholder="untitled"
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
                    placeholder="Describe your video"
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
        <div className="flex flex-col gap-2 px-4">
          <div className="flex flex-row items-center gap-2">
            <h2 className="text-sm text-muted-foreground font-semibold flex-1 mr-2">
              Gallery
            </h2>
            <div className="flex gap-1.5 pr-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-1">
                    <ListFilterIcon className="w-4 h-4 opacity-50" />
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="start">
                  <DropdownMenuItem
                    className="text-sm"
                    onClick={() => setRatingFilter("not_disliked")}
                  >
                    <ListFilterIcon className="w-4 h-4 opacity-50 mr-2" />
                    Not Disliked
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-sm"
                    onClick={() => setRatingFilter("all")}
                  >
                    <GalleryVerticalIcon className="w-4 h-4 opacity-50 mr-2" />
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-sm"
                    onClick={() => setRatingFilter("positive")}
                  >
                    <ThumbsUpIcon className="w-4 h-4 opacity-50 mr-2" />
                    Liked
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-sm"
                    onClick={() => setRatingFilter("negative")}
                  >
                    <ThumbsDownIcon className="w-4 h-4 opacity-50 mr-2" />
                    Disliked
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-sm"
                    onClick={() => setRatingFilter("unrated")}
                  >
                    <MinusCircleIcon className="w-4 h-4 opacity-50 mr-2" />
                    Unrated
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-1">
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
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-sm"
                    onClick={() => setMediaType("image")}
                  >
                    <ImageIcon className="w-4 h-4 opacity-50" />
                    Image
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-sm"
                    onClick={() => setMediaType("music")}
                  >
                    <MusicIcon className="w-4 h-4 opacity-50" />
                    Music
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-sm"
                    onClick={() => setMediaType("voiceover")}
                  >
                    <MicIcon className="w-4 h-4 opacity-50" />
                    Voiceover
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-sm"
                    onClick={() => setMediaType("video")}
                  >
                    <FilmIcon className="w-4 h-4 opacity-50" />
                    Video
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
              {mediaItems.length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openGenerateDialog()}
                >
                  <SparklesIcon className="w-4 h-4 opacity-50" />
                  Generate...
                </Button>
              )}
            </div>
          </div>
        </div>
        {!isLoading && mediaItems.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-4 px-4">
            <p className="text-sm text-center">
              Create your image, audio and voiceover collection to compose your
              videos
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => openGenerateDialog()}
            >
              <ImagePlusIcon className="w-4 h-4 opacity-50" />
              Generate...
            </Button>
          </div>
        )}

        {mediaItems.length > 0 && (
          <MediaItemPanel
            data={mediaItems.filter((media) => {
              // First filter by media type
              if (mediaType !== "all" && media.mediaType !== mediaType)
                return false;

              // Then filter by rating
              if (ratingFilter === "positive")
                return media.rating === "positive";
              if (ratingFilter === "negative")
                return media.rating === "negative";
              if (ratingFilter === "unrated") return media.rating === undefined;
              if (ratingFilter === "not_disliked")
                return media.rating !== "negative";
              return true;
            })}
            mediaType={mediaType}
            className="overflow-y-auto"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent via-background via-60% h-8 pointer-events-none" />
      </div>
    </div>
  );
}

"use client";

import { useProjectUpdater } from "@/data/mutations";
import { queryKeys, useProject, useProjectJobs } from "@/data/queries";
import { GenerationJob, PROJECT_PLACEHOLDER } from "@/data/schema";
import { useProjectId, useVideoProjectStore } from "@/data/store";
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
  Upload,
} from "lucide-react";
import { JobsPanel } from "./jobs-panel";
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
import { UploadButton } from "@/utils/uploadthing";
import { cn, resolveDurationFromMedia } from "@/lib/utils";
import { ClientUploadedFileData } from "uploadthing/types";
import { db } from "@/data/db";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export default function RightPanel() {
  const projectId = useProjectId();
  // const [projectTitle, setProjectTitle] = useState("");
  const { data: project = PROJECT_PLACEHOLDER } = useProject(projectId);
  const projectUpdate = useProjectUpdater(projectId);
  const [mediaType, setMediaType] = useState("all");
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useProjectJobs(projectId);
  const setProjectDialogOpen = useVideoProjectStore(
    (s) => s.setProjectDialogOpen
  );
  const openGenerateDialog = useVideoProjectStore((s) => s.openGenerateDialog);

  const handleOpenGenerateDialog = () => {
    openGenerateDialog();
  };

  const handleUploadComplete = async (
    files: ClientUploadedFileData<{
      uploadedBy: string;
    }>[]
  ) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const mediaType = file.type.split("/")[0];

      let data: Omit<GenerationJob, "id"> = {
        projectId,
        createdAt: Date.now(),
        endedAt: Date.now(),
        endpointId: "",
        requestId: "",
        mediaType: mediaType as any,
        status: "completed",
        input: {},
      };

      if (mediaType === "image") {
        const img = new Image();
        img.src = file.url;
        img.onload = async () => {
          const width = img.width;
          const height = img.height;

          data.output = {
            images: [
              {
                url: file.url,
                content_type: file.type,
                width,
                height,
              },
            ],
          };

          await db.jobs.create(data).finally(() => {
            queryClient.invalidateQueries({
              queryKey: queryKeys.projectJobs(projectId),
            });
          });
        };
      } else {
        data.mediaType = mediaType === "audio" ? "music" : (mediaType as any);
        data.output = {
          [mediaType]: {
            url: file.url,
            content_type: file.type,
            file_size: file.size,
            file_name: file.name,
          },
        };

        await db.jobs.create(data).finally(() => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.projectJobs(projectId),
          });
        });
      }
    }
  };

  return (
    <div className="flex flex-col border-l border-border w-96">
      <div className="p-4 flex flex-col gap-4 border-b border-border">
        <div className="flex flex-row items-start">
          <h2 className="text-sm text-muted-foreground font-semibold flex-1">
            Project Settings
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setProjectDialogOpen(true)}
          >
            <FolderOpenIcon className="w-4 h-4 opacity-50" />
            Open...
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <Input
            id="projectName"
            name="name"
            placeholder="untitled"
            value={project.title}
            onChange={(e) => projectUpdate.mutate({ title: e.target.value })}
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
              projectUpdate.mutate({ description: e.target.value.trim() })
            }
          />
        </div>
      </div>
      <div className="flex-1 py-4 flex flex-col gap-4 border-b border-border h-full overflow-hidden relative">
        <div className="flex flex-row items-center gap-2 px-4">
          <h2 className="text-sm text-muted-foreground font-semibold flex-1">
            Media Gallery
          </h2>

          {jobs.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleOpenGenerateDialog}
            >
              <ImagePlusIcon className="w-4 h-4 opacity-50" />
              Generate...
            </Button>
          )}
        </div>
        {!isLoading && jobs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-4 px-4">
            <p className="text-sm text-center">
              Create your image, audio and voiceover collection to compose your
              videos
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleOpenGenerateDialog}
            >
              <ImagePlusIcon className="w-4 h-4 opacity-50" />
              Generate...
            </Button>
          </div>
        )}
        <div className="flex justify-between pt-4 w-full px-4 border-t border-border">
          <UploadButton
            appearance={{
              button: cn([
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium",
                "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/20",
                "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
                "aria-disabled:opacity-50 aria-disabled:pointer-events-none",
                "h-9 px-4 py-2",
                "border border-input !bg-background shadow-sm hover:!bg-accent hover:!text-accent-foreground data-[state=open]:bg-accent",
              ]),
              allowedContent: "hidden",
            }}
            endpoint="fileUploader"
            onClientUploadComplete={handleUploadComplete}
            onUploadError={(error: Error) => {
              console.warn(`ERROR! ${error.message}`);
              toast({
                title: "Failed to file upload",
                description: "Please try again",
              });
            }}
          />
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
        </div>
        {jobs.length > 0 && (
          <JobsPanel
            jobs={jobs}
            mediaType={mediaType}
            className="overflow-y-auto"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent via-background via-60% h-8 pointer-events-none" />
      </div>
    </div>
  );
}

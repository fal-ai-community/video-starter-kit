"use client";

import { useProjectCreator, useProjectDeleter } from "@/data/mutations";
import { queryKeys, useProjects } from "@/data/queries";
import {
  type AspectRatio,
  PROJECT_PLACEHOLDER,
  type VideoProject,
} from "@/data/schema";
import { seedDatabase } from "@/data/seed";
import { useVideoProjectStore } from "@/data/store";
import { useToast } from "@/hooks/use-toast";
import { createProjectSuggestion } from "@/lib/project";
import { cn, rememberLastProjectId } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileVideoIcon,
  FolderOpenIcon,
  Trash2,
  WandSparklesIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { LoadingIcon } from "./ui/icons";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { Textarea } from "./ui/textarea";
import { WithTooltip } from "./ui/tooltip";

type ProjectDialogProps = {} & Parameters<typeof Dialog>[0];

export function ProjectDialog({ onOpenChange, ...props }: ProjectDialogProps) {
  const t = useTranslations("app.projectDialog");
  const tToast = useTranslations("app.toast");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [aspect, setAspect] = useState<AspectRatio>("16:9");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const deleteProject = useProjectDeleter();

  // Fetch existing projects
  const { data: projects = [], isLoading } = useProjects();

  // Seed data with template project if empty
  useEffect(() => {
    if (projects.length === 0 && !isLoading) {
      seedDatabase().then(() => {
        queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      });
    }
  }, [projects, isLoading, queryClient]);

  // Create project mutation
  const setProjectId = useVideoProjectStore((s) => s.setProjectId);
  const createProject = useProjectCreator();

  const suggestProject = useMutation({
    mutationFn: async () => {
      return createProjectSuggestion();
    },
    onSuccess: (suggestion) => {
      setTitle(suggestion.title);
      setDescription(suggestion.description);
    },
    onError: (error) => {
      console.warn("Failed to create suggestion", error);
      toast({
        title: tToast("suggestionFailed"),
        description: tToast("suggestionFailedDesc"),
      });
    },
  });

  const setProjectDialogOpen = useVideoProjectStore(
    (s) => s.setProjectDialogOpen,
  );

  const handleSelectProject = (project: VideoProject) => {
    setProjectId(project.id);
    setProjectDialogOpen(false);
    rememberLastProjectId(project.id);
  };

  const handleOnOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
    }
    onOpenChange?.(isOpen);
    setProjectDialogOpen(isOpen);
  };

  return (
    <Dialog {...props} onOpenChange={handleOnOpenChange}>
      <DialogContent className="flex flex-col max-w-4xl h-fit max-h-[520px] min-h-[380px]">
        <DialogHeader>
          <div className="flex flex-row gap-2 mb-4">
            <span className="text-lg font-medium">
              <Logo />
            </span>
          </div>
          <DialogTitle className="sr-only">{t("title")}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("description")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row gap-8 h-full">
          {/* New Project Form */}
          <div className="flex flex-col flex-1 gap-8">
            <h2 className="text-lg font-semibold flex flex-row gap-2">
              <FileVideoIcon className="w-6 h-6 opacity-50 stroke-1" />
              {t("createNew")}
            </h2>
            <div className="flex flex-col gap-4">
              <Input
                placeholder={t("projectTitle")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder={t("describeProject")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <div>
                <h4 className="text-xs text-muted-foreground mb-1">
                  {t("aspectRatio")}
                </h4>
                <div className="flex flex-row gap-2">
                  <Button
                    variant={aspect === "16:9" ? "secondary" : "outline"}
                    onClick={() => {
                      setAspect("16:9");
                    }}
                  >
                    16:9
                  </Button>
                  <Button
                    variant={aspect === "9:16" ? "secondary" : "outline"}
                    onClick={() => {
                      setAspect("9:16");
                    }}
                  >
                    9:16
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-row items-end justify-start gap-2">
              <WithTooltip tooltip={t("generateTooltip")}>
                <Button
                  variant="secondary"
                  disabled={suggestProject.isPending}
                  onClick={() => suggestProject.mutate()}
                >
                  {suggestProject.isPending ? (
                    <LoadingIcon />
                  ) : (
                    <WandSparklesIcon className="opacity-50" />
                  )}
                  {t("generate")}
                </Button>
              </WithTooltip>
              <Button
                onClick={() =>
                  createProject.mutate(
                    {
                      title,
                      description,
                      aspectRatio: aspect,
                      duration: PROJECT_PLACEHOLDER.duration,
                    },
                    {
                      onSuccess: (projectId) => {
                        handleSelectProject({ id: projectId } as VideoProject);
                      },
                    },
                  )
                }
                disabled={!title.trim() || createProject.isPending}
              >
                {createProject.isPending ? t("creating") : t("createProject")}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-center">
            <Separator orientation="vertical" className="flex-1" />
            <span className="font-semibold">{t("or")}</span>
            <Separator orientation="vertical" className="flex-1" />
          </div>

          {/* Existing Projects */}
          <div className="flex flex-col flex-1 gap-8">
            <h2 className="text-lg font-semibold flex flex-row gap-2">
              <FolderOpenIcon className="w-6 h-6 opacity-50 stroke-1" />
              {t("openExisting")}
            </h2>
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
              {isLoading ? (
                // Loading skeletons
                <>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="w-full h-[72px] rounded-lg" />
                  ))}
                </>
              ) : projects?.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-8">
                  {t("noProjects")}
                </div>
              ) : (
                // Project list
                projects?.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      "w-full text-left p-3 rounded flex items-start justify-between gap-2",
                      "bg-card hover:bg-accent transition-colors",
                      "border border-border",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectProject(project)}
                      className="flex-1 text-left"
                    >
                      <h3 className="font-medium text-sm">{project.title}</h3>
                      {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(project.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirmId) {
                  deleteProject.mutate(deleteConfirmId, {
                    onSuccess: () => {
                      setDeleteConfirmId(null);
                    },
                  });
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

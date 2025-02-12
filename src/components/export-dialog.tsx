import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { cn, resolveMediaUrl } from "@/lib/utils";
import {
  EMPTY_VIDEO_COMPOSITION,
  useProject,
  useVideoComposition,
} from "@/data/queries";
import { fal } from "@/lib/fal";
import { Button } from "./ui/button";
import { useProjectId, useVideoProjectStore } from "@/data/store";
import { LoadingIcon } from "./ui/icons";
import {
  CopyIcon,
  DownloadIcon,
  Share2Icon as ShareIcon,
  FilmIcon,
} from "lucide-react";
import { Input } from "./ui/input";
import type { ShareVideoParams } from "@/lib/share";
import { PROJECT_PLACEHOLDER } from "@/data/schema";
import { useRouter } from "next/navigation";

type ExportDialogProps = {} & Parameters<typeof Dialog>[0];

type ShareResult = {
  video_url: string;
  thumbnail_url: string;
};

export function ExportDialog({ onOpenChange, ...props }: ExportDialogProps) {
  const projectId = useProjectId();
  const { data: composition = EMPTY_VIDEO_COMPOSITION } =
    useVideoComposition(projectId);
  const router = useRouter();
  const exportVideo = useMutation({
    mutationFn: async () => {
      const mediaItems = composition.mediaItems;
      const videoData = composition.tracks.map((track) => ({
        id: track.id,
        type: track.type === "video" ? "video" : "audio",
        keyframes: composition.frames[track.id].map((frame) => ({
          timestamp: frame.timestamp,
          duration: frame.duration,
          url: resolveMediaUrl(mediaItems[frame.data.mediaId]),
        })),
      }));
      if (videoData.length === 0) {
        throw new Error("No tracks to export");
      }
      const { data } = await fal.subscribe("fal-ai/ffmpeg-api/compose", {
        input: {
          tracks: videoData,
        },
        mode: "polling",
        pollInterval: 3000,
      });
      return data as ShareResult;
    },
  });
  const setExportDialogOpen = useVideoProjectStore(
    (s) => s.setExportDialogOpen,
  );
  const handleOnOpenChange = (open: boolean) => {
    setExportDialogOpen(open);
    onOpenChange?.(open);
  };

  const { data: project = PROJECT_PLACEHOLDER } = useProject(projectId);
  const share = useMutation({
    mutationFn: async () => {
      if (!exportVideo.data) {
        throw new Error("No video to share");
      }
      const videoInfo = exportVideo.data;
      const response = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: project.title,
          description: project.description ?? "",
          videoUrl: videoInfo.video_url,
          thumbnailUrl: videoInfo.thumbnail_url,
          createdAt: Date.now(),
          // TODO parametrize this
          width: 1920,
          height: 1080,
        } satisfies ShareVideoParams),
      });
      if (!response.ok) {
        throw new Error("Failed to share video");
      }
      return response.json();
    },
  });

  const handleOnShare = async () => {
    const { id } = await share.mutateAsync();
    router.push(`/share/${id}`);
  };

  const actionsDisabled = exportVideo.isPending || share.isPending;

  return (
    <Dialog onOpenChange={handleOnOpenChange} {...props}>
      <DialogContent className="sm:max-w-4xl max-w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FilmIcon className="w-6 h-6 opacity-50" />
            Export video
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="text-muted-foreground">
          <p>This may take a while, sit back and relax.</p>
        </div>
        <div
          className={cn(
            "w-full max-h-[500px] mx-auto max-w-full",
            project?.aspectRatio === "16:9" ? "aspect-[16/9]" : "aspect-[9/16]",
          )}
        >
          {exportVideo.isPending || exportVideo.data === undefined ? (
            <div
              className={cn(
                "bg-accent/30 flex flex-col items-center justify-center w-full h-full",
              )}
            >
              {exportVideo.isPending ? (
                <LoadingIcon className="w-24 h-24" />
              ) : (
                <FilmIcon className="w-24 h-24 opacity-50" />
              )}
            </div>
          ) : (
            <video
              src={exportVideo.data.video_url}
              controls
              className="w-full h-full"
            />
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-2 items-center">
            <Input
              value={exportVideo.data?.video_url ?? ""}
              placeholder="Video URL..."
              readOnly
              className="text-muted-foreground"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                navigator.clipboard.writeText(exportVideo.data?.video_url ?? "")
              }
              disabled={exportVideo.data === undefined}
            >
              <CopyIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleOnShare}
            variant="secondary"
            disabled={actionsDisabled || !exportVideo.data}
          >
            <ShareIcon className="w-4 h-4 opacity-50" />
            Share
          </Button>
          <Button
            variant="secondary"
            disabled={actionsDisabled || !exportVideo.data}
            aria-disabled={actionsDisabled || !exportVideo.data}
            asChild
          >
            <a href={exportVideo.data?.video_url ?? "#"} download>
              <DownloadIcon className="w-4 h-4" />
              Download
            </a>
          </Button>
          <Button
            onClick={() => exportVideo.mutate()}
            disabled={actionsDisabled}
          >
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useJobCreator, useProjectUpdater } from "@/data/mutations";
import { queryKeys, useProject, useProjectMediaItems } from "@/data/queries";
import { MediaItem, PROJECT_PLACEHOLDER } from "@/data/schema";
import {
  GenerateData,
  MediaType,
  useProjectId,
  useVideoProjectStore,
} from "@/data/store";
import { AVAILABLE_ENDPOINTS, fal, InputAsset } from "@/lib/fal";
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
  VideoIcon,
  ArrowLeft,
  TrashIcon,
  WandSparklesIcon,
} from "lucide-react";
import { MediaItemPanel, MediaItemRow } from "./media-panel";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useMemo, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";
import { db } from "@/data/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, useToast } from "@/hooks/use-toast";
import { cn, getAssetKey, getAssetType, resolveMediaUrl } from "@/lib/utils";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { enhancePrompt } from "@/lib/prompt";
import { WithTooltip } from "./ui/tooltip";
import { Label } from "./ui/label";
import { VoiceSelector } from "./playht/voice-selector";
import { LoadingIcon } from "./ui/icons";

type ModelEndpointPickerProps = {
  mediaType: string;
  onValueChange: (value: MediaType) => void;
} & Parameters<typeof Select>[0];

function ModelEndpointPicker({
  mediaType,
  ...props
}: ModelEndpointPickerProps) {
  const endpoints = useMemo(
    () =>
      AVAILABLE_ENDPOINTS.filter((endpoint) => endpoint.category === mediaType),
    [mediaType]
  );
  return (
    <Select {...props}>
      <SelectTrigger className="text-base w-full minw-56 font-semibold">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {endpoints.map((endpoint) => (
          <SelectItem key={endpoint.endpointId} value={endpoint.endpointId}>
            <div className="flex flex-row gap-2 items-center">
              <span>{endpoint.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const assetKeyMap: Record<"image" | "video" | "audio", keyof GenerateData> = {
  image: "image",
  video: "video_url",
  audio: "audio_url",
};

export default function RightPanel({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void;
}) {
  const {
    generateData,
    setGenerateData,
    resetGenerateData,
    endpointId,
    setEndpointId,
  } = useVideoProjectStore((s) => s);

  const [tab, setTab] = useState<"generation" | "asset">("generation");
  const [assetMediaType, setAssetMediaType] = useState("all");
  const projectId = useProjectId();
  const openGenerateDialog = useVideoProjectStore((s) => s.openGenerateDialog);
  const closeGenerateDialog = useVideoProjectStore(
    (s) => s.closeGenerateDialog
  );
  const handleOnOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      closeGenerateDialog();
      resetGenerateData();
      return;
    }
    onOpenChange?.(isOpen);
    openGenerateDialog();
  };

  const { data: project } = useProject(projectId);

  const { toast } = useToast();
  const enhance = useMutation({
    mutationFn: async () => {
      return enhancePrompt(generateData.prompt, {
        type: mediaType,
        project,
      });
    },
    onSuccess: (enhancedPrompt) => {
      setGenerateData({ prompt: enhancedPrompt });
    },
    onError: (error) => {
      console.warn("Failed to create suggestion", error);
      toast({
        title: "Failed to enhance prompt",
        description: "There was an unexpected error. Try again.",
      });
    },
  });

  const { data: mediaItems = [] } = useProjectMediaItems(projectId);
  const mediaType = useVideoProjectStore((s) => s.generateMediaType);
  const setMediaType = useVideoProjectStore((s) => s.setGenerateMediaType);

  const endpoint = useMemo(
    () =>
      AVAILABLE_ENDPOINTS.find(
        (endpoint) => endpoint.endpointId === endpointId
      ),
    [endpointId]
  );
  const handleMediaTypeChange = (mediaType: string) => {
    setMediaType(mediaType as MediaType);
    const endpoint = AVAILABLE_ENDPOINTS.find(
      (endpoint) => endpoint.category === mediaType
    );

    if (
      (mediaType === "video" &&
        endpoint?.endpointId === "fal-ai/hunyuan-video") ||
      mediaType !== "video"
    ) {
      setGenerateData({ image: null });
    }

    setEndpointId(endpoint?.endpointId ?? AVAILABLE_ENDPOINTS[0].endpointId);
  };
  // TODO improve model-specific parameters
  type InputType = {
    prompt: string;
    image_url?: File | string | null;
    video_url?: File | string | null;
    audio_url?: File | string | null;
    image_size?: { width: number; height: number } | string;
    aspect_ratio?: string;
    seconds_total?: number;
    voice?: string;
    input?: string;
    reference_audio_url?: File | string | null;
  };

  const input: InputType = {
    prompt: generateData.prompt,
    image_url: undefined,
    image_size: mediaType === "image" ? "landscape_16_9" : undefined,
    aspect_ratio: mediaType === "video" ? "16:9" : undefined,
    seconds_total: generateData.duration ?? undefined,
    voice:
      endpointId === "fal-ai/playht/tts/v3" ? generateData.voice : undefined,
    input:
      endpointId === "fal-ai/playht/tts/v3" ? generateData.prompt : undefined,
  };

  if (generateData.image) {
    input["image_url"] = generateData.image;
  }
  if (generateData.video_url) {
    input["video_url"] = generateData.video_url;
  }
  if (generateData.audio_url) {
    input["audio_url"] = generateData.audio_url;
  }
  if (generateData.reference_audio_url) {
    input["reference_audio_url"] = generateData.reference_audio_url;
  }

  const extraInput =
    endpointId === "fal-ai/f5-tts"
      ? {
          gen_text: generateData.prompt,
          ref_audio_url:
            "https://github.com/SWivid/F5-TTS/raw/21900ba97d5020a5a70bcc9a0575dc7dec5021cb/tests/ref_audio/test_en_1_ref_short.wav",
          ref_text: "Some call me nature, others call me mother nature.",
          model_type: "F5-TTS",
          remove_silence: true,
        }
      : {};
  const createJob = useJobCreator({
    projectId,
    endpointId:
      generateData.image && mediaType === "video"
        ? `${endpointId}/image-to-video`
        : endpointId,
    mediaType,
    input: {
      ...input,
      ...extraInput,
    },
  });
  const handleOnGenerate = async () => {
    await createJob.mutateAsync({} as any, {
      onSuccess: async () => {
        if (!createJob.isError) {
          handleOnOpenChange(false);
        }
      },
    });
  };

  const handleSelectMedia = (media: MediaItem) => {
    const asset = endpoint?.inputAsset?.find((item) => {
      const assetType = getAssetType(item);

      if (
        assetType === "audio" &&
        (media.mediaType === "voiceover" || media.mediaType === "music")
      ) {
        return true;
      } else {
        return assetType === media.mediaType;
      }
    });

    if (!asset) {
      setTab("generation");
      return;
    }

    const key = getAssetKey(asset) || getAssetType(asset);
    setGenerateData({ [key]: resolveMediaUrl(media) });
    setTab("generation");
  };

  return (
    <div className="flex flex-col border-l border-border w-96">
      <div className="flex-1 p-4 flex flex-col gap-4 border-b border-border h-full overflow-hidden relative">
        <div className="flex flex-row items-start">
          <h2 className="text-sm text-muted-foreground font-semibold flex-1">
            Generate Media
          </h2>
        </div>
        <div className="w-full flex flex-col">
          <div className="flex w-full gap-2">
            <Button
              variant="ghost"
              onClick={() => handleMediaTypeChange("image")}
              className={cn(
                mediaType === "image" && "bg-[#1F1F1F]",
                "h-14 flex flex-col justify-center w-1/4 rounded-md gap-2 items-center"
              )}
            >
              <ImageIcon className="w-4 h-4 opacity-50" />
              <span className="text-[10px]">Image</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleMediaTypeChange("video")}
              className={cn(
                mediaType === "video" && "bg-[#1F1F1F]",
                "h-14 flex flex-col justify-center w-1/4 rounded-md gap-2 items-center"
              )}
            >
              <VideoIcon className="w-4 h-4 opacity-50" />
              <span className="text-[10px]">Video</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleMediaTypeChange("voiceover")}
              className={cn(
                mediaType === "voiceover" && "bg-[#1F1F1F]",
                "h-14 flex flex-col justify-center w-1/4 rounded-md gap-2 items-center"
              )}
            >
              <MicIcon className="w-4 h-4 opacity-50" />
              <span className="text-[10px]">Voiceover</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleMediaTypeChange("music")}
              className={cn(
                mediaType === "music" && "bg-[#1F1F1F]",
                "h-14 flex flex-col justify-center w-1/4 rounded-md gap-2 items-center"
              )}
            >
              <MusicIcon className="w-4 h-4 opacity-50" />
              <span className="text-[10px]">Music</span>
            </Button>
          </div>
          {tab === "generation" && (
            <div className="flex flex-col gap-2 mt-2 justify-start font-medium text-base">
              <div className="text-[#808080]">Using</div>
              <ModelEndpointPicker
                mediaType={mediaType}
                value={endpointId}
                onValueChange={(endpoint) => {
                  resetGenerateData();
                  setEndpointId(endpoint);
                }}
              />
            </div>
          )}
          {tab === "asset" && (
            <div className="mt-4 flex flex-row gap-2 items-center justify-start font-medium text-base">
              <Button
                variant="ghost"
                onClick={() => setTab("generation")}
                size="sm"
              >
                <ArrowLeft /> Back
              </Button>
              <div>Select Asset</div>
            </div>
          )}
        </div>
        {tab === "generation" && (
          <div className="flex flex-col gap-2 relative">
            {endpoint?.inputAsset?.map((asset) => (
              <div className="flex w-full">
                <div className="flex flex-col w-full" key={getAssetType(asset)}>
                  <h4 className="capitalize text-[#808080] mb-2">
                    {getAssetType(asset)} Reference
                  </h4>
                  <Input
                    key={getAssetType(asset)}
                    type="file"
                    className="hidden"
                    id={`${asset}-upload`}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setGenerateData({
                          [getAssetKey(asset) ??
                          assetKeyMap[getAssetType(asset)]]: file,
                        });
                      }
                    }}
                  />
                  {!generateData[
                    getAssetKey(asset) ?? assetKeyMap[getAssetType(asset)]
                  ] && (
                    <div className="flex flex-col min-h-[70px] justify-between">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setTab("asset");
                          setAssetMediaType(getAssetType(asset) ?? "all");
                        }}
                        className="cursor-pointer min-h-[30px] flex flex-col items-center justify-center border border-dashed border-border rounded-md px-4"
                      >
                        <span className="text-muted-foreground text-xs text-center text-nowrap">
                          Select
                        </span>
                      </Button>
                      <label
                        htmlFor={`${getAssetType(asset)}-upload`}
                        className="cursor-pointer min-h-[30px] flex flex-col items-center justify-center border border-dashed border-border rounded-md px-4"
                      >
                        <span className="text-muted-foreground text-xs text-center text-nowrap">
                          Upload
                        </span>
                      </label>
                    </div>
                  )}
                  {generateData[
                    getAssetKey(asset) ?? assetKeyMap[getAssetType(asset)]
                  ] && (
                    <div className="cursor-pointer overflow-hidden relative w-full flex flex-col items-center justify-center border border-dashed border-border rounded-md">
                      <WithTooltip tooltip="Remove media">
                        <button
                          className="p-1 rounded hover:bg-black/50 absolute top-1 z-50 bg-black/80 right-1 group-hover:text-white"
                          onClick={() =>
                            setGenerateData({
                              [getAssetKey(asset) ??
                              assetKeyMap[getAssetType(asset)]]: undefined,
                            })
                          }
                        >
                          <TrashIcon className="w-3 h-3 stroke-2" />
                        </button>
                      </WithTooltip>
                      {generateData[
                        getAssetKey(asset) ?? assetKeyMap[getAssetType(asset)]
                      ] && (
                        <SelectedAssetPreview
                          asset={asset}
                          data={generateData}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="relative bg-border rounded-lg pb-10 placeholder:text-base w-full  resize-none">
              <Textarea
                className="text-base shadow-none focus:!ring-0 placeholder:text-base w-full h-32 resize-none"
                placeholder="Imagine..."
                value={generateData.prompt}
                rows={3}
                onChange={(e) => setGenerateData({ prompt: e.target.value })}
              />
              <WithTooltip tooltip="Enhance your prompt with AI-powered suggestions.">
                <div className="absolute bottom-2 right-2">
                  <Button
                    variant="secondary"
                    disabled={enhance.isPending}
                    className="bg-purple-400/10 text-purple-400 text-xs rounded-full h-6 px-3"
                    onClick={() => enhance.mutate()}
                  >
                    {enhance.isPending ? (
                      <LoadingIcon />
                    ) : (
                      <WandSparklesIcon className="opacity-50" />
                    )}
                    Enhance Prompt
                  </Button>
                </div>
              </WithTooltip>
            </div>
          </div>
        )}
        {tab === "asset" && (
          <div className="flex items-center gap-2 flex-wrap overflow-y-auto max-h-80 divide-y divide-border">
            {mediaItems
              .filter((media) => {
                if (assetMediaType === "all") return true;
                if (
                  assetMediaType === "audio" &&
                  (media.mediaType === "voiceover" ||
                    media.mediaType === "music")
                )
                  return true;
                return media.mediaType === assetMediaType;
              })
              .map((job) => (
                <MediaItemRow
                  draggable={false}
                  key={job.id}
                  data={job}
                  onOpen={handleSelectMedia}
                  className="cursor-pointer"
                />
              ))}
          </div>
        )}
        {tab === "generation" && (
          <div className="flex flex-col gap-2">
            <div className="flex-1 flex flex-row gap-2">
              {mediaType === "music" && (
                <div className="flex flex-row items-center gap-1">
                  <Label>Duration</Label>
                  <Input
                    className="w-12 text-center tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min={5}
                    max={30}
                    step={1}
                    type="number"
                    value={generateData.duration}
                    onChange={(e) =>
                      setGenerateData({ duration: parseInt(e.target.value) })
                    }
                  />
                  <span>s</span>
                </div>
              )}
              {endpointId === "fal-ai/playht/tts/v3" && (
                <VoiceSelector
                  value={generateData.voice}
                  onValueChange={(voice) => {
                    setGenerateData({ voice });
                  }}
                />
              )}
            </div>
            <div className="flex flex-row gap-2 mt-2">
              <Button
                className="w-full"
                disabled={enhance.isPending || createJob.isPending}
                onClick={handleOnGenerate}
              >
                Generate
              </Button>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent via-background via-60% h-8 pointer-events-none" />
      </div>
    </div>
  );
}

const SelectedAssetPreview = ({
  data,
  asset,
}: {
  data: GenerateData;
  asset: InputAsset;
}) => {
  const assetType = getAssetType(asset);
  const assetKey = getAssetKey(asset);

  if (!data[assetKey]) return null;

  return (
    <>
      {assetType === "audio" && (
        <audio
          src={
            data[assetKey] && typeof data[assetKey] !== "string"
              ? URL.createObjectURL(data[assetKey])
              : data[assetKey] || ""
          }
          className=""
          controls={true}
        />
      )}
      {assetType === "video" && (
        <video
          src={
            data[assetKey] && typeof data[assetKey] !== "string"
              ? URL.createObjectURL(data[assetKey])
              : data[assetKey] || ""
          }
          className=""
          controls={false}
          style={{ pointerEvents: "none" }}
        />
      )}
      {assetType === "image" && (
        <img
          id="image-preview"
          src={
            data[assetKey] && typeof data[assetKey] !== "string"
              ? URL.createObjectURL(data[assetKey])
              : data[assetKey] || ""
          }
          className=""
          alt="Image Preview"
        />
      )}
    </>
  );
};

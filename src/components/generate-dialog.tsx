import { useJobCreator } from "@/data/mutations";
import { useProject, useProjectJobs } from "@/data/queries";
import {
  GenerateData,
  type MediaType,
  useProjectId,
  useVideoProjectStore,
} from "@/data/store";
import { useToast } from "@/hooks/use-toast";
import { AVAILABLE_ENDPOINTS, InputAsset } from "@/lib/fal";
import { enhancePrompt } from "@/lib/prompt";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  ImageIcon,
  MicIcon,
  MusicIcon,
  TrashIcon,
  VideoIcon,
  WandSparklesIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { WithTooltip } from "./ui/tooltip";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { VoiceSelector } from "./playht/voice-selector";
import { JobItem } from "./jobs-panel";

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
      <SelectTrigger className="text-base w-fit minw-56 font-semibold">
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

type GenerateDialogProps = {} & Parameters<typeof Dialog>[0];

const assetKeyMap: Record<InputAsset, keyof GenerateData> = {
  image: "image",
  video: "video_url",
  audio: "audio_url",
};

export function GenerateDialog({
  onOpenChange,
  ...props
}: GenerateDialogProps) {
  const { generateData, setGenerateData } = useVideoProjectStore((s) => s);

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
      setGenerateData({
        prompt: "",
        image: null,
        video_url: null,
        audio_url: null,
      });
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

  const { data: jobs = [] } = useProjectJobs(projectId);
  const mediaType = useVideoProjectStore((s) => s.generateMediaType);
  const setMediaType = useVideoProjectStore((s) => s.setGenerateMediaType);
  const [endpointId, setEndpointId] = useState<string>(() => {
    const endpoint = AVAILABLE_ENDPOINTS.find(
      (endpoint) => endpoint.category === mediaType
    );
    return endpoint?.endpointId ?? AVAILABLE_ENDPOINTS[0].endpointId;
  });

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
  };

  const input: InputType = {
    prompt: generateData.prompt,
    image_url: undefined,
    image_size: mediaType === "image" ? "landscape_16_9" : undefined,
    aspect_ratio: mediaType === "video" ? "16:9" : undefined,
    seconds_total:
      endpointId === "fal-ai/stable-audio" ? generateData.duration : undefined,
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

  const handleSelectMedia = (job: any) => {
    console.log({ job });
    if (job.mediaType === "image") {
      setGenerateData({ image: job.output.images?.[0]?.url });
      setTab("generation");
    } else if (job.mediaType === "video") {
      setGenerateData({ video_url: job.output.video?.url });
      setTab("generation");
    }
  };

  return (
    <Dialog {...props} onOpenChange={handleOnOpenChange}>
      <DialogContent className="flex flex-col max-w-4xl">
        <DialogTitle className="sr-only">Generate</DialogTitle>
        <DialogDescription className="sr-only">
          Generate a new image or video from your text input.
        </DialogDescription>
        <DialogHeader>
          {tab === "generation" && (
            <div className="mt-4 flex flex-row gap-2 items-center justify-start font-medium text-base">
              <div>Generate</div>
              <Select value={mediaType} onValueChange={handleMediaTypeChange}>
                <SelectTrigger className="w-36 text-base font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">
                    <div className="flex flex-row gap-2 items-center">
                      <ImageIcon className="w-4 h-4 opacity-50" />
                      <span>Image</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex flex-row gap-2 items-center">
                      <VideoIcon className="w-4 h-4 opacity-50" />
                      <span>Video</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="voiceover">
                    <div className="flex flex-row gap-2 items-center">
                      <MicIcon className="w-4 h-4 opacity-50" />
                      <span>Voiceover</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="music">
                    <div className="flex flex-row gap-2 items-center">
                      <MusicIcon className="w-4 h-4 opacity-50" />
                      <span>Music</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <div>using</div>
              <ModelEndpointPicker
                mediaType={mediaType}
                value={endpointId}
                onValueChange={setEndpointId}
              />
            </div>
          )}
          {tab === "asset" && (
            <div className="mt-4 flex flex-row gap-2 items-center justify-start font-medium text-base">
              <div>Select Asset</div>
              <Button
                variant="outline"
                className="ml-auto"
                onClick={() => setTab("generation")}
              >
                <ArrowLeft size={14} /> Back
              </Button>
            </div>
          )}
        </DialogHeader>
        {tab === "generation" && (
          <div className="flex flex-col gap-4 divide-y divide-border">
            <Textarea
              className="text-base placeholder:text-base w-full resize-none"
              placeholder="Imagine..."
              value={generateData.prompt}
              rows={3}
              onChange={(e) => setGenerateData({ prompt: e.target.value })}
            />

            <div className="flex divide-x divide-border">
              {endpoint?.inputAsset?.map((asset) => (
                <div className="max-w-xs py-4 px-8" key={asset}>
                  <h4 className="capitalize font-medium mb-2">
                    {asset} Reference
                  </h4>
                  <Input
                    key={asset}
                    type="file"
                    className="hidden"
                    id={`${asset}-upload`}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      console.log(asset, assetKeyMap[asset], file);
                      if (file) setGenerateData({ [assetKeyMap[asset]]: file });
                    }}
                  />
                  {!generateData[assetKeyMap[asset]] && (
                    <div className="flex flex-col min-h-[70px] justify-between">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setTab("asset");
                          setAssetMediaType(asset ?? "all");
                        }}
                        className="cursor-pointer min-h-[30px] flex flex-col items-center justify-center border border-dashed border-border rounded-md px-4"
                      >
                        <span className="text-muted-foreground text-xs text-center text-nowrap">
                          Select
                        </span>
                      </Button>
                      <label
                        htmlFor={`${asset}-upload`}
                        className="cursor-pointer min-h-[30px] flex flex-col items-center justify-center border border-dashed border-border rounded-md px-4"
                      >
                        <span className="text-muted-foreground text-xs text-center text-nowrap">
                          Upload
                        </span>
                      </label>
                    </div>
                  )}
                  {generateData[assetKeyMap[asset]] && (
                    <div className="cursor-pointer overflow-hidden relative w-full flex flex-col items-center justify-center border border-dashed border-border rounded-md">
                      <WithTooltip tooltip="Remove media">
                        <button
                          className="p-1 rounded hover:bg-black/50 absolute top-1 z-50 bg-black/80 right-1 group-hover:text-white"
                          onClick={() =>
                            setGenerateData({
                              image: undefined,
                              video_url: undefined,
                              audio_url: undefined,
                            })
                          }
                        >
                          <TrashIcon className="w-3 h-3 stroke-2" />
                        </button>
                      </WithTooltip>
                      {generateData[assetKeyMap[asset]] && (
                        <SelectedAssetPreview
                          asset={asset}
                          data={generateData}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === "asset" && (
          <div className="flex items-center gap-2 flex-wrap overflow-y-auto max-h-80">
            {jobs
              .filter((job) => {
                if (assetMediaType === "all") return true;
                return job.mediaType === assetMediaType;
              })
              .map((job, index) => (
                <JobItem
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
          <DialogFooter className="flex flex-row gap-2 items-end">
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
              {/* <Popover>
              <PopoverTrigger asChild>
                <Button size="sm" variant="secondary">
                  <RatioIcon className="opacity-50" />
                  <span className="w-8">{aspectRatio ?? "AR"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit max-w-fit z-[81]" align="start">
                <AspectRatioSelector
                  value={aspectRatio}
                  onValueChange={setAspectRatio}
                />
              </PopoverContent>
            </Popover> */}
            </div>
            <div className="flex flex-row gap-2">
              <WithTooltip tooltip="Enhance your prompt with AI-powered suggestions.">
                <Button
                  variant="secondary"
                  disabled={enhance.isPending}
                  onClick={() => enhance.mutate()}
                >
                  {enhance.isPending ? (
                    <LoadingIcon />
                  ) : (
                    <WandSparklesIcon className="opacity-50" />
                  )}
                  Enhance
                </Button>
              </WithTooltip>
              <Button
                disabled={enhance.isPending || createJob.isPending}
                onClick={handleOnGenerate}
              >
                Generate
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

const SelectedAssetPreview = ({
  data,
  asset,
}: {
  data: GenerateData;
  asset: InputAsset;
}) => {
  console.log(asset, { data });
  return (
    <>
      {data.audio_url && asset === "audio" && (
        <audio
          src={
            data.audio_url && typeof data.audio_url !== "string"
              ? URL.createObjectURL(data.audio_url)
              : data.audio_url || ""
          }
          className=""
          controls={true}
        />
      )}
      {data.video_url && asset === "video" && (
        <video
          src={
            data.video_url && typeof data.video_url !== "string"
              ? URL.createObjectURL(data.video_url)
              : data.video_url || ""
          }
          className=""
          controls={false}
          style={{ pointerEvents: "none" }}
        />
      )}
      {data.image && asset === "image" && (
        <img
          id="image-preview"
          src={
            data.image && typeof data.image !== "string"
              ? URL.createObjectURL(data.image)
              : data.image || ""
          }
          className=""
          alt="Image Preview"
        />
      )}
    </>
  );
};

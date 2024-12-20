import { useJobCreator } from "@/data/mutations";
import { queryKeys, useProject } from "@/data/queries";
import {
  type MediaType,
  useProjectId,
  useVideoProjectStore,
} from "@/data/store";
import { useToast } from "@/hooks/use-toast";
import { AVAILABLE_ENDPOINTS } from "@/lib/fal";
import { enhancePrompt } from "@/lib/prompt";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ImageIcon,
  MicIcon,
  MusicIcon,
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
    [mediaType],
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

export function GenerateDialog({
  onOpenChange,
  ...props
}: GenerateDialogProps) {
  // TODO: improve field per model
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(30);
  const [voice, setVoice] = useState("");

  const projectId = useProjectId();
  const openGenerateDialog = useVideoProjectStore((s) => s.openGenerateDialog);
  const closeGenerateDialog = useVideoProjectStore(
    (s) => s.closeGenerateDialog,
  );
  const handleOnOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      closeGenerateDialog();
      setPrompt("");
      return;
    }
    onOpenChange?.(isOpen);
    openGenerateDialog();
  };

  const { data: project } = useProject(projectId);

  const { toast } = useToast();
  const enhance = useMutation({
    mutationFn: async () => {
      return enhancePrompt(prompt, { type: mediaType, project });
    },
    onSuccess: (enhancedPrompt) => {
      setPrompt(enhancedPrompt);
    },
    onError: (error) => {
      console.warn("Failed to create suggestion", error);
      toast({
        title: "Failed to enhance prompt",
        description: "There was an unexpected error. Try again.",
      });
    },
  });

  const mediaType = useVideoProjectStore((s) => s.generateMediaType);
  const setMediaType = useVideoProjectStore((s) => s.setGenerateMediaType);
  const [endpointId, setEndpointId] = useState<string>(() => {
    const endpoint = AVAILABLE_ENDPOINTS.find(
      (endpoint) => endpoint.category === mediaType,
    );
    return endpoint?.endpointId ?? AVAILABLE_ENDPOINTS[0].endpointId;
  });
  const handleMediaTypeChange = (mediaType: string) => {
    setMediaType(mediaType as MediaType);
    const endpoint = AVAILABLE_ENDPOINTS.find(
      (endpoint) => endpoint.category === mediaType,
    );
    setEndpointId(endpoint?.endpointId ?? AVAILABLE_ENDPOINTS[0].endpointId);
  };
  // TODO improve model-specific parameters
  const input = {
    prompt: prompt,
    image_size: {
      width: 1920,
      height: 1080,
    },
    aspect_ratio: "16:9",
    seconds_total: endpointId === "fal-ai/stable-audio" ? duration : undefined,
  };
  const extraInput =
    endpointId === "fal-ai/f5-tts"
      ? {
          gen_text: prompt,
          ref_audio_url:
            "https://github.com/SWivid/F5-TTS/raw/21900ba97d5020a5a70bcc9a0575dc7dec5021cb/tests/ref_audio/test_en_1_ref_short.wav",
          ref_text: "Some call me nature, others call me mother nature.",
          model_type: "F5-TTS",
          remove_silence: true,
        }
      : {};
  const createJob = useJobCreator({
    projectId,
    endpointId,
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

  return (
    <Dialog {...props} onOpenChange={handleOnOpenChange}>
      <DialogContent className="flex flex-col max-w-4xl">
        <DialogTitle className="sr-only">Generate</DialogTitle>
        <DialogDescription className="sr-only">
          Generate a new image or video from your text input.
        </DialogDescription>
        <DialogHeader>
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
        </DialogHeader>
        <div className="">
          <Textarea
            className="text-base placeholder:text-base w-full resize-none"
            placeholder="Imagine..."
            value={prompt}
            rows={3}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
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
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                />
                <span>s</span>
              </div>
            )}
            {endpointId === "fal-ai/playht/tts/v3" && (
              <VoiceSelector value={voice} onValueChange={setVoice} />
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
      </DialogContent>
    </Dialog>
  );
}

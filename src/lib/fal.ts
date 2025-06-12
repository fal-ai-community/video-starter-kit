"use client";

import { createFalClient } from "@fal-ai/client";

export const fal = createFalClient({
  credentials: () => {
    if (typeof localStorage === "object") {
      return localStorage.getItem("falKey") as string;
    }
    return undefined;
  },
  proxyUrl: "/api/fal",
});

export type InputAsset =
  | "video"
  | "image"
  | "audio"
  | {
      type: "video" | "image" | "audio";
      key: string;
    };

export type ApiInfo = {
  endpointId: string;
  label: string;
  description: string;
  cost: string;
  inferenceTime?: string;
  inputMap?: Record<string, string>;
  inputAsset?: InputAsset[];
  initialInput?: Record<string, unknown>;
  cameraControl?: boolean;
  imageForFrame?: boolean;
  category: "image" | "video" | "music" | "voiceover";
  prompt?: boolean;
  from?: string;
};

export const AVAILABLE_ENDPOINTS: ApiInfo[] = [
  {
    endpointId: "fal-ai/imagen3",
    label: "Imagen3",
    description:
      "Imagen3 is a high-quality text-to-image model that generates realistic images from text prompts.",
    cost: "",
    category: "image",
    from: "Google",
  },
  {
    endpointId: "fal-ai/ideogram/v3",
    label: "Ideogram V3",
    description:
      "Generate high-quality images, posters, and logos with Ideogram V3. Features exceptional typography handling and realistic outputs optimized for commercial and creative use.",
    cost: "",
    category: "image",
  },
  {
    endpointId: "fal-ai/flux-pro/v1.1-ultra",
    label: "Flux Pro 1.1 Ultra",
    description: "Generate a video from a text prompt",
    cost: "",
    category: "image",
  },
  {
    endpointId: "fal-ai/recraft/v3/text-to-image",
    label: "Recraft V3",
    description:
      "Recraft V3 is a text-to-image model with the ability to generate long texts, vector art, images in brand style, and much more. As of today, it is SOTA in image generation, proven by Hugging Face's industry-leading Text-to-Image Benchmark by Artificial Analysis.",
    cost: "",
    category: "image",
  },
  {
    endpointId: "fal-ai/veo3",
    label: "Veo 3",
    description:
      "Veo 3 by Google, the most advanced AI video generation model in the world. With sound on!",
    cost: "",
    category: "video",
    from: "Google",
  },
  {
    endpointId: "fal-ai/veo2",
    label: "Veo 2",
    description:
      "Veo creates videos with realistic motion and high quality output, up to 4K.",
    cost: "",
    category: "video",
    from: "Google",
  },
  {
    endpointId: "fal-ai/veo2/image-to-video",
    label: "Veo 2 (Image to Video)",
    description:
      "Veo 2 creates videos from images with realistic motion and very high quality output.",
    cost: "",
    category: "video",
    inputAsset: ["image"],
    from: "Google",
  },
  {
    endpointId: "fal-ai/kling-video/v2.1/master/image-to-video",
    label: "Kling 2.1 Master",
    description:
      "Kling 2.1 Master: The premium endpoint for Kling 2.1, designed for top-tier image-to-video generation with unparalleled motion fluidity, cinematic visuals, and exceptional prompt precision.",
    cost: "",
    category: "video",
    inputAsset: ["image"],
  },
  {
    endpointId: "fal-ai/kling-video/v1.5/pro",
    label: "Kling 1.5 Pro",
    description: "High quality video",
    cost: "",
    category: "video",
    inputAsset: ["image"],
  },
  {
    endpointId: "fal-ai/minimax/video-01-live",
    label: "Minimax Video 01 Live",
    description: "High quality video, realistic motion and physics",
    cost: "",
    category: "video",
    inputAsset: ["image"],
  },
  {
    endpointId: "cassetteai/music-generator",
    label: "Cassette AI",
    description:
      "CassetteAI’s model generates a 30-second sample in under 2 seconds and a full 3-minute track in under 10 seconds. At 44.1 kHz stereo audio, expect a level of professional consistency with no breaks, no squeaks, and no random interruptions in your creations.",
    cost: "",
    category: "music",
  },
  {
    endpointId: "fal-ai/minimax-music",
    label: "Minimax Music",
    description:
      "Advanced AI techniques to create high-quality, diverse musical compositions",
    cost: "",
    category: "music",
    inputAsset: [
      {
        type: "audio",
        key: "reference_audio_url",
      },
    ],
  },
  {
    endpointId: "fal-ai/minimax/speech-02-hd",
    label: "MiniMax Speech-02 HD",
    description:
      "Generate speech from text prompts and different voices using the MiniMax Speech-02 HD model, which leverages advanced AI techniques to create high-quality text-to-speech.",
    cost: "",
    category: "voiceover",
    inputMap: {
      prompt: "text",
    },
    initialInput: {
      voice: "Dexter (English (US)/American)",
    },
  },
  {
    endpointId: "fal-ai/elevenlabs/tts/multilingual-v2",
    label: "ElevenLabs TTS Multilingual v2",
    description:
      "Generate multilingual text-to-speech audio using ElevenLabs TTS Multilingual v2.",
    cost: "",
    category: "voiceover",
    inputMap: {
      prompt: "text",
    },
  },
  {
    endpointId: "fal-ai/topaz/upscale/video",
    label: "Video Upscale",
    description:
      "Professional-grade video upscaling using Topaz technology. Enhance your videos with high-quality upscaling.",
    cost: "",
    category: "video",
    prompt: false,
    inputAsset: ["video"],
  },
];

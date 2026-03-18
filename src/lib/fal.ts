"use client";

import { createFalClient } from "@fal-ai/client";
import {
  type ModelPricing,
  calculateModelCost,
  formatCost,
  getModelSchema,
  getPricingInfo,
} from "./pricing";

export const fal = createFalClient({
  credentials: () =>
    typeof window !== "undefined"
      ? (localStorage?.getItem("falKey") as string)
      : "",
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
  provider: "fal" | "runware";
  endpointId: string;
  label: string;
  description?: string;
  cost?: string; // Deprecated: Use getPricingInfo() or calculateModelCost() instead
  popularity: number;
  inferenceTime?: string;
  inputMap?: Record<string, string>;
  inputAsset?: InputAsset[];
  initialInput?: Record<string, unknown>;
  cameraControl?: boolean;
  imageForFrame?: boolean;
  category: "image" | "video" | "music" | "voiceover";
  architecture?: string; // Raw architecture from bundle (e.g., "sdxl", "flux", "imagen")
  modelType?: string; // Model family/type for categorization (e.g., "FLUX", "Stable Diffusion", "Veo", "Sora")
  prompt?: boolean;

  // Model-specific constraints for UI options
  availableDurations?: number[]; // e.g., [4, 6, 8] or [8] for fixed duration
  availableDimensions?: Array<{
    width: number;
    height: number;
    label: string;
    preset?: string;
  }>;
  supportedAspectRatios?: Array<{
    width: number;
    height: number;
    label: string;
  }>;
  availableFps?: number[]; // e.g., [24] or [24, 25, 50]
  defaultDuration?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  defaultFps?: number;

  // Steps/inference parameters
  availableSteps?: number[];
  minSteps?: number;
  maxSteps?: number;
  defaultSteps?: number;

  // Guidance/CFG scale parameters
  minGuidanceScale?: number;
  maxGuidanceScale?: number;
  defaultGuidanceScale?: number;

  // Strength parameter (for img2img, video2video)
  minStrength?: number;
  maxStrength?: number;
  defaultStrength?: number;

  // Feature flags
  hasSeed?: boolean;
  hasNegativePrompt?: boolean;
  hasSafetyChecker?: boolean;

  // Scheduler and acceleration
  availableSchedulers?: string[];
  defaultScheduler?: string;
  availableAcceleration?: string[];
  defaultAcceleration?: string;

  // Structured pricing information (from fal_models_schemas.json)
  pricing?: ModelPricing;
};

export const AVAILABLE_ENDPOINTS: ApiInfo[] = [
  {
    provider: "fal",
    endpointId: "fal-ai/flux-pro/kontext",
    label: "FLUX.1 Kontext [pro]",
    description:
      "Professional image generation with context-aware editing capabilities",
    cost: "$0.04/image",
    popularity: 5,
    category: "image",
    inputAsset: ["image"],
    availableDimensions: [
      {
        width: 1344,
        height: 576,
        label: "1344x576 (21:9)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 1024,
        height: 768,
        label: "1024x768 (4:3)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
      {
        width: 768,
        height: 1024,
        label: "768x1024 (3:4)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 576,
        height: 1344,
        label: "576x1344 (9:21)",
      },
    ],
    minGuidanceScale: 1,
    maxGuidanceScale: 20,
    defaultGuidanceScale: 3.5,
    hasSeed: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/flux-pro/kontext/max",
    label: "FLUX.1 Kontext Max [pro]",
    description: "Maximum quality context-aware image generation and editing",
    cost: "$0.08/image",
    popularity: 4,
    category: "image",
    inputAsset: ["image"],
    initialInput: {
      prompt: "",
      image_url: "",
    },
    availableDimensions: [
      {
        width: 1344,
        height: 576,
        label: "1344x576 (21:9)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 1024,
        height: 768,
        label: "1024x768 (4:3)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
      {
        width: 768,
        height: 1024,
        label: "768x1024 (3:4)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 576,
        height: 1344,
        label: "576x1344 (9:21)",
      },
    ],
    minGuidanceScale: 1,
    maxGuidanceScale: 20,
    defaultGuidanceScale: 3.5,
    hasSeed: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/gemini-25-flash-image",
    label: "Gemini 2.5 Flash Image",
    description: "Rapid Gemini 2.5 Flash text-to-image generation",
    cost: "$0.05/image",
    popularity: 5,
    category: "image",
    initialInput: {
      prompt: "",
    },
    availableDimensions: [
      {
        width: 1344,
        height: 576,
        label: "1344x576 (21:9)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
      {
        width: 1024,
        height: 768,
        label: "1024x768 (4:3)",
      },
      {
        width: 768,
        height: 1024,
        label: "768x1024 (3:4)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
    ],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/gemini-25-flash-image/edit",
    label: "Gemini 2.5 Flash Image (Edit)",
    description: "Rapid Gemini 2.5 Flash image-to-image editing",
    cost: "$0.05/image",
    popularity: 4,
    category: "image",
    inputAsset: ["image"],
    initialInput: {
      prompt: "",
      image_urls: [],
    },
    inputMap: {
      image_url: "image_urls",
    },
  },
  {
    provider: "fal",
    endpointId: "fal-ai/bytedance/seedream/v4/text-to-image",
    label: "Seedream V4",
    description: "ByteDance Seedream V4 high fidelity image generation",
    cost: "$0.03/image",
    popularity: 4,
    category: "image",
    initialInput: {
      prompt: "",
      defaultWidth: 2048,
      defaultHeight: 2048,
    },
    hasSeed: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/bytedance/seedream/v4/edit",
    label: "Seedream V4 (Edit)",
    description: "ByteDance Seedream V4 high fidelity image editing",
    cost: "$0.03/image",
    popularity: 3,
    category: "image",
    inputAsset: ["image"],
    initialInput: {
      prompt: "",
      image_urls: [],
      defaultWidth: 2048,
      defaultHeight: 2048,
    },
    inputMap: {
      image_url: "image_urls",
    },
    hasSeed: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/bytedance/seedream/v3/text-to-image",
    label: "Seedream V3",
    description: "ByteDance Seedream V3 bilingual text-to-image generation",
    cost: "$0.02/image",
    popularity: 3,
    category: "image",
    initialInput: {
      prompt: "",
    },
    minGuidanceScale: 1,
    maxGuidanceScale: 10,
    defaultGuidanceScale: 2.5,
    hasSeed: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/reve/edit",
    label: "Reve (Edit)",
    description: "Photorealistic image refinement and editing",
    cost: "$0.04/image",
    popularity: 3,
    category: "image",
    inputAsset: ["image"],
    initialInput: {
      prompt: "",
      image_url: "",
    },
  },
  {
    provider: "fal",
    endpointId: "fal-ai/gpt-image-1-mini",
    label: "GPT-Image 1 Mini",
    description: "Compact GPT-Image generation for quick iterations",
    cost: "$0.04/image",
    popularity: 3,
    category: "image",
    initialInput: {
      prompt: "",
    },
  },
  {
    provider: "fal",
    endpointId: "fal-ai/gpt-image-1-mini/edit",
    label: "GPT-Image 1 Mini (Edit)",
    description: "Compact GPT-Image editing for quick iterations",
    cost: "$0.04/image",
    popularity: 3,
    category: "image",
    inputAsset: ["image"],
    initialInput: {
      prompt: "",
      image_urls: [],
    },
    inputMap: {
      image_url: "image_urls",
    },
  },
  {
    provider: "fal",
    endpointId: "fal-ai/flux-kontext-lora",
    label: "FLUX Kontext LoRA",
    description: "Lightweight LoRA-tuned Kontext image generation",
    cost: "$0.02/image",
    popularity: 2,
    category: "image",
    inputAsset: ["image"],
    initialInput: {
      prompt: "",
      image_url: "",
    },
    minSteps: 10,
    maxSteps: 50,
    defaultSteps: 30,
    minGuidanceScale: 0,
    maxGuidanceScale: 20,
    defaultGuidanceScale: 2.5,
    hasSeed: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/flux/dev",
    label: "FLUX.1 [dev]",
    description:
      "High-quality image generation model optimized for creative workflows",
    cost: "$0.025/megapixel",
    popularity: 5,
    category: "image",
    minSteps: 1,
    maxSteps: 50,
    defaultSteps: 28,
    minGuidanceScale: 1,
    maxGuidanceScale: 20,
    defaultGuidanceScale: 3.5,
    hasSeed: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/ideogram/v3",
    label: "Ideogram V3 (Text)",
    description:
      "Advanced text-to-image model with superior text rendering capabilities",
    cost: "$0.08/image",
    popularity: 5,
    category: "image",
    hasSeed: true,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/ideogram/v3/edit",
    label: "Ideogram V3 (Inpainting)",
    description: "Inpainting with mask support - requires mask_url parameter",
    cost: "$0.08/image",
    popularity: 5,
    category: "image",
    hasSeed: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/recraft/v3/text-to-image",
    label: "Recraft V3",
    description: "Professional design-focused image generation",
    cost: "$0.0125/image",
    popularity: 5,
    category: "image",
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/nano-banana",
    label: "Nano Banana",
    description: "Fast image editing with mask support",
    cost: "$0.03/image",
    popularity: 4,
    category: "image",
    inputAsset: ["image"],
    availableDimensions: [
      {
        width: 1344,
        height: 576,
        label: "1344x576 (21:9)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
      {
        width: 1024,
        height: 768,
        label: "1024x768 (4:3)",
      },
      {
        width: 768,
        height: 1024,
        label: "768x1024 (3:4)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
    ],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/stable-diffusion-v35-large",
    label: "Stable Diffusion 3.5 Large",
    description: "Latest Stable Diffusion with enhanced quality and control",
    cost: "$0.03/megapixel",
    popularity: 4,
    category: "image",
    minSteps: 1,
    maxSteps: 50,
    defaultSteps: 28,
    minGuidanceScale: 0,
    maxGuidanceScale: 20,
    defaultGuidanceScale: 3.5,
    hasSeed: true,
    hasNegativePrompt: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/flux/schnell",
    label: "FLUX.1 [schnell]",
    description: "Ultra-fast image generation model",
    cost: "$0.003/megapixel",
    popularity: 4,
    category: "image",
    minSteps: 1,
    maxSteps: 12,
    defaultSteps: 4,
    minGuidanceScale: 1,
    maxGuidanceScale: 20,
    defaultGuidanceScale: 3.5,
    hasSeed: true,
    hasSafetyChecker: true,
    availableDimensions: [
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1) - Square",
        preset: "square",
      },
      {
        width: 1536,
        height: 1536,
        label: "1536x1536 (1:1) - Square HD",
        preset: "square_hd",
      },
      {
        width: 1024,
        height: 768,
        label: "1024x768 (4:3) - Landscape",
        preset: "landscape_4_3",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9) - Landscape",
        preset: "landscape_16_9",
      },
      {
        width: 768,
        height: 1024,
        label: "768x1024 (3:4) - Portrait",
        preset: "portrait_4_3",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16) - Portrait",
        preset: "portrait_16_9",
      },
    ],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/imagen4/preview",
    label: "Imagen 4.0 Ultra",
    description: "Google's flagship Imagen 4 Ultra model for premier quality",
    cost: "$0.08/image",
    popularity: 5,
    category: "image",
    initialInput: {
      prompt:
        "An ultra-detailed macro photograph of a butterfly wing showing intricate patterns and iridescent colors with perfect focus and lighting",
    },
    availableDimensions: [
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 768,
        height: 1024,
        label: "768x1024 (3:4)",
      },
      {
        width: 1024,
        height: 768,
        label: "1024x768 (4:3)",
      },
    ],
    hasSeed: true,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/imagen4/preview/fast",
    label: "Imagen 4.0 Fast",
    description:
      "Accelerated Imagen 4 generation optimized for quick turnarounds",
    cost: "$0.05/image",
    popularity: 4,
    category: "image",
    initialInput: {
      prompt: "",
    },
    availableDimensions: [
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 768,
        height: 1024,
        label: "768x1024 (3:4)",
      },
      {
        width: 1024,
        height: 768,
        label: "1024x768 (4:3)",
      },
    ],
    hasSeed: true,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/flux-pro/v1.1-ultra",
    label: "Flux Pro 1.1 Ultra",
    description: "Ultra high quality image generation",
    cost: "$0.06/image",
    popularity: 4,
    category: "image",
    inputAsset: ["image"],
    initialInput: {
      aspect_ratio: "16:9",
      raw: true,
    },
    hasSeed: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/hunyuan-image/v3/text-to-image",
    label: "Hunyuan Image 3.0",
    description: "Advanced image generation with style control",
    cost: "$0.1/megapixel",
    popularity: 3,
    category: "image",
    minSteps: 1,
    maxSteps: 50,
    defaultSteps: 28,
    minGuidanceScale: 1,
    maxGuidanceScale: 20,
    defaultGuidanceScale: 7.5,
    hasSeed: true,
    hasNegativePrompt: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/topaz/upscale/image",
    label: "Topaz Image Upscale",
    description: "Professional image upscaling",
    cost: "~$0.025/megapixel",
    popularity: 3,
    category: "image",
    prompt: false,
    inputAsset: ["image"],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/wan-25-preview/text-to-image",
    label: "Wan 2.5 (Text-to-Image)",
    description: "Wan 2.5 text-to-image model",
    cost: "TBA",
    popularity: 3,
    category: "image",
    hasSeed: true,
    hasNegativePrompt: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/wan-25-preview/image-to-image",
    label: "Wan 2.5 (Image-to-Image)",
    description: "Wan 2.5 image-to-image model",
    cost: "TBA",
    popularity: 3,
    category: "image",
    inputAsset: ["image"],
    initialInput: {
      prompt: "",
      image_urls: [],
    },
    inputMap: {
      image_url: "image_urls",
    },
    hasSeed: true,
    hasNegativePrompt: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/hidream-i1-full",
    label: "HiDream-I1 Full",
    description: "High-quality image generation with style presets",
    cost: "$0.05/megapixel",
    popularity: 2,
    category: "image",
    defaultWidth: 1024,
    defaultHeight: 1024,
    minSteps: 1,
    maxSteps: 50,
    defaultSteps: 50,
    minGuidanceScale: 0,
    maxGuidanceScale: 20,
    defaultGuidanceScale: 5,
    hasSeed: true,
    hasNegativePrompt: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/qwen-image",
    label: "Qwen Image",
    description: "Text-to-image generation with Qwen multimodal model",
    cost: "~$0.03/megapixel",
    popularity: 2,
    category: "image",
    minSteps: 2,
    maxSteps: 250,
    defaultSteps: 30,
    minGuidanceScale: 0,
    maxGuidanceScale: 20,
    defaultGuidanceScale: 2.5,
    hasSeed: true,
    hasNegativePrompt: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/qwen-image/image-to-image",
    label: "Qwen Image (Image-to-Image)",
    description: "Image-to-image transformation with Qwen multimodal model",
    cost: "~$0.03/megapixel",
    popularity: 2,
    category: "image",
    inputAsset: ["image"],
    inputMap: {
      image: "image_url",
    },
    minSteps: 2,
    maxSteps: 250,
    defaultSteps: 30,
    minGuidanceScale: 0,
    maxGuidanceScale: 20,
    defaultGuidanceScale: 2.5,
    minStrength: 0,
    maxStrength: 1,
    defaultStrength: 0.95,
    hasSeed: true,
    hasNegativePrompt: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/veo3",
    label: "Veo 3",
    description:
      "Flagship Veo 3 text-to-video generation with cinematic quality",
    cost: "$0.15/video",
    popularity: 5,
    category: "video",
    initialInput: {
      prompt: "",
    },
    availableDurations: [4, 6, 8],
    defaultDuration: 8,
    availableDimensions: [
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
    ],
    hasSeed: true,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/veo3/fast",
    label: "Veo 3 Fast",
    description:
      "Accelerated Veo 3 text-to-video generation for rapid iteration",
    cost: "$0.10/video",
    popularity: 5,
    category: "video",
    initialInput: {
      prompt: "",
    },
    availableDurations: [4, 6, 8],
    defaultDuration: 8,
    availableDimensions: [
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
    ],
    hasSeed: true,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/veo3/image-to-video",
    label: "Veo 3 (Image-to-Video)",
    description:
      "Google's Veo 3 flagship image-to-video generation with native audio",
    cost: "$0.24/sec",
    popularity: 5,
    category: "video",
    inputAsset: ["image"],
    initialInput: {
      prompt: "",
      image_url: "",
    },
    availableDurations: [8],
    defaultDuration: 8,
    availableDimensions: [
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
    ],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/veo3/fast/image-to-video",
    label: "Veo 3 Fast (Image-to-Video)",
    description:
      "Accelerated Veo 3 image-to-video generation with native audio support",
    cost: "$0.12/sec",
    popularity: 5,
    category: "video",
    inputAsset: ["image"],
    initialInput: {
      prompt: "",
      image_url: "",
    },
    availableDurations: [8],
    defaultDuration: 8,
    availableDimensions: [
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
    ],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/veo3.1",
    label: "Veo 3.1 (Text)",
    description: "Google's latest Veo 3.1 model with native audio generation",
    cost: "TBA",
    popularity: 5,
    category: "video",
    availableDurations: [4, 6, 8],
    defaultDuration: 8,
    availableDimensions: [
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
    ],
    hasSeed: true,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/veo3.1/fast",
    label: "Veo 3.1 Fast (Text)",
    description: "Faster and more cost effective version of Google's Veo 3.1",
    cost: "TBA",
    popularity: 5,
    category: "video",
    availableDurations: [4, 6, 8],
    defaultDuration: 8,
    availableDimensions: [
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
    ],
    hasSeed: true,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/veo3.1/image-to-video",
    label: "Veo 3.1 (Image)",
    description: "Veo 3.1 state-of-the-art image-to-video generation",
    cost: "TBA",
    popularity: 5,
    category: "video",
    inputAsset: ["image"],
    availableDurations: [8],
    defaultDuration: 8,
    availableDimensions: [
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
    ],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/veo3.1/fast/image-to-video",
    label: "Veo 3.1 Fast (Image)",
    description: "Generate videos from images using Veo 3.1 fast",
    cost: "TBA",
    popularity: 5,
    category: "video",
    inputAsset: ["image"],
    availableDurations: [8],
    defaultDuration: 8,
    availableDimensions: [
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
    ],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/veo3.1/reference-to-video",
    label: "Veo 3.1 Reference (Image)",
    description: "Generate videos from reference images using Google's Veo 3.1",
    cost: "TBA",
    popularity: 5,
    category: "video",
    inputAsset: ["image"],
    availableDurations: [8],
    defaultDuration: 8,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/veo3.1/first-last-frame-to-video",
    label: "Veo 3.1 First-Last Frame",
    description: "Generate videos from first and last frames using Veo 3.1",
    cost: "TBA",
    popularity: 4,
    category: "video",
    inputAsset: ["image"],
    availableDurations: [8],
    defaultDuration: 8,
    availableDimensions: [
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
    ],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/veo3.1/fast/first-last-frame-to-video",
    label: "Veo 3.1 Fast First-Last Frame",
    description: "Generate videos from first/last frames using Veo 3.1 Fast",
    cost: "TBA",
    popularity: 4,
    category: "video",
    inputAsset: ["image"],
    availableDurations: [8],
    defaultDuration: 8,
    availableDimensions: [
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
    ],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/bytedance/seedance/v1/pro/image-to-video",
    label: "Seedance 1.0 Pro (Image)",
    description:
      "ByteDance Seedance 1.0 Pro cinematic image-to-video generation",
    cost: "$0.20/5sec",
    popularity: 4,
    category: "video",
    inputAsset: ["image"],
    initialInput: {
      prompt: "",
      image_url: "",
    },
    availableDurations: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    defaultDuration: 5,
    availableDimensions: [
      {
        width: 1344,
        height: 576,
        label: "1344x576 (21:9)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 1024,
        height: 768,
        label: "1024x768 (4:3)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
      {
        width: 768,
        height: 1024,
        label: "768x1024 (3:4)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
    ],
    hasSeed: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/kling-video/v2.5-turbo/pro/text-to-video",
    label: "Kling 2.5 Turbo Pro (Text)",
    description:
      "Top-tier text-to-video generation with unparalleled motion fluidity",
    cost: "$0.35/5sec",
    popularity: 5,
    category: "video",
    availableDurations: [5, 10],
    defaultDuration: 5,
    availableDimensions: [
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
    ],
    minGuidanceScale: 0,
    maxGuidanceScale: 1,
    defaultGuidanceScale: 0.5,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/kling-video/v2.5-turbo/pro/image-to-video",
    label: "Kling 2.5 Turbo Pro (Image)",
    description: "Top-tier image-to-video generation with cinematic visuals",
    cost: "$0.35/5sec",
    popularity: 5,
    category: "video",
    inputAsset: ["image"],
    availableDurations: [5, 10],
    defaultDuration: 5,
    minGuidanceScale: 0,
    maxGuidanceScale: 1,
    defaultGuidanceScale: 0.5,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/kling-video/v2.1/master/image-to-video",
    label: "Kling 2.1 Master",
    description:
      "Master-level Kling 2.1 image-to-video generation with cinematic motion",
    cost: "$0.28/5sec",
    popularity: 4,
    category: "video",
    inputAsset: ["image"],
    initialInput: {
      prompt: "",
      image_url: "",
    },
    availableDurations: [5, 10],
    defaultDuration: 5,
    minGuidanceScale: 0,
    maxGuidanceScale: 1,
    defaultGuidanceScale: 0.5,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/luma-dream-machine",
    label: "Luma Dream Machine",
    description: "High quality video generation with Ray2 and Flash modes",
    cost: "$0.5/video",
    popularity: 5,
    category: "video",
    inputAsset: ["image"],
    availableDimensions: [
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 768,
        label: "1024x768 (4:3)",
      },
      {
        width: 768,
        height: 1024,
        label: "768x1024 (3:4)",
      },
      {
        width: 1344,
        height: 576,
        label: "1344x576 (21:9)",
      },
      {
        width: 576,
        height: 1344,
        label: "576x1344 (9:21)",
      },
    ],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/pika/v2.2/text-to-video",
    label: "Pika 2.2 (Text)",
    description: "Advanced text-to-video with camera control",
    cost: "$0.20/5sec",
    popularity: 4,
    category: "video",
    defaultDuration: 5,
    availableDimensions: [
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
    ],
    hasSeed: true,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/pika/v2.2/image-to-video",
    label: "Pika 2.2 (Image)",
    description: "Image-to-video with advanced motion control",
    cost: "$0.20/5sec",
    popularity: 4,
    category: "video",
    inputAsset: ["image"],
    defaultDuration: 5,
    hasSeed: true,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/veo2",
    label: "Veo 2",
    description:
      "Veo creates videos with realistic motion and high quality output, up to 4K",
    cost: "$0.50/sec",
    popularity: 4,
    category: "video",
    inputAsset: ["image"],
    availableDurations: [5, 6, 7, 8],
    defaultDuration: 5,
    availableDimensions: [
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
    ],
    hasSeed: true,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/veo2/image-to-video",
    label: "Veo 2 Image-to-Video",
    description:
      "Veo 2 dedicated image-to-video endpoint with enhanced quality",
    cost: "$0.50/sec",
    popularity: 4,
    category: "video",
    inputAsset: ["image"],
    availableDurations: [5, 6, 7, 8],
    defaultDuration: 5,
    availableDimensions: [
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
    ],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/sora-2/text-to-video",
    label: "Sora 2 (Text)",
    description: "OpenAI's Sora 2 text-to-video generation",
    cost: "TBA",
    popularity: 4,
    category: "video",
    availableDurations: [4, 8, 12],
    defaultDuration: 4,
    availableDimensions: [
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
    ],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/sora-2/text-to-video/pro",
    label: "Sora 2 Pro (Text)",
    description: "OpenAI's Sora 2 Pro with enhanced quality and resolution",
    cost: "TBA",
    popularity: 5,
    category: "video",
    availableDurations: [4, 8, 12],
    defaultDuration: 4,
    availableDimensions: [
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
    ],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/sora-2/image-to-video",
    label: "Sora 2 (Image)",
    description: "OpenAI's Sora 2 image-to-video generation",
    cost: "TBA",
    popularity: 4,
    category: "video",
    inputAsset: ["image"],
    availableDurations: [4, 8, 12],
    defaultDuration: 4,
    availableDimensions: [
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
    ],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/sora-2/image-to-video/pro",
    label: "Sora 2 Pro (Image)",
    description: "OpenAI's Sora 2 Pro image-to-video with enhanced quality",
    cost: "TBA",
    popularity: 5,
    category: "video",
    inputAsset: ["image"],
    availableDurations: [4, 8, 12],
    defaultDuration: 4,
    availableDimensions: [
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
    ],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/ovi",
    label: "OVI (Text)",
    description: "OVI text-to-video generation with audio support",
    cost: "TBA",
    popularity: 4,
    category: "video",
    minSteps: 1,
    maxSteps: 50,
    defaultSteps: 30,
    hasSeed: true,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/ovi/image-to-video",
    label: "OVI (Image)",
    description: "OVI image-to-video generation with audio support",
    cost: "TBA",
    popularity: 4,
    category: "video",
    inputAsset: ["image"],
    minSteps: 1,
    maxSteps: 50,
    defaultSteps: 30,
    hasSeed: true,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/kling-video/v1.5/pro/text-to-video",
    label: "Kling 1.5 Pro",
    description: "High quality video generation",
    cost: "$0.1/sec",
    popularity: 4,
    category: "video",
    inputAsset: ["image"],
    availableDurations: [5, 10],
    defaultDuration: 5,
    availableDimensions: [
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
    ],
    minGuidanceScale: 0,
    maxGuidanceScale: 1,
    defaultGuidanceScale: 0.5,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/kling-video/v1.6/pro/image-to-video",
    label: "Kling 1.6 Pro",
    description: "Kling 1.6 Pro image-to-video with enhanced motion quality",
    cost: "~$0.06/sec",
    popularity: 4,
    category: "video",
    inputAsset: ["image"],
    availableDurations: [5, 10],
    defaultDuration: 5,
    availableDimensions: [
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
    ],
    minGuidanceScale: 0,
    maxGuidanceScale: 1,
    defaultGuidanceScale: 0.5,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/minimax/hailuo-02/standard/text-to-video",
    label: "MiniMax Hailuo-02 (Text)",
    description: "Standard quality text-to-video generation",
    cost: "~$0.045/sec",
    popularity: 4,
    category: "video",
    availableDurations: [6, 10],
    defaultDuration: 6,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/minimax/hailuo-02/standard/image-to-video",
    label: "MiniMax Hailuo-02 (Image)",
    description: "Image-to-video generation with motion control",
    cost: "~$0.045/sec",
    popularity: 4,
    category: "video",
    inputAsset: ["image"],
    availableDurations: [6, 10],
    defaultDuration: 6,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/hunyuan-video",
    label: "Hunyuan Video",
    description: "Open-source video foundation model with superior quality",
    cost: "$0.4/video",
    popularity: 4,
    category: "video",
    inputAsset: ["image"],
    initialInput: {
      flow_shift: 7,
      embedded_guidance_scale: 6,
    },
    availableDimensions: [
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
    ],
    minSteps: 2,
    maxSteps: 30,
    defaultSteps: 30,
    hasSeed: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/minimax/video-01-live",
    label: "Minimax Video 01 Live",
    description: "Live-style video generation",
    cost: "~$0.5/video",
    popularity: 3,
    category: "video",
    inputAsset: ["image"],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/minimax/video-01/image-to-video",
    label: "MiniMax Video 01",
    description: "MiniMax Video 01 image-to-video generation",
    cost: "~$0.5/video",
    popularity: 4,
    category: "video",
    inputAsset: ["image"],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/sync-lipsync",
    label: "sync.so lipsync",
    description: "Lip sync video with audio",
    cost: "~$0.7/min",
    popularity: 3,
    category: "video",
    inputAsset: ["video", "audio"],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/topaz/upscale/video",
    label: "Topaz Video Upscale",
    description: "Professional video upscaling",
    cost: "~$0.1/sec",
    popularity: 3,
    category: "video",
    prompt: false,
    inputAsset: ["video"],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/wan-25-preview/text-to-video",
    label: "Wan 2.5 (Text)",
    description: "Wan 2.5 text-to-video model",
    cost: "TBA",
    popularity: 3,
    category: "video",
    availableDurations: [5, 10],
    defaultDuration: 5,
    availableDimensions: [
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
    ],
    hasSeed: true,
    hasNegativePrompt: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/wan-25-preview/image-to-video",
    label: "Wan 2.5 (Image)",
    description: "Wan 2.5 image-to-video model",
    cost: "TBA",
    popularity: 3,
    category: "video",
    inputAsset: ["image"],
    availableDurations: [5, 10],
    defaultDuration: 5,
    hasSeed: true,
    hasNegativePrompt: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/wan-pro/image-to-video",
    label: "Wan 2.1 Pro",
    description: "Wan 2.1 Pro image-to-video generation with enhanced quality",
    cost: "TBA",
    popularity: 4,
    category: "video",
    inputAsset: ["image"],
    hasSeed: true,
    hasSafetyChecker: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/ltx-video-v095/multiconditioning",
    label: "LTX Video v0.95",
    description: "Multi-conditional video generation",
    cost: "$0.04/video",
    popularity: 2,
    category: "video",
    imageForFrame: true,
    inputAsset: ["image"],
    availableDimensions: [
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
    ],
    minSteps: 2,
    maxSteps: 50,
    defaultSteps: 40,
    hasSeed: true,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/bytedance/omnihuman/v1.5",
    label: "OmniHuman v1.5",
    description: "Human animation from video driving",
    cost: "TBA",
    popularity: 2,
    category: "video",
    inputAsset: ["image", "audio"],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/kling-video/v1/standard/text-to-video",
    label: "Kling 1.0 Standard",
    description: "Standard quality video generation",
    cost: "~$0.045/sec",
    popularity: 2,
    category: "video",
    cameraControl: true,
    availableDurations: [5, 10],
    defaultDuration: 5,
    availableDimensions: [
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
    ],
    minGuidanceScale: 0,
    maxGuidanceScale: 1,
    defaultGuidanceScale: 0.5,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/pixverse/v5/image-to-video",
    label: "PixVerse v5",
    description:
      "Generate high quality video clips from text and image prompts",
    cost: "TBA",
    popularity: 2,
    category: "video",
    inputAsset: ["image"],
    availableDurations: [5, 8],
    defaultDuration: 5,
    availableDimensions: [
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 1024,
        height: 768,
        label: "1024x768 (4:3)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
      {
        width: 768,
        height: 1024,
        label: "768x1024 (3:4)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
    ],
    hasSeed: true,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/mmaudio-v2",
    label: "MMAudio V2",
    description: "Audio generation for video",
    cost: "$0.001/sec",
    popularity: 2,
    category: "video",
    inputAsset: ["video"],
    defaultDuration: 8,
    hasSeed: true,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/decart/lucy-5b/image-to-video",
    label: "Lucy-5B",
    description: "5-second I2V videos in under 5 seconds",
    cost: "TBA",
    popularity: 1,
    category: "video",
    inputAsset: ["image"],
    availableDimensions: [
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
    ],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/lynx",
    label: "Lynx",
    description: "Generate subject consistent videos from ByteDance",
    cost: "TBA",
    popularity: 1,
    category: "video",
    inputAsset: ["image"],
    availableDimensions: [
      {
        width: 1024,
        height: 576,
        label: "1024x576 (16:9)",
      },
      {
        width: 576,
        height: 1024,
        label: "576x1024 (9:16)",
      },
      {
        width: 1024,
        height: 1024,
        label: "1024x1024 (1:1)",
      },
    ],
    minSteps: 1,
    maxSteps: 75,
    defaultSteps: 50,
    minGuidanceScale: 1,
    maxGuidanceScale: 20,
    defaultGuidanceScale: 5,
    minStrength: 0,
    maxStrength: 2,
    defaultStrength: 1,
    hasSeed: true,
    hasNegativePrompt: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/infinitalk/video-to-video",
    label: "Infinitalk",
    description: "Generates talking avatar video from image and audio",
    cost: "TBA",
    popularity: 1,
    category: "video",
    inputAsset: ["image", "audio"],
    hasSeed: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/stable-audio",
    label: "Stable Audio",
    description: "Generate high-quality audio from text prompts",
    cost: "~$0.005/10sec",
    popularity: 4,
    category: "music",
    initialInput: {
      seconds_total: 30,
    },
    minSteps: 1,
    maxSteps: 1000,
    defaultSteps: 100,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/minimax-music",
    label: "Minimax Music",
    description: "Music generation with mood control",
    cost: "TBA",
    popularity: 4,
    category: "music",
    inputAsset: [
      {
        type: "audio",
        key: "reference_audio_url",
      },
    ],
  },
  {
    provider: "fal",
    endpointId: "mirelo-ai/sfx-v1/video-to-audio",
    label: "Mirelo SFX v1",
    description: "Generate synced sound effects for any video",
    cost: "TBA",
    popularity: 3,
    category: "music",
    inputAsset: ["video"],
    defaultDuration: 10,
    hasSeed: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/minimax/speech-02-hd",
    label: "MiniMax Speech-02 HD",
    description: "High-definition text-to-speech",
    cost: "$0.05/1000 chars",
    popularity: 4,
    category: "voiceover",
    inputMap: {
      prompt: "text",
    },
  },
  {
    provider: "fal",
    endpointId: "fal-ai/playht/tts/v3",
    label: "PlayHT TTS v3",
    description: "High-quality voice synthesis",
    cost: "TBA",
    popularity: 4,
    category: "voiceover",
    inputMap: {
      prompt: "input",
    },
    initialInput: {
      voice: "Dexter (English (US)/American)",
    },
  },
  {
    provider: "fal",
    endpointId: "fal-ai/dia-tts/voice-clone",
    label: "Dia TTS Voice Clone",
    description: "Voice cloning from sample",
    cost: "$0.04/1000 chars",
    popularity: 3,
    category: "voiceover",
    inputMap: {
      prompt: "text",
    },
    inputAsset: ["audio"],
  },
  {
    provider: "fal",
    endpointId: "fal-ai/playai/tts/dialog",
    label: "PlayAI Text-to-Speech Dialog",
    description: "Generate natural-sounding multi-speaker dialogues",
    cost: "TBA",
    popularity: 3,
    category: "voiceover",
    inputMap: {
      prompt: "input",
    },
    initialInput: {
      voices: [
        {
          voice: "Jennifer (English (US)/American)",
          turn_prefix: "Speaker 1: ",
        },
        {
          voice: "Furio (English (IT)/Italian)",
          turn_prefix: "Speaker 2: ",
        },
      ],
    },
    hasSeed: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/chatterbox/text-to-speech",
    label: "Chatterbox TTS",
    description: "Text-to-speech with preset voices",
    cost: "TBA",
    popularity: 2,
    category: "voiceover",
    inputMap: {
      prompt: "text",
    },
    hasSeed: true,
  },
  {
    provider: "fal",
    endpointId: "fal-ai/f5-tts",
    label: "F5 TTS",
    description: "Multilingual text-to-speech",
    cost: "TBA",
    popularity: 2,
    category: "voiceover",
    inputMap: {
      prompt: "gen_text",
    },
    initialInput: {
      ref_audio_url:
        "https://github.com/SWivid/F5-TTS/raw/21900ba97d5020a5a70bcc9a0575dc7dec5021cb/tests/ref_audio/test_en_1_ref_short.wav",
      ref_text: "Some call me nature, others call me mother nature.",
      model_type: "F5-TTS",
      remove_silence: true,
    },
  },
];

/**
 * Get enhanced API info with pricing data from schema
 */
export function getEnhancedApiInfo(endpointId: string): ApiInfo | undefined {
  const endpoint = AVAILABLE_ENDPOINTS.find((e) => e.endpointId === endpointId);
  if (!endpoint) return undefined;

  // Get pricing data from schema
  const schema = getModelSchema(endpointId);
  if (schema?.pricing) {
    return {
      ...endpoint,
      pricing: schema.pricing,
    };
  }

  return endpoint;
}

/**
 * Get all endpoints enhanced with pricing data
 */
export function getEnhancedEndpoints(): ApiInfo[] {
  return AVAILABLE_ENDPOINTS.map((endpoint) => {
    const schema = getModelSchema(endpoint.endpointId);
    if (schema?.pricing) {
      return {
        ...endpoint,
        pricing: schema.pricing,
      };
    }
    return endpoint;
  });
}

/**
 * Calculate cost for a model generation
 * Re-export from pricing module for convenience
 */
export { calculateModelCost, formatCost, getPricingInfo };

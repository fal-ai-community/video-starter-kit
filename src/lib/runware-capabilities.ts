export type ModelCapabilities = {
  prompt: "required" | "optional" | "not_supported";
  negativePrompt: boolean;
  seed: boolean;
  seedImage: boolean;
  maskImage: boolean;
  outpainting: boolean;
  steps: { supported: boolean; min?: number; max?: number; default?: number };
  cfgScale: {
    supported: boolean;
    min?: number;
    max?: number;
    default?: number;
  };
  scheduler: boolean;
  clipSkip: boolean;
  checkNSFW: boolean;
  numberResults: boolean;
  outputQuality: boolean;
  outputFormats: Array<"JPG" | "JPEG" | "PNG" | "WEBP">;
  outputType: boolean;
  dimensionRule: "multiples_of_64" | "fixed_set";
  availableDimensions?: Array<{ width: number; height: number; label: string }>;
  imageInputParam?:
    | "seedImage"
    | "referenceImages"
    | "inputs.image"
    | "inputs.references"
    | "seedImage+referenceImages";
  maxPixels?: number;
  supportsDimensions?: boolean;
};

const DEFAULT_CAPABILITIES: ModelCapabilities = {
  prompt: "required",
  negativePrompt: true,
  seed: true,
  seedImage: true,
  maskImage: true,
  outpainting: false,
  steps: { supported: true, min: 1, max: 50, default: 20 },
  cfgScale: { supported: true, min: 1, max: 20, default: 3.5 },
  scheduler: true,
  clipSkip: true,
  checkNSFW: false, // Default to false - only enable for specific families that support it
  numberResults: true,
  outputQuality: true,
  outputFormats: ["JPG", "PNG", "WEBP"],
  outputType: true,
  dimensionRule: "multiples_of_64",
};

export const FAMILY_CAPABILITIES: Record<string, ModelCapabilities> = {
  google: {
    prompt: "required",
    negativePrompt: true,
    seed: true,
    seedImage: true,
    maskImage: false,
    outpainting: false,
    steps: { supported: false },
    cfgScale: { supported: false },
    scheduler: false,
    clipSkip: false,
    checkNSFW: false,
    numberResults: true,
    outputQuality: true,
    outputFormats: ["PNG", "JPEG", "WEBP"],
    outputType: true,
    dimensionRule: "multiples_of_64",
    imageInputParam: "referenceImages", // Google uses referenceImages
  },

  ideogram: {
    prompt: "required",
    negativePrompt: false,
    seed: true,
    seedImage: true,
    maskImage: true,
    outpainting: false,
    steps: { supported: false },
    cfgScale: { supported: false },
    scheduler: false,
    clipSkip: false,
    checkNSFW: false,
    numberResults: true,
    outputQuality: false,
    outputFormats: ["PNG", "JPEG", "WEBP"],
    outputType: true,
    dimensionRule: "fixed_set",
    availableDimensions: [
      { width: 1024, height: 1024, label: "1:1 (Square)" },
      { width: 1248, height: 832, label: "3:2 (Classic Landscape)" },
      { width: 832, height: 1248, label: "2:3 (Classic Portrait)" },
    ],
    imageInputParam: "seedImage+referenceImages",
    supportsDimensions: false,
  },

  openai: {
    prompt: "required",
    negativePrompt: false,
    seed: false,
    seedImage: true,
    maskImage: true,
    outpainting: false,
    steps: { supported: false },
    cfgScale: { supported: false },
    scheduler: false,
    clipSkip: false,
    checkNSFW: false,
    numberResults: true,
    outputQuality: false,
    outputFormats: ["PNG", "JPEG", "WEBP"],
    outputType: true,
    dimensionRule: "fixed_set",
    availableDimensions: [
      { width: 1024, height: 1024, label: "1:1 (Square)" },
      { width: 1536, height: 1024, label: "3:2 (Landscape)" },
      { width: 1024, height: 1536, label: "2:3 (Portrait)" },
    ],
  },

  flux: {
    ...DEFAULT_CAPABILITIES,
    steps: { supported: true, min: 1, max: 50, default: 20 },
    cfgScale: { supported: true, min: 1, max: 20, default: 3.5 },
    checkNSFW: false, // FLUX models do not support checkNSFW
    imageInputParam: "referenceImages",
  },

  "flux-pro": {
    prompt: "required",
    negativePrompt: true,
    seed: true,
    seedImage: true, // BFL FLUX Kontext supports reference-to-image via referenceImages
    maskImage: false,
    outpainting: false,
    steps: { supported: false },
    cfgScale: { supported: false },
    scheduler: false,
    clipSkip: false,
    checkNSFW: false,
    numberResults: true,
    outputQuality: false,
    outputFormats: ["PNG", "WEBP", "JPG"],
    outputType: true,
    dimensionRule: "multiples_of_64",
    imageInputParam: "referenceImages", // BFL uses referenceImages for reference-to-image
  },

  "qwen-image": {
    ...DEFAULT_CAPABILITIES,
    steps: { supported: true, min: 1, max: 100, default: 20 },
    cfgScale: { supported: true, min: 0, max: 50, default: 2.5 },
    checkNSFW: true, // Qwen supports checkNSFW (verified in working examples)
    dimensionRule: "multiples_of_64",
    imageInputParam: "referenceImages",
    maxPixels: 1048576,
  },

  sdxl: {
    ...DEFAULT_CAPABILITIES,
    steps: { supported: true, min: 1, max: 50, default: 20 },
    cfgScale: { supported: true, min: 0, max: 50, default: 7.5 },
  },

  bytedance: {
    prompt: "required",
    negativePrompt: true,
    seed: true,
    seedImage: true,
    maskImage: true,
    outpainting: false,
    steps: { supported: false },
    cfgScale: { supported: false },
    scheduler: false,
    clipSkip: false,
    checkNSFW: false, // Bytedance does not support checkNSFW
    numberResults: true,
    outputQuality: true,
    outputFormats: ["PNG", "JPEG", "WEBP"],
    outputType: true,
    dimensionRule: "multiples_of_64",
    imageInputParam: "referenceImages",
  },

  klingai: {
    ...DEFAULT_CAPABILITIES,
    steps: { supported: true, min: 1, max: 50, default: 20 },
    cfgScale: { supported: true, min: 1, max: 20, default: 7 },
  },

  bria: {
    prompt: "required",
    negativePrompt: false,
    seed: false,
    seedImage: true,
    maskImage: false,
    outpainting: false,
    steps: { supported: true, min: 1, max: 50, default: 50 },
    cfgScale: { supported: true, min: 1, max: 20, default: 5 },
    scheduler: false,
    clipSkip: false,
    checkNSFW: false,
    numberResults: true,
    outputQuality: false,
    outputFormats: ["PNG", "JPEG", "WEBP"],
    outputType: false,
    dimensionRule: "multiples_of_64",
    imageInputParam: "inputs.image",
    maxPixels: 1048576,
  },

  sourceful: {
    prompt: "required",
    negativePrompt: false,
    seed: false,
    seedImage: true,
    maskImage: false,
    outpainting: false,
    steps: { supported: false },
    cfgScale: { supported: false },
    scheduler: false,
    clipSkip: false,
    checkNSFW: false,
    numberResults: true,
    outputQuality: false,
    outputFormats: ["PNG", "JPEG", "WEBP"],
    outputType: false,
    dimensionRule: "multiples_of_64",
    imageInputParam: "inputs.references", // Sourceful uses inputs.references
  },

  vidu: {
    ...DEFAULT_CAPABILITIES,
    steps: { supported: true, min: 1, max: 50, default: 20 },
    cfgScale: { supported: true, min: 1, max: 20, default: 7 },
  },
};

export function getEndpointFamily(endpointId: string): string {
  const prefix = endpointId.split(":")[0];

  if (prefix === "runware") {
    const modelNumber = endpointId.split(":")[1]?.split("@")[0];

    if (modelNumber === "108") {
      return "qwen-image";
    }

    if (
      modelNumber === "106" ||
      modelNumber === "107" ||
      modelNumber === "111"
    ) {
      return "flux";
    }

    return "sdxl";
  }

  const familyMap: Record<string, string> = {
    google: "google",
    ideogram: "ideogram",
    openai: "openai",
    bfl: "flux-pro",
    bytedance: "bytedance",
    klingai: "klingai",
    bria: "bria",
    sourceful: "sourceful",
    vidu: "vidu",
    rundiffusion: "sdxl",
    civitai: "sdxl",
  };

  return familyMap[prefix] || "sdxl"; // Default to SDXL-like capabilities
}

export function getModelCapabilities(endpointId: string): ModelCapabilities {
  const family = getEndpointFamily(endpointId);
  return FAMILY_CAPABILITIES[family] || DEFAULT_CAPABILITIES;
}

export function buildRunwarePayload(
  endpointId: string,
  input: Record<string, unknown>,
  mediaType: "image" | "video",
  endpointInfo?: {
    defaultSteps?: number;
    defaultScheduler?: string;
    defaultAcceleration?: string;
    defaultGuidanceScale?: number;
    availableDimensions?: Array<{
      width: number;
      height: number;
      label: string;
    }>;
    supportedAspectRatios?: Array<{
      width: number;
      height: number;
      label: string;
    }>;
  },
): Record<string, unknown> {
  const capabilities = getModelCapabilities(endpointId);

  if (capabilities.prompt === "required") {
    const prompt = input.prompt as string;
    if (!prompt || prompt.trim() === "") {
      throw new Error("Prompt is required for this model");
    }
  }

  const roundToMultipleOf64 = (value: number): number => {
    return Math.round(value / 64) * 64;
  };

  let width = (input.width as number) || 1024;
  let height = (input.height as number) || 1024;

  const shouldIncludeDimensions = capabilities.supportsDimensions !== false;

  if (shouldIncludeDimensions) {
    if (
      endpointInfo?.availableDimensions &&
      endpointInfo.availableDimensions.length > 0
    ) {
      const requestedRatio = width / height;
      let closestMatch = endpointInfo.availableDimensions[0];
      let smallestDiff = Math.abs(
        closestMatch.width / closestMatch.height - requestedRatio,
      );

      for (const dim of endpointInfo.availableDimensions) {
        const diff = Math.abs(dim.width / dim.height - requestedRatio);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          closestMatch = dim;
        }
      }

      width = closestMatch.width;
      height = closestMatch.height;
    } else if (
      endpointInfo?.supportedAspectRatios &&
      endpointInfo.supportedAspectRatios.length > 0
    ) {
      const requestedRatio = width / height;
      let closestRatio = endpointInfo.supportedAspectRatios[0];
      let smallestDiff = Math.abs(
        closestRatio.width / closestRatio.height - requestedRatio,
      );

      for (const ratio of endpointInfo.supportedAspectRatios) {
        const diff = Math.abs(ratio.width / ratio.height - requestedRatio);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          closestRatio = ratio;
        }
      }

      const targetRatio = closestRatio.width / closestRatio.height;

      if (width >= height) {
        height = Math.round(width / targetRatio);
      } else {
        width = Math.round(height * targetRatio);
      }

      width = roundToMultipleOf64(width);
      height = roundToMultipleOf64(height);
    }
    // Priority 3: Use family-level capabilities
    else if (capabilities.dimensionRule === "multiples_of_64") {
      width = roundToMultipleOf64(width);
      height = roundToMultipleOf64(height);

      if (capabilities.maxPixels && width * height > capabilities.maxPixels) {
        const scale = Math.sqrt(capabilities.maxPixels / (width * height));
        width = Math.floor((width * scale) / 64) * 64;
        height = Math.floor((height * scale) / 64) * 64;
      }
    } else if (
      capabilities.dimensionRule === "fixed_set" &&
      capabilities.availableDimensions
    ) {
      const requestedRatio = width / height;
      let closestMatch = capabilities.availableDimensions[0];
      let smallestDiff = Math.abs(
        closestMatch.width / closestMatch.height - requestedRatio,
      );

      for (const dim of capabilities.availableDimensions) {
        const diff = Math.abs(dim.width / dim.height - requestedRatio);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          closestMatch = dim;
        }
      }

      width = closestMatch.width;
      height = closestMatch.height;
    }

    if (capabilities.maxPixels && width * height > capabilities.maxPixels) {
      const scale = Math.sqrt(capabilities.maxPixels / (width * height));
      width = Math.floor((width * scale) / 64) * 64;
      height = Math.floor((height * scale) / 64) * 64;

      if (width * height > capabilities.maxPixels) {
        throw new Error(
          `Image dimensions ${width}x${height} (${width * height} pixels) exceed the maximum allowed ${capabilities.maxPixels} pixels for this model even after downscaling. Please reduce the image size.`,
        );
      }
    }
  }

  const hasInputImage =
    input.image || input.image_url || input.seedImage || input.inputImage;
  let outputFormat = (input.outputFormat ||
    (hasInputImage ? "JPEG" : "PNG")) as string;
  if (outputFormat === "JPG") {
    outputFormat = "JPEG";
  }
  if (
    capabilities.outputFormats &&
    !capabilities.outputFormats.includes(
      outputFormat as "JPG" | "JPEG" | "PNG" | "WEBP",
    )
  ) {
    outputFormat = hasInputImage ? "JPEG" : "PNG";
  }

  const outputType = input.outputType ?? ["URL"];
  const payload: Record<string, unknown> = {
    positivePrompt: input.prompt || "",
    model: endpointId,
    numberResults: capabilities.numberResults ? input.numberResults || 1 : 1,
    outputType: Array.isArray(outputType) ? outputType : [outputType],
    outputFormat: outputFormat as "PNG" | "JPEG" | "WEBP",
    includeCost: input.includeCost !== undefined ? input.includeCost : true,
  };

  if (shouldIncludeDimensions && capabilities.supportsDimensions !== false) {
    payload.height = height;
    payload.width = width;
  }

  if (capabilities.negativePrompt && input.negativePrompt) {
    payload.negativePrompt = input.negativePrompt;
  }

  if (capabilities.seed && input.seed !== undefined) {
    payload.seed = input.seed;
  }

  if (capabilities.checkNSFW) {
    payload.checkNSFW = input.checkNSFW !== undefined ? input.checkNSFW : true;
  }

  if (capabilities.cfgScale.supported) {
    payload.CFGScale =
      input.CFGScale ||
      endpointInfo?.defaultGuidanceScale ||
      capabilities.cfgScale.default ||
      3.5;
  }

  // outputQuality defaults to 85 for img2img models
  if (capabilities.outputQuality) {
    payload.outputQuality = input.outputQuality ?? 85;
  }

  // Only add steps if explicitly provided OR if endpoint has defaultSteps configured
  if (capabilities.steps.supported) {
    if (input.steps !== undefined) {
      payload.steps = input.steps;
    } else if (endpointInfo?.defaultSteps !== undefined) {
      payload.steps = endpointInfo.defaultSteps;
    }
  }

  // Only add scheduler if explicitly provided OR if endpoint has defaultScheduler configured
  if (capabilities.scheduler) {
    if (input.scheduler) {
      payload.scheduler = input.scheduler;
    } else if (endpointInfo?.defaultScheduler) {
      payload.scheduler = endpointInfo.defaultScheduler;
    }
  }

  if (capabilities.clipSkip && input.clipSkip !== undefined) {
    payload.clipSkip = input.clipSkip;
  }

  // Only add acceleration if explicitly provided OR if endpoint has defaultAcceleration configured
  if (input.acceleration !== undefined) {
    payload.acceleration = input.acceleration;
  } else if (endpointInfo?.defaultAcceleration) {
    payload.acceleration = endpointInfo.defaultAcceleration;
  }

  if (capabilities.imageInputParam) {
    // Look for image in multiple possible input keys
    const seedImageKeys = ["seedImage", "inputImage", "image", "image_url"];

    for (const key of seedImageKeys) {
      const candidate = input[key];
      if (!candidate) continue;

      // Skip File/Blob objects - they will be uploaded in mutations.ts
      if (
        (typeof File !== "undefined" && candidate instanceof File) ||
        (typeof Blob !== "undefined" && candidate instanceof Blob)
      ) {
        continue;
      }

      // Skip invalid values (plain objects, arrays, etc)
      if (typeof candidate === "object") {
        continue;
      }

      // Only string URL/UUID/base64 should be added to payload
      if (typeof candidate === "string") {
        // Use the correct parameter name based on model capabilities
        const paramName = capabilities.imageInputParam;

        if (paramName === "referenceImages") {
          // referenceImages expects an array
          payload.referenceImages = [candidate];
        } else if (paramName === "inputs.image") {
          // Bria uses inputs.image
          payload.inputs = { image: candidate };
        } else if (paramName === "inputs.references") {
          // Sourceful uses inputs.references as array
          payload.inputs = { references: [candidate] };
        } else if (paramName === "seedImage+referenceImages") {
          // Ideogram img2img uses BOTH seedImage and referenceImages
          payload.seedImage = candidate;
          payload.referenceImages = [candidate];
        } else if (paramName === "seedImage") {
          // Only send seedImage if explicitly configured
          payload.seedImage = candidate;
        }
        break;
      }
    }
  }

  if (capabilities.maskImage && input.maskImage) {
    const maskImageValue = input.maskImage;

    // Skip File/Blob objects - they will be uploaded in mutations.ts
    const isFileOrBlob =
      (typeof File !== "undefined" && maskImageValue instanceof File) ||
      (typeof Blob !== "undefined" && maskImageValue instanceof Blob);

    // Only include string URL/UUID/base64 (not File/Blob)
    if (!isFileOrBlob && typeof maskImageValue === "string") {
      payload.maskImage = input.maskImage;
    }
  }

  return payload;
}

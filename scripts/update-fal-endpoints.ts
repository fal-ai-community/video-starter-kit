/**
 * Script to update AVAILABLE_ENDPOINTS with real options from fal_models_schemas.json
 */

import fs from "node:fs";
import path from "node:path";
import falModelsData from "../data/fal_models_schemas.json";

interface ModelSchema {
  id: string;
  pricing: any;
  inputParameters?: Record<string, any>;
  input?: {
    properties?: Record<string, any>;
  };
}

interface EndpointOptions {
  // Duration
  availableDurations?: number[];
  defaultDuration?: number;

  // Dimensions
  availableDimensions?: Array<{ width: number; height: number; label: string }>;
  defaultWidth?: number;
  defaultHeight?: number;

  // FPS
  availableFps?: number[];
  defaultFps?: number;

  // Steps
  availableSteps?: number[];
  minSteps?: number;
  maxSteps?: number;
  defaultSteps?: number;

  // Guidance/CFG Scale
  minGuidanceScale?: number;
  maxGuidanceScale?: number;
  defaultGuidanceScale?: number;

  // Strength (for image-to-image)
  minStrength?: number;
  maxStrength?: number;
  defaultStrength?: number;

  // Seed
  hasSeed?: boolean;

  // Negative prompt
  hasNegativePrompt?: boolean;

  // Safety checker
  hasSafetyChecker?: boolean;

  // Other parameters
  otherParams?: string[];
}

function extractEndpointOptions(modelId: string): EndpointOptions | null {
  const schema = (falModelsData as ModelSchema[]).find((m) => m.id === modelId);
  if (!schema) return null;

  const options: EndpointOptions = {};
  // Support both formats: inputParameters (new) and input.properties (old)
  const params = schema.inputParameters || schema.input?.properties;
  if (!params) return null;

  // Extract duration options
  if (params.duration) {
    if (params.duration.enum) {
      // Parse duration strings like "4s", "5", "10" to numbers
      options.availableDurations = params.duration.enum.map(
        (d: string | number) => {
          if (typeof d === "number") return d;
          return Number.parseInt(String(d).replace(/[^0-9]/g, ""), 10);
        },
      );
    }

    if (params.duration.default) {
      const defaultDur = params.duration.default;
      if (typeof defaultDur === "number") {
        options.defaultDuration = defaultDur;
      } else {
        options.defaultDuration = Number.parseInt(
          String(defaultDur).replace(/[^0-9]/g, ""),
          10,
        );
      }
    }
  }

  // Extract num_frames (convert to duration if fps is known)
  if (params.num_frames && params.fps) {
    const fps = params.fps.default || params.fps.enum?.[0] || 24;
    if (params.num_frames.enum) {
      options.availableDurations = params.num_frames.enum.map(
        (frames: number) => Math.round((frames / fps) * 10) / 10,
      );
    }
  }

  // Extract FPS options
  if (params.fps) {
    if (params.fps.enum) {
      options.availableFps = params.fps.enum;
    }
    if (params.fps.default !== undefined) {
      options.defaultFps = params.fps.default;
    }
  }

  // Extract dimension options from image_size
  if (params.image_size) {
    if (params.image_size.default) {
      const size = params.image_size.default;
      if (size.width && size.height) {
        options.defaultWidth = size.width;
        options.defaultHeight = size.height;
      }
    }
  }

  // Extract width/height
  if (params.width) {
    if (params.width.default !== undefined) {
      options.defaultWidth = params.width.default;
    }
  }
  if (params.height) {
    if (params.height.default !== undefined) {
      options.defaultHeight = params.height.default;
    }
  }

  // Extract aspect ratio and convert to dimensions if needed
  if (params.aspect_ratio?.enum) {
    const aspectRatios = params.aspect_ratio.enum;
    const dimensions: Array<{ width: number; height: number; label: string }> =
      [];

    const aspectRatioMap: Record<string, { width: number; height: number }> = {
      "16:9": { width: 1024, height: 576 },
      "9:16": { width: 576, height: 1024 },
      "1:1": { width: 1024, height: 1024 },
      "4:3": { width: 1024, height: 768 },
      "3:4": { width: 768, height: 1024 },
      "21:9": { width: 1024, height: 438 },
      "9:21": { width: 438, height: 1024 },
    };

    for (const ratio of aspectRatios) {
      if (ratio !== "auto" && aspectRatioMap[ratio]) {
        const dim = aspectRatioMap[ratio];
        dimensions.push({
          width: dim.width,
          height: dim.height,
          label: `${dim.width}x${dim.height} (${ratio})`,
        });
      }
    }

    if (dimensions.length > 0) {
      options.availableDimensions = dimensions;
    }
  }

  // Extract steps/num_inference_steps
  const stepsParam = params.num_inference_steps || params.steps;
  if (stepsParam) {
    if (stepsParam.minimum !== undefined) options.minSteps = stepsParam.minimum;
    if (stepsParam.maximum !== undefined) options.maxSteps = stepsParam.maximum;
    if (stepsParam.default !== undefined)
      options.defaultSteps = stepsParam.default;
    if (stepsParam.enum) options.availableSteps = stepsParam.enum;
  }

  // Extract guidance_scale / cfg_scale
  const guidanceParam =
    params.guidance_scale || params.cfg_scale || params.CFGScale;
  if (guidanceParam) {
    if (guidanceParam.minimum !== undefined)
      options.minGuidanceScale = guidanceParam.minimum;
    if (guidanceParam.maximum !== undefined)
      options.maxGuidanceScale = guidanceParam.maximum;
    if (guidanceParam.default !== undefined)
      options.defaultGuidanceScale = guidanceParam.default;
  }

  // Extract strength (for image-to-image)
  if (params.strength) {
    if (params.strength.minimum !== undefined)
      options.minStrength = params.strength.minimum;
    if (params.strength.maximum !== undefined)
      options.maxStrength = params.strength.maximum;
    if (params.strength.default !== undefined)
      options.defaultStrength = params.strength.default;
  }

  // Check for seed
  if (params.seed !== undefined) {
    options.hasSeed = true;
  }

  // Check for negative prompt
  if (params.negative_prompt !== undefined) {
    options.hasNegativePrompt = true;
  }

  // Check for safety checker
  if (
    params.enable_safety_checker !== undefined ||
    params.safety_checker !== undefined
  ) {
    options.hasSafetyChecker = true;
  }

  // Collect other important params
  const importantParams = [
    "num_images",
    "batch_size",
    "sync_mode",
    "enable_safety_checks",
    "output_format",
    "loras",
    "controlnet",
  ];
  const otherParams = Object.keys(params).filter((key) =>
    importantParams.includes(key),
  );
  if (otherParams.length > 0) {
    options.otherParams = otherParams;
  }

  return Object.keys(options).length > 0 ? options : null;
}

// Read the current fal.ts file
const falTsPath = path.join(__dirname, "../src/lib/fal.ts");
const falTsContent = fs.readFileSync(falTsPath, "utf-8");

// Extract all endpoint IDs from AVAILABLE_ENDPOINTS
const endpointMatches = falTsContent.matchAll(/endpointId: "([^"]+)"/g);
const endpointIds = Array.from(endpointMatches).map((match) => match[1]);

console.log(`Found ${endpointIds.length} endpoints in AVAILABLE_ENDPOINTS`);
console.log("");

// Check each endpoint and report options
const updates: Record<string, EndpointOptions> = {};
let hasUpdates = false;

for (const endpointId of endpointIds) {
  const options = extractEndpointOptions(endpointId);
  if (options) {
    updates[endpointId] = options;
    hasUpdates = true;

    console.log(`\n${endpointId}:`);

    // Duration
    if (options.availableDurations) {
      console.log(`  ✓ Durations: [${options.availableDurations.join(", ")}]s`);
    }
    if (options.defaultDuration) {
      console.log(`  ✓ Default duration: ${options.defaultDuration}s`);
    }

    // Dimensions
    if (options.availableDimensions) {
      console.log(
        `  ✓ Dimensions: ${options.availableDimensions.length} options`,
      );
      for (const dim of options.availableDimensions.slice(0, 3)) {
        console.log(`    - ${dim.label}`);
      }
      if (options.availableDimensions.length > 3) {
        console.log(
          `    ... and ${options.availableDimensions.length - 3} more`,
        );
      }
    }
    if (options.defaultWidth || options.defaultHeight) {
      console.log(
        `  ✓ Default size: ${options.defaultWidth}x${options.defaultHeight}`,
      );
    }

    // FPS
    if (options.availableFps) {
      console.log(`  ✓ FPS options: [${options.availableFps.join(", ")}]`);
    }
    if (options.defaultFps) {
      console.log(`  ✓ Default FPS: ${options.defaultFps}`);
    }

    // Steps
    if (options.availableSteps) {
      console.log(`  ✓ Steps options: [${options.availableSteps.join(", ")}]`);
    }
    if (options.minSteps !== undefined || options.maxSteps !== undefined) {
      console.log(
        `  ✓ Steps range: ${options.minSteps || "?"} - ${options.maxSteps || "?"}`,
      );
    }
    if (options.defaultSteps) {
      console.log(`  ✓ Default steps: ${options.defaultSteps}`);
    }

    // Guidance/CFG
    if (
      options.minGuidanceScale !== undefined ||
      options.maxGuidanceScale !== undefined
    ) {
      console.log(
        `  ✓ Guidance range: ${options.minGuidanceScale || "?"} - ${options.maxGuidanceScale || "?"}`,
      );
    }
    if (options.defaultGuidanceScale) {
      console.log(`  ✓ Default guidance: ${options.defaultGuidanceScale}`);
    }

    // Strength
    if (
      options.minStrength !== undefined ||
      options.maxStrength !== undefined
    ) {
      console.log(
        `  ✓ Strength range: ${options.minStrength || "?"} - ${options.maxStrength || "?"}`,
      );
    }

    // Flags
    if (options.hasSeed) console.log("  ✓ Has seed parameter");
    if (options.hasNegativePrompt) console.log("  ✓ Has negative prompt");
    if (options.hasSafetyChecker) console.log("  ✓ Has safety checker");

    // Other params
    if (options.otherParams && options.otherParams.length > 0) {
      console.log(`  ✓ Other params: ${options.otherParams.join(", ")}`);
    }
  }
}

if (hasUpdates) {
  console.log("\n\n=== Updates needed ===");
  console.log(JSON.stringify(updates, null, 2));
} else {
  console.log("\nNo updates needed - all endpoints match schema!");
}

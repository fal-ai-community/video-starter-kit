/**
 * Script to apply updates to AVAILABLE_ENDPOINTS in fal.ts
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
  availableDurations?: number[];
  defaultDuration?: number;
  availableDimensions?: Array<{ width: number; height: number; label: string }>;
  defaultWidth?: number;
  defaultHeight?: number;
  availableFps?: number[];
  defaultFps?: number;
  availableSteps?: number[];
  minSteps?: number;
  maxSteps?: number;
  defaultSteps?: number;
  minGuidanceScale?: number;
  maxGuidanceScale?: number;
  defaultGuidanceScale?: number;
  minStrength?: number;
  maxStrength?: number;
  defaultStrength?: number;
  hasSeed?: boolean;
  hasNegativePrompt?: boolean;
  hasSafetyChecker?: boolean;
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

  // Extract FPS options
  if (params.fps) {
    if (params.fps.enum) {
      options.availableFps = params.fps.enum;
    }
    if (params.fps.default !== undefined) {
      options.defaultFps = params.fps.default;
    }
  }

  // Extract width/height
  if (params.width?.default !== undefined) {
    options.defaultWidth = params.width.default;
  }
  if (params.height?.default !== undefined) {
    options.defaultHeight = params.height.default;
  }
  if (params.image_size?.default) {
    const size = params.image_size.default;
    if (size.width && size.height) {
      options.defaultWidth = size.width;
      options.defaultHeight = size.height;
    }
  }

  // Extract aspect ratio dimensions
  if (params.aspect_ratio?.enum) {
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

    for (const ratio of params.aspect_ratio.enum) {
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

  // Extract steps
  const stepsParam = params.num_inference_steps || params.steps;
  if (stepsParam) {
    if (stepsParam.minimum !== undefined) options.minSteps = stepsParam.minimum;
    if (stepsParam.maximum !== undefined) options.maxSteps = stepsParam.maximum;
    if (stepsParam.default !== undefined)
      options.defaultSteps = stepsParam.default;
    if (stepsParam.enum) options.availableSteps = stepsParam.enum;
  }

  // Extract guidance_scale
  const guidanceParam = params.guidance_scale || params.cfg_scale;
  if (guidanceParam) {
    if (guidanceParam.minimum !== undefined)
      options.minGuidanceScale = guidanceParam.minimum;
    if (guidanceParam.maximum !== undefined)
      options.maxGuidanceScale = guidanceParam.maximum;
    if (guidanceParam.default !== undefined)
      options.defaultGuidanceScale = guidanceParam.default;
  }

  return Object.keys(options).length > 0 ? options : null;
}

// Read fal.ts
const falTsPath = path.join(__dirname, "../src/lib/fal.ts");
let falTsContent = fs.readFileSync(falTsPath, "utf-8");

// Find all endpointId entries
const endpointMatches = Array.from(
  falTsContent.matchAll(/endpointId: "([^"]+)"/g),
);
console.log(`Found ${endpointMatches.length} endpoints\n`);

let updatesApplied = 0;

for (const match of endpointMatches) {
  const endpointId = match[1];
  const options = extractEndpointOptions(endpointId);

  if (!options) continue;

  // Find the endpoint object in the source
  const endpointPattern = new RegExp(
    `({[^}]*endpointId:\\s*"${endpointId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^}]*})`,
    "s",
  );

  const endpointMatch = falTsContent.match(endpointPattern);
  if (!endpointMatch) {
    console.log(`⚠️  Could not find endpoint object for ${endpointId}`);
    continue;
  }

  let endpointObj = endpointMatch[0];

  // Add new properties before the closing brace
  const propsToAdd: string[] = [];

  // Duration parameters
  if (options.availableDurations) {
    propsToAdd.push(
      `availableDurations: [${options.availableDurations.join(", ")}]`,
    );
  }
  if (options.defaultDuration) {
    propsToAdd.push(`defaultDuration: ${options.defaultDuration}`);
  }

  // Dimension parameters
  if (options.availableDimensions) {
    const dimsStr = JSON.stringify(
      options.availableDimensions,
      null,
      6,
    ).replace(/\n/g, "\n    ");
    propsToAdd.push(`availableDimensions: ${dimsStr}`);
  }
  if (options.defaultWidth) {
    propsToAdd.push(`defaultWidth: ${options.defaultWidth}`);
  }
  if (options.defaultHeight) {
    propsToAdd.push(`defaultHeight: ${options.defaultHeight}`);
  }

  // FPS parameters
  if (options.availableFps) {
    propsToAdd.push(`availableFps: [${options.availableFps.join(", ")}]`);
  }
  if (options.defaultFps) {
    propsToAdd.push(`defaultFps: ${options.defaultFps}`);
  }

  // Steps parameters
  if (options.availableSteps) {
    propsToAdd.push(`availableSteps: [${options.availableSteps.join(", ")}]`);
  }
  if (options.minSteps !== undefined) {
    propsToAdd.push(`minSteps: ${options.minSteps}`);
  }
  if (options.maxSteps !== undefined) {
    propsToAdd.push(`maxSteps: ${options.maxSteps}`);
  }
  if (options.defaultSteps !== undefined) {
    propsToAdd.push(`defaultSteps: ${options.defaultSteps}`);
  }

  // Guidance scale parameters
  if (options.minGuidanceScale !== undefined) {
    propsToAdd.push(`minGuidanceScale: ${options.minGuidanceScale}`);
  }
  if (options.maxGuidanceScale !== undefined) {
    propsToAdd.push(`maxGuidanceScale: ${options.maxGuidanceScale}`);
  }
  if (options.defaultGuidanceScale !== undefined) {
    propsToAdd.push(`defaultGuidanceScale: ${options.defaultGuidanceScale}`);
  }

  // Strength parameters
  if (options.minStrength !== undefined) {
    propsToAdd.push(`minStrength: ${options.minStrength}`);
  }
  if (options.maxStrength !== undefined) {
    propsToAdd.push(`maxStrength: ${options.maxStrength}`);
  }
  if (options.defaultStrength !== undefined) {
    propsToAdd.push(`defaultStrength: ${options.defaultStrength}`);
  }

  // Feature flags
  if (options.hasSeed) {
    propsToAdd.push("hasSeed: true");
  }
  if (options.hasNegativePrompt) {
    propsToAdd.push("hasNegativePrompt: true");
  }
  if (options.hasSafetyChecker) {
    propsToAdd.push("hasSafetyChecker: true");
  }

  if (propsToAdd.length > 0) {
    // Remove trailing comma and brace
    endpointObj = endpointObj.replace(/,?\s*}$/, "");

    // Add new properties
    const newProps = propsToAdd.map((p) => `    ${p}`).join(",\n");
    const updatedEndpoint = `${endpointObj},\n${newProps},\n  }`;

    falTsContent = falTsContent.replace(endpointMatch[0], updatedEndpoint);
    updatesApplied++;

    console.log(`✓ Updated ${endpointId}`);
  }
}

// Write updated content
fs.writeFileSync(falTsPath, falTsContent);

console.log(`\n✅ Applied updates to ${updatesApplied} endpoints`);
console.log(`📝 Updated file: ${falTsPath}`);

/**
 * Safe script to apply ALL parameters from schema to fal.ts endpoints
 * Uses a careful line-by-line approach to avoid corruption
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
}

function extractEndpointOptions(modelId: string): EndpointOptions | null {
  const schema = (falModelsData as ModelSchema[]).find((m) => m.id === modelId);
  if (!schema) return null;

  const options: EndpointOptions = {};
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

  // Extract strength
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

  return Object.keys(options).length > 0 ? options : null;
}

function formatValue(key: string, value: any): string {
  if (key === "availableDimensions") {
    // Format dimensions nicely
    const dims = value as Array<{
      width: number;
      height: number;
      label: string;
    }>;
    const lines = ["availableDimensions: ["];
    for (let i = 0; i < dims.length; i++) {
      const dim = dims[i];
      lines.push("      {");
      lines.push(`        width: ${dim.width},`);
      lines.push(`        height: ${dim.height},`);
      lines.push(`        label: "${dim.label}",`);
      lines.push(i === dims.length - 1 ? "      }," : "      },");
    }
    lines.push("    ],");
    return lines.join("\n");
  }

  if (Array.isArray(value)) {
    return `${key}: [${value.join(", ")}],`;
  }

  if (typeof value === "boolean") {
    return `${key}: true,`;
  }

  return `${key}: ${value},`;
}

// Read fal.ts
const falTsPath = path.join(__dirname, "../src/lib/fal.ts");
const lines = fs.readFileSync(falTsPath, "utf-8").split("\n");

// Build a map of updates needed
const updatesMap = new Map<string, EndpointOptions>();

// Find all endpoints and check for updates
const endpointIdRegex = /endpointId: "([^"]+)"/;
for (const line of lines) {
  const match = line.match(endpointIdRegex);
  if (match) {
    const endpointId = match[1];
    const options = extractEndpointOptions(endpointId);
    if (options) {
      updatesMap.set(endpointId, options);
    }
  }
}

console.log(`Found ${updatesMap.size} endpoints with updates needed\n`);

// Now process the file line by line
const outputLines: string[] = [];
let currentEndpointId: string | null = null;
let inEndpointObject = false;
let braceDepth = 0;
let hasAddedParams = false;
let endpointStartBraceDepth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  outputLines.push(line);

  // Track brace depth
  const openBraces = (line.match(/{/g) || []).length;
  const closeBraces = (line.match(/}/g) || []).length;
  braceDepth += openBraces - closeBraces;

  // Check if we're entering an endpoint
  const endpointMatch = line.match(endpointIdRegex);
  if (endpointMatch && updatesMap.has(endpointMatch[1])) {
    currentEndpointId = endpointMatch[1];
    inEndpointObject = true;
    hasAddedParams = false;
    endpointStartBraceDepth = braceDepth;
  }

  // If we're in an endpoint and we hit the closing brace for that endpoint
  if (
    inEndpointObject &&
    currentEndpointId &&
    !hasAddedParams &&
    line.trim() === "}," &&
    braceDepth === endpointStartBraceDepth - 1
  ) {
    // Remove the closing brace we just added
    outputLines.pop();

    const options = updatesMap.get(currentEndpointId);
    if (options) {
      // Add all new parameters
      const paramsToAdd: string[] = [];

      // Duration parameters
      if (
        options.availableDurations &&
        !checkIfAlreadyHas("availableDurations", i)
      ) {
        paramsToAdd.push(
          formatValue("availableDurations", options.availableDurations),
        );
      }
      if (options.defaultDuration && !checkIfAlreadyHas("defaultDuration", i)) {
        paramsToAdd.push(
          formatValue("defaultDuration", options.defaultDuration),
        );
      }

      // Dimension parameters
      if (
        options.availableDimensions &&
        !checkIfAlreadyHas("availableDimensions", i)
      ) {
        paramsToAdd.push(
          formatValue("availableDimensions", options.availableDimensions),
        );
      }
      if (options.defaultWidth && !checkIfAlreadyHas("defaultWidth", i)) {
        paramsToAdd.push(formatValue("defaultWidth", options.defaultWidth));
      }
      if (options.defaultHeight && !checkIfAlreadyHas("defaultHeight", i)) {
        paramsToAdd.push(formatValue("defaultHeight", options.defaultHeight));
      }

      // FPS parameters
      if (options.availableFps && !checkIfAlreadyHas("availableFps", i)) {
        paramsToAdd.push(formatValue("availableFps", options.availableFps));
      }
      if (options.defaultFps && !checkIfAlreadyHas("defaultFps", i)) {
        paramsToAdd.push(formatValue("defaultFps", options.defaultFps));
      }

      // Steps parameters
      if (options.availableSteps && !checkIfAlreadyHas("availableSteps", i)) {
        paramsToAdd.push(formatValue("availableSteps", options.availableSteps));
      }
      if (options.minSteps !== undefined && !checkIfAlreadyHas("minSteps", i)) {
        paramsToAdd.push(formatValue("minSteps", options.minSteps));
      }
      if (options.maxSteps !== undefined && !checkIfAlreadyHas("maxSteps", i)) {
        paramsToAdd.push(formatValue("maxSteps", options.maxSteps));
      }
      if (
        options.defaultSteps !== undefined &&
        !checkIfAlreadyHas("defaultSteps", i)
      ) {
        paramsToAdd.push(formatValue("defaultSteps", options.defaultSteps));
      }

      // Guidance scale parameters
      if (
        options.minGuidanceScale !== undefined &&
        !checkIfAlreadyHas("minGuidanceScale", i)
      ) {
        paramsToAdd.push(
          formatValue("minGuidanceScale", options.minGuidanceScale),
        );
      }
      if (
        options.maxGuidanceScale !== undefined &&
        !checkIfAlreadyHas("maxGuidanceScale", i)
      ) {
        paramsToAdd.push(
          formatValue("maxGuidanceScale", options.maxGuidanceScale),
        );
      }
      if (
        options.defaultGuidanceScale !== undefined &&
        !checkIfAlreadyHas("defaultGuidanceScale", i)
      ) {
        paramsToAdd.push(
          formatValue("defaultGuidanceScale", options.defaultGuidanceScale),
        );
      }

      // Strength parameters
      if (
        options.minStrength !== undefined &&
        !checkIfAlreadyHas("minStrength", i)
      ) {
        paramsToAdd.push(formatValue("minStrength", options.minStrength));
      }
      if (
        options.maxStrength !== undefined &&
        !checkIfAlreadyHas("maxStrength", i)
      ) {
        paramsToAdd.push(formatValue("maxStrength", options.maxStrength));
      }
      if (
        options.defaultStrength !== undefined &&
        !checkIfAlreadyHas("defaultStrength", i)
      ) {
        paramsToAdd.push(
          formatValue("defaultStrength", options.defaultStrength),
        );
      }

      // Feature flags
      if (options.hasSeed && !checkIfAlreadyHas("hasSeed", i)) {
        paramsToAdd.push(formatValue("hasSeed", true));
      }
      if (
        options.hasNegativePrompt &&
        !checkIfAlreadyHas("hasNegativePrompt", i)
      ) {
        paramsToAdd.push(formatValue("hasNegativePrompt", true));
      }
      if (
        options.hasSafetyChecker &&
        !checkIfAlreadyHas("hasSafetyChecker", i)
      ) {
        paramsToAdd.push(formatValue("hasSafetyChecker", true));
      }

      // Add the parameters with proper indentation
      for (const param of paramsToAdd) {
        if (param.includes("\n")) {
          // Multi-line (like availableDimensions)
          for (const paramLine of param.split("\n")) {
            outputLines.push(`    ${paramLine}`);
          }
        } else {
          outputLines.push(`    ${param}`);
        }
      }

      if (paramsToAdd.length > 0) {
        console.log(
          `✓ Added ${paramsToAdd.length} parameters to ${currentEndpointId}`,
        );
      }
    }

    // Add back the closing brace
    outputLines.push(line);
    hasAddedParams = true;
    inEndpointObject = false;
    currentEndpointId = null;
  }
}

// Helper function to check if a parameter already exists in the endpoint
function checkIfAlreadyHas(
  paramName: string,
  currentLineIndex: number,
): boolean {
  // Look backwards from current line to find if this param already exists
  let depth = 0;
  for (let i = currentLineIndex; i >= 0; i--) {
    const line = lines[i];

    if (line.includes("},")) {
      depth++;
    }

    // If we're back at the start of the endpoint
    if (line.match(endpointIdRegex) && depth === 0) {
      break;
    }

    // Check if this line has the parameter
    if (line.includes(`${paramName}:`)) {
      return true;
    }
  }
  return false;
}

// Write the updated content
fs.writeFileSync(falTsPath, outputLines.join("\n"));

console.log("\n✅ Successfully applied all parameters!");
console.log(`📝 Updated file: ${falTsPath}`);

#!/usr/bin/env tsx
/**
 * Convert extracted Runware models from JavaScript bundle to ApiInfo format
 *
 * This script reads the extracted model data from the Runware playground bundle
 * and converts it to the ApiInfo format used in src/lib/runware-models.ts
 */

import fs from "node:fs";
import path from "node:path";

interface ExtractedModel {
  air_id: string;
  name?: string;
  architecture?: string;
  category?: string;
  description?: string;
  defaultSteps?: string;
  defaultCFG?: string;
  defaultWidth?: string;
  defaultHeight?: string;
  defaultScheduler?: string;
}

interface ApiInfo {
  provider: string;
  endpointId: string;
  label: string;
  description?: string;
  popularity?: number;
  category: string;
  inputAsset?: string[];
  hasNegativePrompt?: boolean;
  minSteps?: number;
  maxSteps?: number;
  defaultSteps?: number;
  minGuidanceScale?: number;
  maxGuidanceScale?: number;
  defaultGuidanceScale?: number;
  availableSchedulers?: string[];
  defaultScheduler?: string;
  availableDimensions?: Array<{ width: number; height: number; label: string }>;
}

const CATEGORY_MAP: Record<string, string> = {
  checkpoint: "image",
  video: "video",
  audio: "music", // Map audio to "music" category as per ApiInfo type
};

function calculatePopularity(model: ExtractedModel): number {
  const name = model.name?.toLowerCase() || "";
  const airId = model.air_id.toLowerCase();

  if (
    name.includes("flux") ||
    name.includes("imagen") ||
    name.includes("ideogram 3") ||
    name.includes("seedream 4") ||
    name.includes("veo")
  ) {
    return 5;
  }

  if (
    name.includes("qwen") ||
    name.includes("bria") ||
    name.includes("riverflow") ||
    airId.includes("google:") ||
    airId.includes("bytedance:")
  ) {
    return 4;
  }

  return 3;
}

function generateDimensions(
  model: ExtractedModel,
): Array<{ width: number; height: number; label: string }> | undefined {
  const width = model.defaultWidth
    ? Number.parseInt(model.defaultWidth)
    : undefined;
  const height = model.defaultHeight
    ? Number.parseInt(model.defaultHeight)
    : undefined;

  if (!width || !height) {
    return undefined;
  }

  if (width === 1024 && height === 1024) {
    return [
      { width: 1024, height: 1024, label: "1024×1024 (1:1)" },
      { width: 1152, height: 896, label: "1152×896 (9:7)" },
      { width: 896, height: 1152, label: "896×1152 (7:9)" },
      { width: 1344, height: 768, label: "1344×768 (16:9)" },
      { width: 768, height: 1344, label: "768×1344 (9:16)" },
    ];
  }

  if (width === 512 && height === 512) {
    return [
      { width: 512, height: 512, label: "512×512 (1:1)" },
      { width: 768, height: 512, label: "768×512 (3:2)" },
      { width: 512, height: 768, label: "512×768 (2:3)" },
    ];
  }

  return [{ width, height, label: `${width}×${height}` }];
}

function getInputAssets(model: ExtractedModel): string[] | undefined {
  const name = model.name?.toLowerCase() || "";
  const arch = model.architecture?.toLowerCase() || "";

  if (
    name.includes("edit") ||
    name.includes("remix") ||
    name.includes("reframe") ||
    name.includes("inpaint") ||
    name.includes("outpaint") ||
    arch.includes("edit") ||
    arch.includes("riverflow")
  ) {
    return ["image"];
  }

  if (
    model.category === "video" &&
    (name.includes("image-to-video") || arch.includes("omnihuman"))
  ) {
    return ["image"];
  }

  return undefined;
}

function hasNegativePrompt(model: ExtractedModel): boolean {
  const arch = model.architecture?.toLowerCase() || "";

  return (
    arch.includes("sdxl") ||
    arch.includes("sd1x") ||
    arch.includes("pony") ||
    arch.includes("flux") ||
    arch.includes("qwen")
  );
}

function convertToApiInfo(model: ExtractedModel): ApiInfo {
  const category = CATEGORY_MAP[model.category || "checkpoint"] || "image";

  const apiInfo: ApiInfo = {
    provider: "runware",
    endpointId: model.air_id,
    label: model.name || model.air_id,
    category,
    popularity: calculatePopularity(model),
  };

  if (model.description) {
    apiInfo.description = model.description;
  }

  const inputAssets = getInputAssets(model);
  if (inputAssets) {
    apiInfo.inputAsset = inputAssets;
  }

  if (hasNegativePrompt(model)) {
    apiInfo.hasNegativePrompt = true;
  }

  if (model.defaultSteps) {
    const steps = Number.parseInt(model.defaultSteps);
    apiInfo.defaultSteps = steps;
    apiInfo.minSteps = 1;
    apiInfo.maxSteps = Math.max(100, steps * 2);
  }

  if (model.defaultCFG) {
    const cfg = Number.parseFloat(model.defaultCFG);
    apiInfo.defaultGuidanceScale = cfg;
    apiInfo.minGuidanceScale = 0;
    apiInfo.maxGuidanceScale = Math.max(20, cfg * 4);
  }

  if (model.defaultScheduler && model.defaultScheduler !== "Default") {
    apiInfo.defaultScheduler = model.defaultScheduler;
    apiInfo.availableSchedulers = [model.defaultScheduler, "Default"];
  }

  if (category === "image") {
    const dimensions = generateDimensions(model);
    if (dimensions) {
      apiInfo.availableDimensions = dimensions;
    }
  }

  return apiInfo;
}

async function main() {
  const inputFile = "/tmp/runware-models-extracted.json";
  const outputFile = path.join(
    __dirname,
    "../src/lib/runware-models-generated.ts",
  );

  console.log("Reading extracted models from:", inputFile);
  const rawData = fs.readFileSync(inputFile, "utf-8");
  const extractedModels: ExtractedModel[] = JSON.parse(rawData);

  console.log(`Found ${extractedModels.length} extracted models`);

  const convertedModels = extractedModels.map(convertToApiInfo);

  convertedModels.sort((a, b) => {
    const categoryOrder = { image: 1, video: 2, audio: 3 };
    const catCompare =
      (categoryOrder[a.category as keyof typeof categoryOrder] || 99) -
      (categoryOrder[b.category as keyof typeof categoryOrder] || 99);
    if (catCompare !== 0) return catCompare;

    const popCompare = (b.popularity || 0) - (a.popularity || 0);
    if (popCompare !== 0) return popCompare;

    return a.label.localeCompare(b.label);
  });

  const imageCount = convertedModels.filter(
    (m) => m.category === "image",
  ).length;
  const videoCount = convertedModels.filter(
    (m) => m.category === "video",
  ).length;
  const audioCount = convertedModels.filter(
    (m) => m.category === "audio",
  ).length;

  console.log("\nConverted models:");
  console.log(`  - Image: ${imageCount}`);
  console.log(`  - Video: ${videoCount}`);
  console.log(`  - Audio: ${audioCount}`);
  console.log(`  - Total: ${convertedModels.length}`);

  const tsContent = `import type { ApiInfo } from "./fal";

/**
 * Runware AI Models
 * 
 * This file is auto-generated from the Runware playground JavaScript bundle.
 * Last updated: ${new Date().toISOString()}
 * 
 * Total models: ${convertedModels.length}
 * - Image models: ${imageCount}
 * - Video models: ${videoCount}
 * - Audio models: ${audioCount}
 */

export const RUNWARE_ENDPOINTS: ApiInfo[] = ${JSON.stringify(convertedModels, null, 2)};
`;

  fs.writeFileSync(outputFile, tsContent, "utf-8");
  console.log(`\nGenerated TypeScript file: ${outputFile}`);

  console.log("\nSample models by category:");

  const imageModels = convertedModels.filter((m) => m.category === "image");
  console.log(`\nImage models (${imageModels.length} total):`);
  for (const m of imageModels.slice(0, 5)) {
    console.log(`  - ${m.label} (${m.endpointId})`);
  }

  const videoModels = convertedModels.filter((m) => m.category === "video");
  console.log(`\nVideo models (${videoModels.length} total):`);
  for (const m of videoModels.slice(0, 5)) {
    console.log(`  - ${m.label} (${m.endpointId})`);
  }

  const audioModels = convertedModels.filter((m) => m.category === "audio");
  console.log(`\nAudio models (${audioModels.length} total):`);
  for (const m of audioModels.slice(0, 5)) {
    console.log(`  - ${m.label} (${m.endpointId})`);
  }
}

main().catch(console.error);

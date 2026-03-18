#!/usr/bin/env tsx
/**
 * Merge extracted Runware models with existing curated data
 *
 * Strategy:
 * - For existing endpoints: preserve all curated options (dimensions, schedulers, ranges)
 * - For existing endpoints: update only label, description, and default values from bundle
 * - For new endpoints: add with safe defaults only (no guessed ranges)
 */

import fs from "node:fs";
import path from "node:path";

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
  supportedAspectRatios?: Array<{
    width: number;
    height: number;
    label: string;
  }>;
  availableAcceleration?: string[];
  defaultAcceleration?: string;
}

async function main() {
  const oldFilePath = path.join(__dirname, "../src/lib/runware-models.ts");
  console.log("Reading old curated file:", oldFilePath);

  const oldModule = await import(oldFilePath);
  const oldEndpoints: ApiInfo[] = oldModule.RUNWARE_ENDPOINTS;
  console.log(`Found ${oldEndpoints.length} existing curated endpoints`);

  const newFilePath = path.join(
    __dirname,
    "../src/lib/runware-models-generated.ts",
  );
  console.log("Reading newly extracted file:", newFilePath);

  const newModule = await import(newFilePath);
  const newEndpoints: ApiInfo[] = newModule.RUNWARE_ENDPOINTS;
  console.log(`Found ${newEndpoints.length} newly extracted endpoints`);

  const oldEndpointsMap = new Map<string, ApiInfo>();
  for (const endpoint of oldEndpoints) {
    oldEndpointsMap.set(endpoint.endpointId, endpoint);
  }

  const mergedEndpoints: ApiInfo[] = [];
  const updatedEndpoints: string[] = [];
  const newEndpointsAdded: string[] = [];

  for (const newEndpoint of newEndpoints) {
    const oldEndpoint = oldEndpointsMap.get(newEndpoint.endpointId);

    if (oldEndpoint) {
      const merged: ApiInfo = {
        ...oldEndpoint, // Keep all old curated fields
        label: newEndpoint.label || oldEndpoint.label,
        description: newEndpoint.description || oldEndpoint.description,
        category: newEndpoint.category || oldEndpoint.category,
      };

      if (newEndpoint.defaultSteps !== undefined) {
        merged.defaultSteps = newEndpoint.defaultSteps;
      }
      if (newEndpoint.defaultGuidanceScale !== undefined) {
        merged.defaultGuidanceScale = newEndpoint.defaultGuidanceScale;
      }
      if (newEndpoint.defaultScheduler !== undefined) {
        merged.defaultScheduler = newEndpoint.defaultScheduler;
      }

      mergedEndpoints.push(merged);
      updatedEndpoints.push(newEndpoint.endpointId);

      oldEndpointsMap.delete(newEndpoint.endpointId);
    } else {
      const safeEndpoint: ApiInfo = {
        provider: newEndpoint.provider,
        endpointId: newEndpoint.endpointId,
        label: newEndpoint.label,
        category: newEndpoint.category,
        popularity: newEndpoint.popularity,
      };

      if (newEndpoint.description) {
        safeEndpoint.description = newEndpoint.description;
      }

      if (newEndpoint.defaultSteps !== undefined) {
        safeEndpoint.defaultSteps = newEndpoint.defaultSteps;
      }
      if (newEndpoint.defaultGuidanceScale !== undefined) {
        safeEndpoint.defaultGuidanceScale = newEndpoint.defaultGuidanceScale;
      }
      if (newEndpoint.defaultScheduler !== undefined) {
        safeEndpoint.defaultScheduler = newEndpoint.defaultScheduler;
      }

      if (newEndpoint.inputAsset) {
        safeEndpoint.inputAsset = newEndpoint.inputAsset;
      }

      if (newEndpoint.hasNegativePrompt !== undefined) {
        safeEndpoint.hasNegativePrompt = newEndpoint.hasNegativePrompt;
      }

      mergedEndpoints.push(safeEndpoint);
      newEndpointsAdded.push(newEndpoint.endpointId);
    }
  }

  for (const [endpointId, oldEndpoint] of Array.from(
    oldEndpointsMap.entries(),
  )) {
    console.log(`Preserving old endpoint not found in bundle: ${endpointId}`);
    mergedEndpoints.push(oldEndpoint);
  }

  mergedEndpoints.sort((a, b) => {
    const categoryOrder = { image: 1, video: 2, audio: 3 };
    const catCompare =
      (categoryOrder[a.category as keyof typeof categoryOrder] || 99) -
      (categoryOrder[b.category as keyof typeof categoryOrder] || 99);
    if (catCompare !== 0) return catCompare;

    const popCompare = (b.popularity || 0) - (a.popularity || 0);
    if (popCompare !== 0) return popCompare;

    return a.label.localeCompare(b.label);
  });

  const imageCount = mergedEndpoints.filter(
    (m) => m.category === "image",
  ).length;
  const videoCount = mergedEndpoints.filter(
    (m) => m.category === "video",
  ).length;
  const audioCount = mergedEndpoints.filter(
    (m) => m.category === "audio",
  ).length;

  console.log("\n=== Merge Summary ===");
  console.log(`Total merged endpoints: ${mergedEndpoints.length}`);
  console.log(`  - Image: ${imageCount}`);
  console.log(`  - Video: ${videoCount}`);
  console.log(`  - Audio: ${audioCount}`);
  console.log(`\nUpdated existing endpoints: ${updatedEndpoints.length}`);
  console.log(`New endpoints added: ${newEndpointsAdded.length}`);
  console.log(`Old endpoints preserved: ${oldEndpointsMap.size}`);

  console.log("\n=== Sample New Endpoints ===");
  for (const id of newEndpointsAdded.slice(0, 10)) {
    const endpoint = mergedEndpoints.find((e) => e.endpointId === id);
    if (endpoint) {
      console.log(
        `  - ${endpoint.label} (${endpoint.endpointId}) [${endpoint.category}]`,
      );
    }
  }

  const outputPath = path.join(__dirname, "../src/lib/runware-models.ts");
  const tsContent = `import type { ApiInfo } from "./fal";

/**
 * Runware AI Models
 * 
 * This file is auto-generated by merging extracted data from the Runware playground
 * with manually-curated options for existing models.
 * 
 * Last updated: ${new Date().toISOString()}
 * 
 * Total models: ${mergedEndpoints.length}
 * - Image models: ${imageCount}
 * - Video models: ${videoCount}
 * - Audio models: ${audioCount}
 * 
 * Merge strategy:
 * - Existing models: preserved curated options (dimensions, schedulers, ranges)
 * - Existing models: updated labels, descriptions, and defaults from bundle
 * - New models: added with safe defaults only (no guessed ranges)
 */

export const RUNWARE_ENDPOINTS: ApiInfo[] = ${JSON.stringify(mergedEndpoints, null, 2)};
`;

  fs.writeFileSync(outputPath, tsContent, "utf-8");
  console.log(`\n✓ Generated merged file: ${outputPath}`);
}

main().catch(console.error);

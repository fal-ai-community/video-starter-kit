import fs from "node:fs";
import path from "node:path";

// Read and parse fal.ts to extract AVAILABLE_ENDPOINTS
const falTsPath = path.join(__dirname, "../src/lib/fal.ts");
let falTsContent = fs.readFileSync(falTsPath, "utf-8");

// Import the schemas
const falModelsData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../data/fal_models_schemas.json"),
    "utf-8",
  ),
);

interface EndpointOptions {
  availableDurations?: number[];
  defaultDuration?: number;
  availableDimensions?: Array<{ width: number; height: number; label: string }>;
  defaultWidth?: number;
  defaultHeight?: number;
  availableFps?: number[];
  defaultFps?: number;
}

function extractEndpointOptions(modelId: string): EndpointOptions | null {
  const schema = falModelsData.find((m: { id: string }) => m.id === modelId);
  if (!schema) return null;

  const params = schema.inputParameters || schema.input?.properties;
  if (!params) return null;

  const options: EndpointOptions = {};

  // Extract duration options
  if (params.duration?.enum) {
    options.availableDurations = params.duration.enum.map(
      (d: string | number) => {
        if (typeof d === "number") return d;
        return Number.parseInt(String(d).replace(/[^0-9]/g, ""), 10);
      },
    );
  }
  if (params.duration?.default) {
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

  // Extract FPS options
  if (params.fps?.enum) {
    options.availableFps = params.fps.enum;
  }
  if (params.fps?.default !== undefined) {
    options.defaultFps = params.fps.default;
  }

  // Extract width/height
  if (params.width?.default !== undefined) {
    options.defaultWidth = params.width.default;
  }
  if (params.height?.default !== undefined) {
    options.defaultHeight = params.height.default;
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

  return Object.keys(options).length > 0 ? options : null;
}

// Strategy: For each endpoint, if we have options from schema,
// add them as top-level fields AFTER the closing of initialInput
// and REMOVE them from initialInput if they exist there

console.log("Processing endpoints...\n");

// Find all endpoint blocks with endpointId
const endpointPattern = /{\s*provider:\s*"fal",\s*endpointId:\s*"([^"]+)"/g;
const matches = Array.from(falTsContent.matchAll(endpointPattern));

console.log(`Found ${matches.length} FAL endpoints\n`);

let updatedCount = 0;

for (const match of matches) {
  const endpointId = match[1];
  const options = extractEndpointOptions(endpointId);

  if (!options) continue;

  console.log(`Processing ${endpointId}...`);

  // Find the full object for this endpoint
  // Strategy: find the opening brace, then match braces until we close
  const startIndex = match.index;
  if (startIndex === undefined) continue;

  let braceCount = 0;
  let inString = false;
  let stringChar = "";
  let objectStart = -1;
  let objectEnd = -1;

  for (let i = startIndex; i < falTsContent.length; i++) {
    const char = falTsContent[i];
    const prevChar = i > 0 ? falTsContent[i - 1] : "";

    // Handle string literals
    if ((char === '"' || char === "'" || char === "`") && prevChar !== "\\") {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = "";
      }
    }

    if (inString) continue;

    if (char === "{") {
      if (braceCount === 0) objectStart = i;
      braceCount++;
    } else if (char === "}") {
      braceCount--;
      if (braceCount === 0) {
        objectEnd = i;
        break;
      }
    }
  }

  if (objectStart === -1 || objectEnd === -1) {
    console.log("  ⚠️  Could not find object boundaries");
    continue;
  }

  let objectStr = falTsContent.substring(objectStart, objectEnd + 1);

  // Remove old fields from initialInput if they exist
  if (objectStr.includes("initialInput:")) {
    if (options.availableDurations) {
      objectStr = objectStr.replace(
        /availableDurations:\s*\[[^\]]*\],?\s*\n?\s*/g,
        "",
      );
    }
    if (options.defaultDuration) {
      objectStr = objectStr.replace(/defaultDuration:\s*\d+,?\s*\n?\s*/g, "");
    }
    if (options.availableDimensions) {
      objectStr = objectStr.replace(
        /availableDimensions:\s*\[[^\]]*\],?\s*\n?\s*/g,
        "",
      );
    }
  }

  // Now add fields at top level, before the closing brace
  const fieldsToAdd: string[] = [];

  if (options.availableDurations) {
    fieldsToAdd.push(
      `availableDurations: [${options.availableDurations.join(", ")}]`,
    );
  }
  if (options.defaultDuration) {
    fieldsToAdd.push(`defaultDuration: ${options.defaultDuration}`);
  }
  if (options.availableDimensions) {
    const dimsStr = JSON.stringify(options.availableDimensions, null, 4)
      .split("\n")
      .map((line, idx) => (idx === 0 ? line : `    ${line}`))
      .join("\n");
    fieldsToAdd.push(`availableDimensions: ${dimsStr}`);
  }
  if (options.defaultWidth) {
    fieldsToAdd.push(`defaultWidth: ${options.defaultWidth}`);
  }
  if (options.defaultHeight) {
    fieldsToAdd.push(`defaultHeight: ${options.defaultHeight}`);
  }
  if (options.availableFps) {
    fieldsToAdd.push(`availableFps: [${options.availableFps.join(", ")}]`);
  }
  if (options.defaultFps) {
    fieldsToAdd.push(`defaultFps: ${options.defaultFps}`);
  }

  if (fieldsToAdd.length > 0) {
    // Remove the closing brace
    const withoutClosing = objectStr.slice(0, -1);
    // Add new fields with proper indentation
    const newFields = fieldsToAdd.map((f) => `    ${f}`).join(",\n");
    // Reconstruct object with new fields and closing brace
    const updatedObject = `${withoutClosing},\n${newFields},\n  }`;

    // Replace in content
    falTsContent =
      falTsContent.substring(0, objectStart) +
      updatedObject +
      falTsContent.substring(objectEnd + 1);

    console.log("  ✓ Updated");
    updatedCount++;
  }
}

// Write back
fs.writeFileSync(falTsPath, falTsContent);

console.log(`\n✅ Updated ${updatedCount} endpoints`);
console.log(`📝 Updated file: ${falTsPath}`);

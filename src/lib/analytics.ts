import type { MediaItem } from "@/data/schema";
import type { MediaType } from "@/data/store";
import { fal } from "./fal";
import { extractJson } from "./utils";

export type ModelStats = {
  modelId: string;
  totalGenerations: number;
  positive: number;
  negative: number;
  unrated: number;
  positiveRate: number;
  negativeRate: number;
  unratedRate: number;
};

export type CategoryStats = {
  category: MediaType;
  totalGenerations: number;
  positive: number;
  negative: number;
  unrated: number;
  positiveRate: number;
  negativeRate: number;
  unratedRate: number;
};

export type PromptAnalysis = {
  modelId: string;
  positivePrompts: string[];
  negativePrompts: string[];
  analysis: {
    positivePatterns: string[];
    negativePatterns: string[];
    recommendations: string[];
  };
};

export function calculateModelStats(mediaItems: MediaItem[]): ModelStats[] {
  // Group by model (endpointId)
  const byModel = new Map<string, MediaItem[]>();

  for (const item of mediaItems) {
    if (item.kind !== "generated") continue;
    const modelId = item.endpointId;
    if (!byModel.has(modelId)) {
      byModel.set(modelId, []);
    }
    byModel.get(modelId)!.push(item);
  }

  // Calculate stats for each model
  return Array.from(byModel.entries()).map(([modelId, items]) => {
    const total = items.length;
    const positive = items.filter((i) => i.rating === "positive").length;
    const negative = items.filter((i) => i.rating === "negative").length;
    const unrated = items.filter((i) => i.rating === undefined).length;

    return {
      modelId,
      totalGenerations: total,
      positive,
      negative,
      unrated,
      positiveRate: total > 0 ? (positive / total) * 100 : 0,
      negativeRate: total > 0 ? (negative / total) * 100 : 0,
      unratedRate: total > 0 ? (unrated / total) * 100 : 0,
    };
  });
}

export function calculateCategoryStats(
  mediaItems: MediaItem[],
): CategoryStats[] {
  // Group by media type
  const byCategory = new Map<MediaType, MediaItem[]>();

  for (const item of mediaItems) {
    if (item.kind !== "generated") continue;
    const category = item.mediaType;
    if (!byCategory.has(category)) {
      byCategory.set(category, []);
    }
    byCategory.get(category)!.push(item);
  }

  // Calculate stats for each category
  return Array.from(byCategory.entries()).map(([category, items]) => {
    const total = items.length;
    const positive = items.filter((i) => i.rating === "positive").length;
    const negative = items.filter((i) => i.rating === "negative").length;
    const unrated = items.filter((i) => i.rating === undefined).length;

    return {
      category,
      totalGenerations: total,
      positive,
      negative,
      unrated,
      positiveRate: total > 0 ? (positive / total) * 100 : 0,
      negativeRate: total > 0 ? (negative / total) * 100 : 0,
      unratedRate: total > 0 ? (unrated / total) * 100 : 0,
    };
  });
}

export function getModelName(modelId: string): string {
  // Extract readable name from model ID
  // e.g., "fal-ai/minimax/video-01-live" -> "Minimax Video"
  const parts = modelId.split("/");
  if (parts.length < 2) return modelId;

  // Remove fal-ai prefix if present
  if (parts[0] === "fal-ai") {
    parts.shift();
  }

  // Capitalize and clean up remaining parts
  return parts
    .map((part) =>
      part
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    )
    .join(" ");
}

export async function analyzePrompts(
  mediaItems: MediaItem[],
  customSystemPrompt?: string,
): Promise<PromptAnalysis[]> {
  // Group by model
  const byModel = new Map<string, MediaItem[]>();

  for (const item of mediaItems) {
    if (item.kind !== "generated" || !item.input?.prompt || !item.rating) continue;
    const modelId = item.endpointId;
    if (!byModel.has(modelId)) {
      byModel.set(modelId, []);
    }
    byModel.get(modelId)!.push(item);
  }

  // Analyze prompts for each model
  const analyses = await Promise.all(
    Array.from(byModel.entries()).map(async ([modelId, items]) => {
      const positivePrompts = items
        .filter((i) => i.rating === "positive")
        .map((i) => i.input?.prompt as string);

      const negativePrompts = items
        .filter((i) => i.rating === "negative")
        .map((i) => i.input?.prompt as string);

      // Skip if no rated prompts
      if (positivePrompts.length === 0 && negativePrompts.length === 0) {
        return null;
      }

      const analysis = await analyzeWithGemini(
        positivePrompts,
        negativePrompts,
        modelId,
        customSystemPrompt,
      );

      return {
        modelId,
        positivePrompts,
        negativePrompts,
        analysis,
      };
    }),
  );

  return analyses.filter((a): a is PromptAnalysis => a !== null);
}

async function analyzeWithGemini(
  positivePrompts: string[],
  negativePrompts: string[],
  modelId: string,
  customSystemPrompt?: string,
): Promise<{
  positivePatterns: string[];
  negativePatterns: string[];
  recommendations: string[];
}> {
  const prompt = `Analyze these AI generation prompts for ${getModelName(modelId)}:

SUCCESSFUL PROMPTS:
${positivePrompts.map((p) => `- ${p}`).join("\n")}

UNSUCCESSFUL PROMPTS:
${negativePrompts.map((p) => `- ${p}`).join("\n")}

Please provide three sections:
1. Common patterns in successful prompts (bullet points)
2. Common patterns in unsuccessful prompts (bullet points)
3. Recommendations for better prompts (bullet points)

Keep each bullet point concise and focused on actionable insights.
If there are no patterns to identify in either successful or unsuccessful prompts, provide general best practices instead.

Return the response in JSON format with three arrays: positivePatterns, negativePatterns, and recommendations.
Example format:
{
  "positivePatterns": ["Pattern 1", "Pattern 2"],
  "negativePatterns": ["Pattern 1", "Pattern 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

  try {
    const { data } = await fal.subscribe("fal-ai/any-llm", {
      input: {
        system_prompt: customSystemPrompt || "You are an AI prompt analysis assistant. Analyze patterns in successful and unsuccessful prompts to provide actionable insights. Always respond in valid JSON format.",
        prompt,
        model: "meta-llama/llama-3.2-1b-instruct",
      },
    });

    try {
      return extractJson(data.output);
    } catch (error) {
      console.error("Failed to parse LLM response as JSON:", error);
      return {
        positivePatterns: ["Could not analyze patterns in successful prompts"],
        negativePatterns: ["Could not analyze patterns in unsuccessful prompts"],
        recommendations: ["Try rating more prompts to get better analysis"],
      };
    }
  } catch (error) {
    console.error("Error analyzing prompts with LLM:", error);
    return {
      positivePatterns: [],
      negativePatterns: [],
      recommendations: ["An error occurred while analyzing prompts"],
    };
  }
}

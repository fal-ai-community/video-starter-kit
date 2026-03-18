/**
 * Pricing calculation utilities for FAL models
 *
 * This module provides functions to calculate approximate costs for model generations
 * based on various billing units (videos, images, seconds, characters, megapixels, etc.)
 */

import falModelsData from "../../data/fal_models_schemas.json";

export type BillingUnit =
  | "videos"
  | "images"
  | "audios"
  | "seconds"
  | "minutes"
  | "megapixels"
  | "processed megapixels"
  | "1000 characters"
  | "1000 characters "
  | "1000 tokens"
  | "1m tokens"
  | "generations"
  | "requests"
  | "trainings"
  | "cloned voices"
  | "video segments"
  | "steps"
  | "units"
  | "credits"
  | "compute seconds"
  | "input seconds"
  | "5 seconds"
  | "10 seconds"
  | "30 seconds"
  | "minute of video "
  | "1"
  | "";

export interface ModelPricing {
  price: number;
  billing_unit: BillingUnit;
  provider_type: string;
  is_partner_api: boolean;
}

export interface ModelSchema {
  id: string;
  title: string;
  category: string;
  pricing: ModelPricing;
  inputParameters: Record<string, any>;
}

export interface PricingCalculationParams {
  // Video/audio duration in seconds
  duration?: number;

  // Image dimensions
  width?: number;
  height?: number;

  // Text length
  textLength?: number;

  // Number of items (for per-item billing)
  quantity?: number;

  // Custom parameters
  customParams?: Record<string, any>;
}

/**
 * Get model schema by ID
 */
export function getModelSchema(modelId: string): ModelSchema | undefined {
  return (falModelsData as ModelSchema[]).find((model) => model.id === modelId);
}

/**
 * Get all model schemas
 */
export function getAllModelSchemas(): ModelSchema[] {
  return falModelsData as ModelSchema[];
}

/**
 * Calculate megapixels from dimensions
 */
function calculateMegapixels(width: number, height: number): number {
  return (width * height) / 1_000_000;
}

/**
 * Parse aspect ratio string to dimensions (if default dimensions are needed)
 */
function parseAspectRatio(
  aspectRatio: string,
): { width: number; height: number } | null {
  const ratioMap: Record<string, { width: number; height: number }> = {
    "16:9": { width: 1920, height: 1080 },
    "9:16": { width: 1080, height: 1920 },
    "1:1": { width: 1024, height: 1024 },
    "4:3": { width: 1024, height: 768 },
    "3:4": { width: 768, height: 1024 },
    "21:9": { width: 2560, height: 1080 },
  };

  return ratioMap[aspectRatio] || null;
}

/**
 * Extract duration from model input parameters
 */
function extractDuration(
  params: PricingCalculationParams,
  modelSchema: ModelSchema,
): number {
  if (params.duration) return params.duration;

  // Try to get default duration from model schema
  const durationParam = modelSchema.inputParameters.duration;
  if (durationParam?.default) {
    const defaultValue = durationParam.default;
    // Convert string to number if needed
    return typeof defaultValue === "string"
      ? Number.parseFloat(defaultValue)
      : defaultValue;
  }

  // Default fallback durations based on category
  if (
    modelSchema.category === "video" ||
    modelSchema.category === "image-to-video"
  ) {
    return 5; // 5 seconds default for video
  }

  return 0;
}

/**
 * Extract dimensions from model input parameters
 */
function extractDimensions(
  params: PricingCalculationParams,
  modelSchema: ModelSchema,
): { width: number; height: number } {
  // If explicit dimensions provided
  if (params.width && params.height) {
    return { width: params.width, height: params.height };
  }

  // Try to get from image_size parameter
  const imageSizeParam = modelSchema.inputParameters.image_size;
  if (imageSizeParam?.default) {
    const size = imageSizeParam.default;
    if (size.width && size.height) {
      return { width: size.width, height: size.height };
    }
  }

  // Try to get from aspect_ratio
  const aspectRatioParam = modelSchema.inputParameters.aspect_ratio;
  if (aspectRatioParam?.default) {
    const dims = parseAspectRatio(aspectRatioParam.default);
    if (dims) return dims;
  }

  // Default dimensions
  return { width: 1024, height: 1024 };
}

/**
 * Calculate approximate cost for a model generation
 *
 * @param modelId - The FAL model ID
 * @param params - Parameters for cost calculation
 * @returns Approximate cost in USD, or null if unable to calculate
 */
export function calculateModelCost(
  modelId: string,
  params: PricingCalculationParams = {},
): number | null {
  const modelSchema = getModelSchema(modelId);

  if (!modelSchema || !modelSchema.pricing) {
    return null;
  }

  const { price, billing_unit } = modelSchema.pricing;

  // If price is 0 or negative, return 0
  if (price <= 0) {
    return 0;
  }

  const quantity = params.quantity ?? 1;

  switch (billing_unit) {
    // Fixed per-item pricing
    case "videos":
    case "images":
    case "audios":
    case "generations":
    case "requests":
    case "trainings":
    case "cloned voices":
    case "video segments":
      return price * quantity;

    // Per-second pricing
    case "seconds":
    case "compute seconds":
    case "input seconds": {
      const duration = extractDuration(params, modelSchema);
      return price * duration * quantity;
    }

    // Fixed duration pricing (convert to seconds)
    case "5 seconds": {
      const duration = params.duration ?? 5;
      const unitPrice = price / 5; // Price per second
      return unitPrice * duration * quantity;
    }

    case "10 seconds": {
      const duration = params.duration ?? 10;
      const unitPrice = price / 10;
      return unitPrice * duration * quantity;
    }

    case "30 seconds": {
      const duration = params.duration ?? 30;
      const unitPrice = price / 30;
      return unitPrice * duration * quantity;
    }

    // Per-minute pricing
    case "minutes":
    case "minute of video ": {
      const duration = extractDuration(params, modelSchema);
      const minutes = duration / 60;
      return price * minutes * quantity;
    }

    // Megapixel-based pricing
    case "megapixels":
    case "processed megapixels": {
      const { width, height } = extractDimensions(params, modelSchema);
      const megapixels = calculateMegapixels(width, height);
      return price * megapixels * quantity;
    }

    // Character-based pricing
    case "1000 characters":
    case "1000 characters ": {
      const textLength = params.textLength ?? 0;
      const units = textLength / 1000;
      return price * units * quantity;
    }

    // Token-based pricing
    case "1000 tokens": {
      const textLength = params.textLength ?? 0;
      // Rough approximation: 1 token ≈ 4 characters
      const tokens = textLength / 4;
      const units = tokens / 1000;
      return price * units * quantity;
    }

    case "1m tokens": {
      const textLength = params.textLength ?? 0;
      const tokens = textLength / 4;
      const units = tokens / 1_000_000;
      return price * units * quantity;
    }

    // Other units - approximate as per-item
    case "steps":
    case "units":
    case "credits":
    case "1":
      return price * quantity;

    // Empty or unknown billing unit
    default:
      return null;
  }
}

/**
 * Format cost as a price string
 */
export function formatCost(
  cost: number | null,
  options?: {
    showApprox?: boolean;
    currency?: string;
  },
): string {
  if (cost === null || cost === 0) {
    return options?.showApprox ? "~$0.00" : "$0.00";
  }

  const { showApprox = true, currency = "$" } = options ?? {};
  const prefix = showApprox ? "~" : "";

  if (cost < 0.01) {
    return `${prefix}${currency}${cost.toFixed(4)}`;
  }

  if (cost < 1) {
    return `${prefix}${currency}${cost.toFixed(3)}`;
  }

  return `${prefix}${currency}${cost.toFixed(2)}`;
}

/**
 * Get pricing info for display
 */
export function getPricingInfo(modelId: string): {
  price: number;
  billingUnit: BillingUnit;
  displayText: string;
  canCalculate: boolean;
} | null {
  const modelSchema = getModelSchema(modelId);

  if (!modelSchema || !modelSchema.pricing) {
    return null;
  }

  const { price, billing_unit } = modelSchema.pricing;

  // Check if we can calculate costs
  const canCalculate = billing_unit !== "" && price > 0;

  // Create display text
  const displayText = `${formatCost(price, { showApprox: false })}/${billing_unit}`;

  return {
    price,
    billingUnit: billing_unit,
    displayText,
    canCalculate,
  };
}

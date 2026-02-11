"use client";

import { Runware } from "@runware/sdk-js";

type RunwareClient = InstanceType<typeof Runware>;

let runwareClient: RunwareClient | null = null;
let initializationPromise: Promise<RunwareClient> | null = null;
const runwareUploadCache = new Map<string, string>();

const guessExtensionFromMime = (mime: string) => {
  if (!mime) return undefined;
  const [, subtype] = mime.split("/");
  if (!subtype) return undefined;
  return subtype.split(";")[0] || undefined;
};

export const getRunwareClient = async (): Promise<RunwareClient | null> => {
  const apiKey =
    typeof window !== "undefined" ? localStorage.getItem("runwareKey") : null;

  if (!apiKey) {
    return null;
  }

  if (runwareClient) {
    return runwareClient;
  }

  if (!initializationPromise) {
    initializationPromise = Runware.initialize({
      apiKey,
      timeoutDuration: 180000, // 3 minutes to handle video generation
    });
  }

  runwareClient = await initializationPromise;
  return runwareClient;
};

export const resetRunwareClient = () => {
  runwareClient = null;
  initializationPromise = null;
};

export type RunwareAssetValue = string | Blob | File;

const isFile = (value: unknown): value is File =>
  typeof File !== "undefined" && value instanceof File;

const isBlob = (value: unknown): value is Blob =>
  typeof Blob !== "undefined" && value instanceof Blob;

const isHttpUrl = (value: unknown): value is string =>
  typeof value === "string" && /^https?:\/\//.test(value);

type PrepareRunwareAssetParams = {
  value: RunwareAssetValue;
  runware?: RunwareClient | null;
  cacheKey?: string;
  uploadHttpAssets?: boolean;
};

export const prepareRunwareImageAsset = async ({
  value,
  runware,
  cacheKey,
  uploadHttpAssets = false,
}: PrepareRunwareAssetParams): Promise<RunwareAssetValue> => {
  if (value === undefined || value === null) {
    return value;
  }

  if (typeof value === "string") {
    if (!uploadHttpAssets || !isHttpUrl(value) || !runware) {
      return value;
    }

    if (runwareUploadCache.has(value)) {
      return runwareUploadCache.get(value) as string;
    }

    if (typeof runware.imageUpload !== "function") {
      runwareUploadCache.set(value, value);
      return value;
    }

    try {
      const uploaded = await runware.imageUpload({ image: value });
      const url = uploaded?.imageURL || value;
      // Ensure URL is a string
      const uploadedUrl = typeof url === "string" ? url : String(url);
      runwareUploadCache.set(value, uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      console.warn("Failed to upload HTTP asset to Runware", error);
      runwareUploadCache.set(value, value);
      return value;
    }
  }

  // File/Blob need to be uploaded to Runware to get UUID
  if (isFile(value) || isBlob(value)) {
    if (!runware || typeof runware.imageUpload !== "function") {
      console.warn(
        "Runware client not available or imageUpload not supported, returning File/Blob as-is",
      );
      return value;
    }

    const cacheKeyForBlob = isBlob(value)
      ? `blob-${value.size}-${value.type}`
      : `file-${(value as File).name}`;

    if (runwareUploadCache.has(cacheKeyForBlob)) {
      console.log("[DEBUG] Using cached Runware upload UUID:", cacheKeyForBlob);
      return runwareUploadCache.get(cacheKeyForBlob) as string;
    }

    try {
      console.log(
        "[DEBUG] Uploading File/Blob to Runware:",
        isFile(value) ? (value as File).name : "blob",
      );

      // Convert File/Blob to base64 data URI for imageUpload API
      // According to Runware docs, imageUpload accepts: data URI, base64, or URL string
      // NOT File/Blob objects!
      const base64DataUri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(value);
      });

      console.log(
        "[DEBUG] Converted to base64 data URI, length:",
        `${base64DataUri.substring(0, 50)}...`,
      );

      const uploaded = await runware.imageUpload({ image: base64DataUri });
      // IMPORTANT: Use imageURL (not imageUUID) - Runware API expects full URLs in referenceImages
      const url = uploaded?.imageURL || uploaded?.imageUUID;

      if (!url) {
        throw new Error("imageUpload did not return imageURL or imageUUID");
      }

      // Ensure URL is a string (Runware SDK types might allow string | number)
      const uploadedUrl = typeof url === "string" ? url : String(url);

      console.log("[DEBUG] Runware upload result URL:", uploadedUrl);
      runwareUploadCache.set(cacheKeyForBlob, uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      console.error("Failed to upload File/Blob to Runware:", error);
      // Cannot return File/Blob as-is - they don't work with Runware API
      throw new Error(
        `Failed to upload image to Runware: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  return value;
};

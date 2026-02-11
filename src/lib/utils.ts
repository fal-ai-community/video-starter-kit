import type { MediaItem, VideoTrack } from "@/data/schema";
import { GenerateData, LAST_PROJECT_ID_KEY } from "@/data/store";
import { type ClassValue, clsx } from "clsx";
import { ImageIcon, MicIcon, MusicIcon, VideoIcon } from "lucide-react";
import type { FunctionComponent } from "react";
import { twMerge } from "tailwind-merge";
import type { InputAsset } from "./fal";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractJson<T>(raw: string): T {
  const json = raw.replace("```json", "").replace("```", "");
  return JSON.parse(json);
}

export function rememberLastProjectId(projectId: string) {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    document.cookie = `${LAST_PROJECT_ID_KEY}=${projectId}; max-age=31536000; path=/`;
  }
}

export function mapInputKey(
  input: Record<string, unknown>,
  inputMap: Record<string, string>,
): Record<string, unknown> {
  if (typeof input !== "object" || input === null) return input;
  const newInput: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    const newKey = inputMap[key] || key;
    if (!(newKey in newInput)) {
      newInput[newKey] = value;
    }
  }

  return newInput;
}

export const trackIcons: Record<
  VideoTrack["type"] | "image",
  FunctionComponent
> = {
  video: VideoIcon,
  music: MusicIcon,
  voiceover: MicIcon,
  image: ImageIcon,
};

export function resolveDuration(item: MediaItem): number | null {
  if (!item) return null;

  const metadata = item.metadata;
  if (
    metadata &&
    "duration" in metadata &&
    typeof metadata.duration === "number"
  ) {
    return metadata.duration * 1000;
  }

  const data = item.output;
  if (!data) {
    const input = item.input;
    if (input) {
      if (typeof input.seconds_total === "number") {
        return input.seconds_total * 1000;
      }
      if (typeof input.duration === "number") {
        return input.duration * 1000;
      }
    }
    return null;
  }
  if ("seconds_total" in data && typeof data.seconds_total === "number") {
    return data.seconds_total * 1000;
  }
  if (
    "audio" in data &&
    typeof data.audio === "object" &&
    data.audio !== null &&
    "duration" in data.audio
  ) {
    const audio = data.audio as { duration: number };
    return audio.duration * 1000;
  }

  const input = item.input;
  if (input) {
    if (typeof input.seconds_total === "number") {
      return input.seconds_total * 1000;
    }
    if (typeof input.duration === "number") {
      return input.duration * 1000;
    }
  }

  return null;
}

/**
 * Depending on the output type of the job, the URL of the audio/image/video
 * might be represented by different properties. This utility function resolves
 * the URL of the media based on the output data.
 */
const blobUrlCache = new Map<string, string>();

export function getOrCreateBlobUrl(mediaId: string, blob: Blob): string {
  const cachedUrl = blobUrlCache.get(mediaId);
  if (cachedUrl) {
    return cachedUrl;
  }

  const url = URL.createObjectURL(blob);
  blobUrlCache.set(mediaId, url);
  return url;
}

export function revokeBlobUrl(mediaId: string): void {
  const url = blobUrlCache.get(mediaId);
  if (url) {
    URL.revokeObjectURL(url);
    blobUrlCache.delete(mediaId);
  }
}

/**
 * Downloads a URL and converts it to a Blob for persistent storage in IndexedDB.
 * This is used to store Runware media locally instead of relying on temporary URLs.
 */
export async function downloadUrlAsBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to download ${url}: ${response.status} ${response.statusText}`,
    );
  }
  return await response.blob();
}

export function resolveMediaUrl(item: MediaItem | undefined): string | null {
  if (!item) return null;

  // Always prefer blob over URLs (for both uploaded and generated media)
  if (item.blob) {
    return getOrCreateBlobUrl(item.id, item.blob);
  }

  if (item.kind === "uploaded") {
    return item.url;
  }

  const data = item.output;
  if (!data) return null;

  if (
    item.provider === "runware" &&
    typeof data === "object" &&
    data !== null
  ) {
    const runwareData = data as {
      imageURL?: string;
      videoURL?: string;
      audioURL?: string;
    };
    if (runwareData.imageURL) return runwareData.imageURL;
    if (runwareData.videoURL) return runwareData.videoURL;
    if (runwareData.audioURL) return runwareData.audioURL;
  }

  if (
    "images" in data &&
    Array.isArray(data.images) &&
    data.images.length > 0
  ) {
    return data.images[0].url;
  }

  const fileProperties = {
    image: 1,
    video: 1,
    audio: 1,
    audio_file: 1,
    audio_url: 1,
  };

  if (typeof data === "object" && data !== null) {
    const property = Object.keys(data).find((key) => {
      const value = (data as Record<string, unknown>)[key];
      return (
        key in fileProperties &&
        typeof value === "object" &&
        value !== null &&
        "url" in value
      );
    });

    if (property) {
      const propertyValue = (data as Record<string, { url: string }>)[property];
      return propertyValue.url;
    }
  }

  return null;
}

export function getAssetType(asset: InputAsset): "image" | "video" | "audio" {
  return typeof asset === "string" ? asset : asset.type;
}

export const assetKeyMap: Record<"image" | "video" | "audio", string> = {
  image: "image",
  video: "video_url",
  audio: "audio_url",
};

export function getAssetKey(asset: InputAsset): string {
  return typeof asset === "string"
    ? assetKeyMap[asset]
    : asset.key || assetKeyMap[asset.type];
}

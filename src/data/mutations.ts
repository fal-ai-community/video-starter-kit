import { AVAILABLE_ENDPOINTS, fal } from "@/lib/fal";
import { getRunwareClient, prepareRunwareImageAsset } from "@/lib/runware";
import { RUNWARE_ENDPOINTS } from "@/lib/runware-models";
import { downloadUrlAsBlob } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { db } from "./db";
import { queryKeys } from "./queries";
import type { MediaItem, VideoProject } from "./schema";

export const useProjectDeleter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => db.projects.delete(projectId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
};

export const useProjectUpdater = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (project: Partial<VideoProject>) =>
      db.projects.update(projectId, project),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    },
  });
};

export const useProjectCreator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (project: Omit<VideoProject, "id">) =>
      db.projects.create(project),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
};

type JobCreatorParams = {
  projectId: string;
  endpointId: string;
  mediaType: "video" | "image" | "voiceover" | "music";
  input: Record<string, any>;
};

export const useJobCreator = ({
  projectId,
  endpointId,
  mediaType,
  input,
}: JobCreatorParams) => {
  const queryClient = useQueryClient();
  const lastSubmittedFalInputRef = useRef<Record<string, unknown>>(input);

  const serializeForLog = (value: unknown) => {
    const replacer = (_: string, data: unknown) => {
      if (typeof File !== "undefined" && data instanceof File) {
        return {
          name: data.name,
          size: data.size,
          type: data.type,
        };
      }

      if (
        typeof Blob !== "undefined" &&
        data instanceof Blob &&
        !(typeof File !== "undefined" && data instanceof File)
      ) {
        return {
          size: data.size,
          type: data.type,
        };
      }

      return data;
    };

    try {
      return JSON.stringify(value, replacer, 2);
    } catch (error) {
      console.error("[DEBUG] Failed to serialize value for logging:", error);
      return String(value);
    }
  };

  const uploadValueIfNeeded = async (
    key: string,
    value: unknown,
  ): Promise<unknown> => {
    if (value === undefined || value === null) {
      return value;
    }

    if (Array.isArray(value)) {
      return Promise.all(
        value.map((item, index) =>
          uploadValueIfNeeded(`${key}[${index}]`, item),
        ),
      );
    }

    if (typeof value === "string" && value.startsWith("blob:")) {
      console.log(
        `[DEBUG] Uploading blob URL for key ${key} to fal.ai storage`,
      );
      try {
        const response = await fetch(value);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch blob URL (${response.status} ${response.statusText})`,
          );
        }

        const blob = await response.blob();
        const uploadedUrl = await fal.storage.upload(blob);
        console.log(
          `[DEBUG] Uploaded blob URL for key ${key} to fal.ai storage:`,
          uploadedUrl,
        );
        return uploadedUrl;
      } catch (error) {
        console.error(
          `[DEBUG] Failed to upload blob URL for key ${key} to fal.ai storage:`,
          error,
        );
        throw error;
      }
    }

    const isFile = typeof File !== "undefined" && value instanceof File;
    const isBlob =
      !isFile && typeof Blob !== "undefined" && value instanceof Blob;

    if (isFile || isBlob) {
      console.log(
        `[DEBUG] Uploading ${isFile ? "file" : "blob"} for key ${key} to fal.ai storage`,
      );
      try {
        const uploadedUrl = await fal.storage.upload(value as Blob);
        console.log(
          `[DEBUG] Uploaded ${isFile ? "file" : "blob"} for key ${key}:`,
          uploadedUrl,
        );
        return uploadedUrl;
      } catch (error) {
        console.error(
          `[DEBUG] Failed to upload ${isFile ? "file" : "blob"} for key ${key} to fal.ai storage:`,
          error,
        );
        throw error;
      }
    }

    return value;
  };

  const prepareFalInput = async (
    rawInput: Record<string, unknown>,
  ): Promise<Record<string, unknown>> => {
    let mappedInput = rawInput;
    if (endpoint?.inputMap) {
      const { mapInputKey } = await import("@/lib/utils");
      mappedInput = mapInputKey(rawInput, endpoint.inputMap);
    }

    const entries = await Promise.all(
      Object.entries(mappedInput).map(async ([key, value]) => {
        const resolvedValue = await uploadValueIfNeeded(key, value);
        
        if (key === "image_urls" && typeof resolvedValue === "string") {
          return [key, [resolvedValue]] as const;
        }
        
        return [key, resolvedValue] as const;
      }),
    );

    return entries.reduce<Record<string, unknown>>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
  };

  const allEndpoints = [...AVAILABLE_ENDPOINTS, ...RUNWARE_ENDPOINTS];
  const endpoint = allEndpoints.find((e) => e.endpointId === endpointId);
  const provider = endpoint?.provider || "fal";

  return useMutation({
    mutationFn: async () => {
      console.log("[DEBUG] useJobCreator called with endpointId:", endpointId);
      console.log("[DEBUG] provider determined as:", provider);

      if (provider === "fal") {
        console.log("[DEBUG] FAL - submitting with endpointId:", endpointId);
        console.log("[DEBUG] FAL - input payload:", serializeForLog(input));
        const preparedInput = await prepareFalInput(input);
        lastSubmittedFalInputRef.current = preparedInput;
        console.log(
          "[DEBUG] FAL - prepared input payload:",
          serializeForLog(preparedInput),
        );
        if (endpointId === "fal-ai/gemini-25-flash-image/edit") {
          const resolvedPrompt =
            "prompt" in preparedInput ? preparedInput.prompt : undefined;
          const resolvedImageUrl =
            ("image_url" in preparedInput
              ? preparedInput.image_url
              : undefined) ??
            ("image" in preparedInput ? preparedInput.image : undefined);
          console.log(
            "[DEBUG] FAL - Gemini edit resolved prompt:",
            resolvedPrompt,
          );
          console.log(
            "[DEBUG] FAL - Gemini edit resolved image URL:",
            resolvedImageUrl,
          );
        }
        try {
          const result = await fal.queue.submit(endpointId, {
            input: preparedInput,
          });
          console.log("[DEBUG] FAL submit result:", result);
          return { ...result, __input: preparedInput };
        } catch (error: any) {
          console.error("[DEBUG] FAL submit ERROR:", error);
          console.error("[DEBUG] FAL submit ERROR message:", error?.message);
          console.error("[DEBUG] FAL submit ERROR status:", error?.status);
          console.error("[DEBUG] FAL submit ERROR body:", error?.body);
          console.error("[DEBUG] FAL submit ERROR response:", error?.response);
          throw error;
        }
      }

      // Generate taskUUID for tracking
      const taskUUID = crypto.randomUUID();

      if (mediaType === "image") {
        const { buildRunwarePayload } = await import("@/lib/runware-capabilities");

        // Get endpoint info for default parameters
        const endpointInfo = endpoint ? {
          defaultSteps: endpoint.defaultSteps,
          defaultScheduler: endpoint.defaultScheduler,
          defaultAcceleration: endpoint.defaultAcceleration,
          defaultGuidanceScale: endpoint.defaultGuidanceScale,
          availableDimensions: endpoint.availableDimensions,
          supportedAspectRatios: (endpoint as any).supportedAspectRatios,
        } : undefined;

        let imageParams: any;
        try {
          imageParams = buildRunwarePayload(endpointId, input, "image", endpointInfo);
          // Add required fields that Runware API expects
          imageParams.taskType = "imageInference";
          imageParams.taskUUID = taskUUID;
        } catch (error: any) {
          console.error("[DEBUG] Runware buildRunwarePayload ERROR:", error?.message);
          throw error;
        }

        // Prepare seed image if needed (need client for this)
        const runwareSeedImageKeys = [
          "seedImage",
          "inputImage",
          "image",
          "image_url",
        ];
        let hasBlobOrFileImage = false;
        let blobOrFileImageKey = "";
        let blobOrFileImageValue: Blob | File | null = null;

        for (const key of runwareSeedImageKeys) {
          const candidate = input[key];
          if (!candidate) {
            continue;
          }

          // Skip invalid values (objects, arrays, etc that are not File/Blob)
          if (
            typeof candidate === "object" &&
            !(typeof File !== "undefined" && candidate instanceof File) &&
            !(typeof Blob !== "undefined" && candidate instanceof Blob)
          ) {
            console.warn(
              `[DEBUG] Skipping invalid ${key} value:`,
              candidate,
            );
            continue;
          }

          // String URLs are already handled by buildRunwarePayload above
          // which sets the correct parameter (seedImage or referenceImages) based on model capabilities
          if (typeof candidate === "string") {
            console.log(`[DEBUG] Found string ${key}:`, candidate.substring(0, 100), "- already handled by buildRunwarePayload");
            break;
          }

          if (typeof File !== "undefined" && candidate instanceof File) {
            console.log(`[DEBUG] Found File ${key}:`, candidate.name, "- will upload to Runware");
            hasBlobOrFileImage = true;
            blobOrFileImageKey = key;
            blobOrFileImageValue = candidate;
            break;
          }

          if (typeof Blob !== "undefined" && candidate instanceof Blob) {
            console.log(`[DEBUG] Found Blob ${key}, will upload to Runware`);
            hasBlobOrFileImage = true;
            blobOrFileImageKey = key;
            blobOrFileImageValue = candidate;
            break;
          }
        }

        console.log("[DEBUG] Runware requestImages - endpointId:", endpointId);

        // Create pending MediaItem IMMEDIATELY (before API call)
        // Use taskUUID as id so we can find it later for updates
        console.log("[DEBUG] Creating MediaItem with id=taskUUID:", taskUUID);
        await db.media.create({
          id: taskUUID, // Use taskUUID as id for easy updates
          projectId,
          createdAt: Date.now(),
          mediaType,
          kind: "generated",
          provider: "runware",
          endpointId,
          taskUUID,
          status: "pending",
          input,
        } as MediaItem); // Cast to bypass Omit<MediaItem, 'id'> type
        console.log("[DEBUG] MediaItem created with id:", taskUUID);

        // Note: Query invalidation will happen in onSuccess, not here
        // to avoid blocking the mutation from completing

        // Call API in background (non-blocking) - get client inside async
        (async () => {
          const runware = await getRunwareClient();
          if (!runware) {
            console.error("[DEBUG] Runware client not available");
            await db.media.update(taskUUID, { status: "failed" });
            await queryClient.invalidateQueries({
              queryKey: queryKeys.projectMediaItems(projectId),
            });
            return;
          }

          // Prepare blob/file image if needed - upload to Runware
          if (hasBlobOrFileImage && blobOrFileImageValue) {
            console.log("[DEBUG] Uploading File/Blob to Runware via imageUpload API");
            const uploadedUuid = await prepareRunwareImageAsset({
              value: blobOrFileImageValue,
              runware,
              cacheKey: blobOrFileImageKey,
            });
            console.log("[DEBUG] Upload complete, UUID:", uploadedUuid);

            // Determine which parameter to use based on model capabilities
            const { getModelCapabilities } = await import("@/lib/runware-capabilities");
            const capabilities = getModelCapabilities(endpointId);
            const paramName = capabilities.imageInputParam || "seedImage";

            if (paramName === "referenceImages") {
              imageParams.referenceImages = [uploadedUuid];
              console.log("[DEBUG] Set referenceImages:", imageParams.referenceImages);
            } else if (paramName === "inputs.image") {
              // Bria uses inputs.image
              imageParams.inputs = { image: uploadedUuid };
              console.log("[DEBUG] Set inputs.image:", imageParams.inputs.image);
            } else if (paramName === "inputs.references") {
              // Sourceful uses inputs.references
              imageParams.inputs = { references: [uploadedUuid] };
              console.log("[DEBUG] Set inputs.references:", imageParams.inputs.references);
            } else if (paramName === "seedImage+referenceImages") {
              // Ideogram img2img uses BOTH seedImage and referenceImages
              imageParams.seedImage = uploadedUuid;
              imageParams.referenceImages = [uploadedUuid];
              console.log("[DEBUG] Set seedImage + referenceImages:", uploadedUuid);
            } else {
              // Default: seedImage
              imageParams.seedImage = uploadedUuid;
              console.log("[DEBUG] Set seedImage:", imageParams.seedImage);
            }
          }

          // Log final params AFTER preparing assets
          console.log(
            "[DEBUG] Runware requestImages - final params:",
            JSON.stringify(imageParams, null, 2),
          );

          const result = await runware.requestImages(imageParams);
          console.log("[DEBUG] requestImages returned (before .then):", result);
          console.log("[DEBUG] result type:", typeof result);
          console.log("[DEBUG] result is array:", Array.isArray(result));
          return result;
        })()
          .then(async (response) => {
            console.log(
              "[DEBUG] .then() callback started, response:",
              !!response,
            );
            if (!response) {
              console.log("[DEBUG] No response, exiting .then()");
              return;
            }
            console.log(
              "[DEBUG] Runware requestImages - SUCCESS:",
              JSON.stringify(response, null, 2),
            );

            // Check if response contains an error
            const responseArray = Array.isArray(response)
              ? response
              : [response];
            const firstResult = responseArray[0] as any;

            console.log("[DEBUG] firstResult extracted:", {
              hasError: !!firstResult?.error,
              hasImageURL: !!firstResult?.imageURL,
              taskUUID: firstResult?.taskUUID,
            });

            if (firstResult?.error || firstResult?.status === "error") {
              const errorObj = firstResult.error || firstResult;
              const errorMessage =
                errorObj.message ||
                errorObj.responseContent ||
                "Image generation failed";
              console.error("[DEBUG] requestImages returned error:", errorObj);

              // Update MediaItem to failed status
              await db.media.update(taskUUID, { status: "failed" });
              await queryClient.invalidateQueries({
                queryKey: queryKeys.projectMediaItems(projectId),
              });
              return;
            }

            // Check if completed immediately
            const isCompleted = firstResult?.imageURL;

            console.log("[DEBUG] Is completed immediately?", isCompleted);

            if (isCompleted) {
              console.log(
                "[DEBUG] Updating MediaItem to completed, taskUUID:",
                taskUUID,
              );
              // Update to completed status with cost metadata
              const updateResult = await db.media.update(taskUUID, {
                status: "completed",
                output: firstResult,
                metadata: {
                  cost: firstResult.cost,
                  taskUUID: firstResult.taskUUID,
                },
              });
              console.log("[DEBUG] MediaItem update result:", updateResult);

              // Download blob in background
              if (firstResult.imageURL) {
                downloadUrlAsBlob(firstResult.imageURL)
                  .then((blob) => db.media.update(taskUUID, { blob }))
                  .catch((error) =>
                    console.error("Failed to download blob:", error),
                  );
              }
            }

            // Polling will handle pending tasks
            console.log(
              "[DEBUG] Invalidating queries for projectId:",
              projectId,
            );
            await queryClient.invalidateQueries({
              queryKey: queryKeys.projectMediaItems(projectId),
            });
            console.log("[DEBUG] Queries invalidated successfully");
          })
          .catch(async (error) => {
            console.error("[DEBUG] Runware requestImages - ERROR - FULL OBJECT:");
            console.error("[DEBUG] error:", error);
            console.error("[DEBUG] error type:", typeof error);
            console.error("[DEBUG] error constructor:", error?.constructor?.name);
            console.error("[DEBUG] error toString():", error?.toString());

            // Try to get all properties
            if (error && typeof error === 'object') {
              console.error("[DEBUG] error keys:", Object.keys(error));
              console.error("[DEBUG] error values:", Object.values(error));
              console.error("[DEBUG] error JSON:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
            }

            console.error("[DEBUG] error.message:", error?.message);
            console.error("[DEBUG] error.status:", error?.status);
            console.error("[DEBUG] error.code:", error?.code);
            console.error("[DEBUG] error.response:", error?.response);
            console.error("[DEBUG] error.data:", error?.data);
            console.error("[DEBUG] error.error:", error?.error);

            await db.media.update(taskUUID, { status: "failed" });
            await queryClient.invalidateQueries({
              queryKey: queryKeys.projectMediaItems(projectId),
            });
          });

        // Return immediately - item already created
        return { taskUUID, immediate: true };
      }
      if (mediaType === "video") {
        const { getModelCapabilities } = await import("@/lib/runware-capabilities");
        const capabilities = getModelCapabilities(endpointId);
        
        // Find endpoint configuration to get defaults
        const endpoint = RUNWARE_ENDPOINTS.find(
          (ep) => ep.endpointId === endpointId,
        );

        // Use endpoint defaults or fallback to generic defaults
        const defaultDuration = endpoint?.defaultDuration || 5;
        const defaultWidth = endpoint?.defaultWidth || 1920;
        const defaultHeight = endpoint?.defaultHeight || 1080;
        const defaultFps = endpoint?.defaultFps || 24;

        const isGoogleVeo = endpointId.startsWith("google:");

        const videoParams: any = {
          positivePrompt: input.positivePrompt || input.prompt || "",
          model: endpointId,
          duration: input.duration || defaultDuration,
          fps: input.fps || defaultFps,
          height: input.height || defaultHeight,
          width: input.width || defaultWidth,
          outputFormat: input.outputFormat || "mp4",
          outputType: "URL",
          numberResults: input.numberResults || 1,
          includeCost:
            input.includeCost !== undefined ? input.includeCost : true,
          deliveryMethod: "async",
        };

        if (capabilities.outputQuality) {
          videoParams.outputQuality = input.outputQuality || 99;
        }

        // Add providerSettings for Google models
        if (isGoogleVeo) {
          videoParams.providerSettings = {
            google: {
              enhancePrompt:
                input.enhancePrompt !== undefined ? input.enhancePrompt : true,
              generateAudio:
                input.generateAudio !== undefined ? input.generateAudio : true,
            },
          };
        }

        // Prepare inputImage if needed (File/Blob need upload)
        let hasInputImageBlobOrFile = false;
        let inputImageBlobOrFileValue: Blob | File | null = null;

        if (input.inputImage) {
          const inputImageValue = input.inputImage;

          // Skip invalid values (objects, arrays, etc that are not File/Blob)
          if (
            typeof inputImageValue === "object" &&
            !(typeof File !== "undefined" && inputImageValue instanceof File) &&
            !(typeof Blob !== "undefined" && inputImageValue instanceof Blob)
          ) {
            console.warn(
              "[DEBUG] Skipping invalid inputImage value:",
              inputImageValue,
            );
          } else if (typeof inputImageValue === "string") {
            console.log("[DEBUG] Found string inputImage:", inputImageValue.substring(0, 100));
            videoParams.inputImage = inputImageValue;
          } else if (
            typeof File !== "undefined" &&
            inputImageValue instanceof File
          ) {
            console.log("[DEBUG] Found File inputImage:", inputImageValue.name, "- will upload to Runware");
            hasInputImageBlobOrFile = true;
            inputImageBlobOrFileValue = inputImageValue;
          } else if (
            typeof Blob !== "undefined" &&
            inputImageValue instanceof Blob
          ) {
            console.log("[DEBUG] Found Blob inputImage, will upload to Runware");
            hasInputImageBlobOrFile = true;
            inputImageBlobOrFileValue = inputImageValue;
          }
        }

        console.log("[DEBUG] Calling runware.videoInference");

        // Create pending MediaItem IMMEDIATELY (BEFORE getting runware client)
        // Use taskUUID as id so we can find it later for updates
        await db.media.create({
          id: taskUUID, // Use taskUUID as id for easy updates
          projectId,
          createdAt: Date.now(),
          mediaType,
          kind: "generated",
          provider: "runware",
          endpointId,
          taskUUID,
          status: "pending",
          input,
        } as MediaItem); // Cast to bypass Omit<MediaItem, 'id'> type

        // Note: Query invalidation will happen in onSuccess, not here
        // to avoid blocking the mutation from completing

        // Call API in background (non-blocking) - get client inside async
        (async () => {
          const runware = await getRunwareClient();
          if (!runware) {
            console.error("[DEBUG] Runware client not available");
            await db.media.update(taskUUID, { status: "failed" });
            await queryClient.invalidateQueries({
              queryKey: queryKeys.projectMediaItems(projectId),
            });
            return;
          }

          // Upload inputImage File/Blob if needed
          if (hasInputImageBlobOrFile && inputImageBlobOrFileValue) {
            console.log("[DEBUG] Uploading inputImage File/Blob to Runware via imageUpload API");
            videoParams.inputImage = await prepareRunwareImageAsset({
              value: inputImageBlobOrFileValue,
              runware,
              cacheKey: "inputImage",
            });
            console.log("[DEBUG] Upload complete, inputImage UUID:", videoParams.inputImage);
          }

          // Log final params AFTER preparing assets
          console.log(
            "[DEBUG] Runware videoInference - final params:",
            JSON.stringify(videoParams, null, 2),
          );

          return runware.videoInference(videoParams);
        })()
          .then(async (response) => {
            if (!response) return;
            console.log("[DEBUG] videoInference response:", response);

            // Check if response contains an error
            const responseArray = Array.isArray(response)
              ? response
              : [response];
            const firstResult = responseArray[0] as any;

            if (firstResult?.error || firstResult?.status === "error") {
              const errorObj = firstResult.error || firstResult;
              const errorMessage =
                errorObj.message ||
                errorObj.responseContent ||
                "Video generation failed";
              console.error("[DEBUG] videoInference returned error:", errorObj);

              // Update MediaItem to failed status
              await db.media.update(taskUUID, { status: "failed" });
              await queryClient.invalidateQueries({
                queryKey: queryKeys.projectMediaItems(projectId),
              });

              // Show error toast manually (mutation already succeeded)
              throw new Error(errorMessage);
            }

            // Check if completed immediately
            const isCompleted =
              firstResult && (firstResult.videoURL || firstResult.imageURL);

            if (isCompleted) {
              // Update to completed status with cost metadata
              await db.media.update(taskUUID, {
                status: "completed",
                output: firstResult,
                metadata: {
                  cost: firstResult.cost,
                  taskUUID: firstResult.taskUUID,
                },
              });

              // Download blob and generate thumbnail in background
              const mediaUrl = firstResult.videoURL || firstResult.imageURL;
              if (mediaUrl) {
                (async () => {
                  try {
                    const blob = await downloadUrlAsBlob(mediaUrl);
                    await db.media.update(taskUUID, { blob });

                    // Generate thumbnail for videos
                    if (firstResult.videoURL && mediaType === "video") {
                      const { extractVideoThumbnail } = await import(
                        "@/lib/ffmpeg"
                      );
                      const { getOrCreateBlobUrl } = await import(
                        "@/lib/utils"
                      );
                      const blobUrl = getOrCreateBlobUrl(taskUUID, blob);
                      const thumbnailBlob =
                        await extractVideoThumbnail(blobUrl);
                      if (thumbnailBlob) {
                        console.log(
                          "[DEBUG] Video thumbnail generated in background:",
                          {
                            size: thumbnailBlob.size,
                            type: thumbnailBlob.type,
                          },
                        );
                        await db.media.update(taskUUID, { thumbnailBlob });
                        await queryClient.invalidateQueries({
                          queryKey: queryKeys.projectMediaItems(projectId),
                        });
                      }
                    }
                  } catch (error) {
                    console.error(
                      "Failed to download blob or generate thumbnail:",
                      error,
                    );
                  }
                })();
              }
            }

            // Polling will handle pending tasks
            await queryClient.invalidateQueries({
              queryKey: queryKeys.projectMediaItems(projectId),
            });
          })
          .catch(async (error) => {
            console.error("[DEBUG] videoInference ERROR:", error);
            await db.media.update(taskUUID, { status: "failed" });
            await queryClient.invalidateQueries({
              queryKey: queryKeys.projectMediaItems(projectId),
            });
          });

        // Return immediately - item already created
        return { taskUUID, immediate: true };
      }

      if (mediaType === "music" || mediaType === "voiceover") {
        const audioParams = {
          positivePrompt: input.prompt || "",
          model: endpointId,
          duration: input.duration || 30,
          outputFormat: "MP3" as const,
          outputType: "URL" as const,
          audioSettings: {
            bitrate: 128,
            sampleRate: 44100,
          },
        };

        console.log(
          "[DEBUG] Calling runware.audioInference with:",
          audioParams,
        );

        // Create pending MediaItem IMMEDIATELY (BEFORE getting runware client)
        // Use taskUUID as id so we can find it later for updates
        await db.media.create({
          id: taskUUID, // Use taskUUID as id for easy updates
          projectId,
          createdAt: Date.now(),
          mediaType,
          kind: "generated",
          provider: "runware",
          endpointId,
          taskUUID,
          status: "pending",
          input,
        } as MediaItem); // Cast to bypass Omit<MediaItem, 'id'> type

        // Note: Query invalidation will happen in onSuccess, not here
        // to avoid blocking the mutation from completing

        // Call API in background (non-blocking) - get client inside async
        (async () => {
          const runware = await getRunwareClient();
          if (!runware) {
            console.error("[DEBUG] Runware client not available");
            await db.media.update(taskUUID, { status: "failed" });
            await queryClient.invalidateQueries({
              queryKey: queryKeys.projectMediaItems(projectId),
            });
            return;
          }

          return runware.audioInference(audioParams);
        })()
          .then(async (response) => {
            if (!response) return;
            console.log("[DEBUG] audioInference response:", response);
            console.log(
              "[DEBUG] audioInference response stringified:",
              JSON.stringify(response, null, 2),
            );

            // Check if response contains an error
            const responseArray = Array.isArray(response)
              ? response
              : [response];
            const firstResult = responseArray[0] as any;

            if (firstResult?.error || firstResult?.status === "error") {
              const errorObj = firstResult.error || firstResult;
              const errorMessage =
                errorObj.message ||
                errorObj.responseContent ||
                "Audio generation failed";
              console.error("[DEBUG] audioInference returned error:", errorObj);

              // Update MediaItem to failed status
              await db.media.update(taskUUID, { status: "failed" });
              await queryClient.invalidateQueries({
                queryKey: queryKeys.projectMediaItems(projectId),
              });
              return;
            }

            // Check if completed immediately
            const isCompleted = firstResult?.audioURL;

            if (isCompleted) {
              // Update to completed status with cost metadata
              await db.media.update(taskUUID, {
                status: "completed",
                output: firstResult,
                metadata: {
                  cost: firstResult.cost,
                  taskUUID: firstResult.taskUUID,
                },
              });

              // Download blob in background
              if (firstResult.audioURL) {
                downloadUrlAsBlob(firstResult.audioURL)
                  .then((blob) => db.media.update(taskUUID, { blob }))
                  .catch((error) =>
                    console.error("Failed to download blob:", error),
                  );
              }
            }

            // Polling will handle pending tasks
            await queryClient.invalidateQueries({
              queryKey: queryKeys.projectMediaItems(projectId),
            });
          })
          .catch(async (error) => {
            console.error("[DEBUG] audioInference ERROR:", error);
            await db.media.update(taskUUID, { status: "failed" });
            await queryClient.invalidateQueries({
              queryKey: queryKeys.projectMediaItems(projectId),
            });
          });

        // Return immediately - item already created
        return { taskUUID, immediate: true };
      }

      throw new Error(`Unsupported media type: ${mediaType}`);
    },
    onSuccess: async (data: {
      taskUUID?: string;
      data?: unknown;
      request_id?: string;
      __input?: Record<string, unknown>;
      immediate?: boolean;
    }) => {
      if (provider === "fal") {
        console.log("[DEBUG] FAL onSuccess data:", data);
        console.log("[DEBUG] FAL request_id:", data.request_id);
        const storedInput =
          data.__input ?? lastSubmittedFalInputRef.current ?? input;
        await db.media.create({
          projectId,
          createdAt: Date.now(),
          mediaType,
          kind: "generated",
          provider: "fal",
          endpointId,
          requestId: data.request_id,
          status: "pending",
          input: storedInput,
        });
      } else if (provider === "runware") {
        // If immediate flag is set, MediaItem already created in mutationFn
        if (data.immediate) {
          console.log(
            "[DEBUG] Runware onSuccess - item already created, invalidating queries",
          );
          // Invalidate queries to trigger UI update
          await queryClient.invalidateQueries({
            queryKey: queryKeys.projectMediaItems(projectId),
          });
          return;
        }

        console.log(
          "[DEBUG] Runware onSuccess - full data:",
          JSON.stringify(data, null, 2),
        );
        const result = (data as any).data?.[0];
        const isCompleted =
          result &&
          (result.imageURL ||
            result.videoURL ||
            result.audioURL ||
            result.audioDataURI ||
            result.audioBase64Data);

        if (isCompleted) {
          console.log("[DEBUG] Runware task completed immediately:", result);

          // Create media item immediately without blocking on blob download
          // Blob will be downloaded in background by media-panel polling
          await db.media.create({
            projectId,
            createdAt: Date.now(),
            mediaType,
            kind: "generated",
            provider: "runware",
            endpointId,
            taskUUID: result.taskUUID || data.taskUUID,
            status: "completed",
            output: result,
            input,
            metadata: {
              cost: result.cost,
              taskUUID: result.taskUUID || data.taskUUID,
            },
          });

          // Download blob in background (non-blocking)
          const mediaUrl =
            result.videoURL || result.imageURL || result.audioURL;
          if (mediaUrl) {
            downloadUrlAsBlob(mediaUrl)
              .then((blob) => {
                console.log("[DEBUG] Downloaded blob in background:", {
                  size: blob.size,
                  type: blob.type,
                });
                return db.media.update(result.taskUUID || data.taskUUID, {
                  blob,
                });
              })
              .catch((error) => {
                console.error(
                  "[DEBUG] Failed to download Runware media in background:",
                  error,
                );
              });
          }
        } else {
          console.log("[DEBUG] Runware task pending, taskUUID:", data.taskUUID);
          await db.media.create({
            projectId,
            createdAt: Date.now(),
            mediaType,
            kind: "generated",
            provider: "runware",
            endpointId,
            taskUUID: data.taskUUID,
            status: "pending",
            input,
          });
        }
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.projectMediaItems(projectId),
      });
    },
  });
};

import {
  type QueryClient,
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { db } from "./db";
import {
  type MediaItem,
  PROJECT_PLACEHOLDER,
  type VideoKeyFrame,
  type VideoTrack,
} from "./schema";

export const queryKeys = {
  projects: ["projects"],
  project: (projectId: string) => ["project", projectId],
  projectMediaItems: (projectId: string) => ["mediaItems", projectId],
  projectMedia: (projectId: string, jobId: string) => [
    "media",
    projectId,
    jobId,
  ],
  projectTracks: (projectId: string) => ["tracks", projectId],
  projectPreview: (projectId: string) => ["preview", projectId],
};

export const refreshVideoCache = async (
  queryClient: QueryClient,
  projectId: string,
) =>
  Promise.all([
    queryClient.invalidateQueries({
      queryKey: queryKeys.projectTracks(projectId),
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.projectPreview(projectId),
    }),
    queryClient.invalidateQueries({
      queryKey: ["frames"],
    }),
  ]);

export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: queryKeys.project(projectId),
    queryFn: async () =>
      (await db.projects.find(projectId)) ?? PROJECT_PLACEHOLDER,
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: db.projects.list,
  });
};

export const useProjectMediaItems = (projectId: string) => {
  return useQuery({
    queryKey: queryKeys.projectMediaItems(projectId),
    queryFn: () => db.media.mediaByProject(projectId),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });
};

export type VideoCompositionData = {
  tracks: VideoTrack[];
  frames: Record<string, VideoKeyFrame[]>;
  mediaItems: Record<string, MediaItem>;
};

export const EMPTY_VIDEO_COMPOSITION: VideoCompositionData = {
  tracks: [],
  frames: {},
  mediaItems: {},
};

export const useVideoComposition = (projectId: string) =>
  useQuery({
    queryKey: queryKeys.projectPreview(projectId),
    queryFn: async () => {
      const tracks = await db.tracks.tracksByProject(projectId);
      const frames = (
        await Promise.all(
          tracks.map((track) => db.keyFrames.keyFramesByTrack(track.id)),
        )
      ).flat();
      const mediaItems = await db.media.mediaByProject(projectId);
      return {
        tracks,
        frames: Object.fromEntries(
          tracks.map((track) => [
            track.id,
            frames.filter((f) => f.trackId === track.id),
          ]),
        ),
        mediaItems: Object.fromEntries(
          mediaItems.map((item) => [item.id, item]),
        ),
      } satisfies VideoCompositionData;
    },
  });

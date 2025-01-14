export type AspectRatio = "16:9" | "9:16" | "1:1";

export type VideoProject = {
  id: string;
  title: string;
  description: string;
  aspectRatio: AspectRatio;
};

export const PROJECT_PLACEHOLDER: VideoProject = {
  id: "",
  title: "",
  description: "",
  aspectRatio: "16:9",
};

export type VideoTrackType = "video" | "music" | "voiceover";

export const TRACK_TYPE_ORDER: Record<VideoTrackType, number> = {
  video: 1,
  music: 2,
  voiceover: 3,
};

export type VideoTrack = {
  id: string;
  locked: boolean;
  label: string;
  type: VideoTrackType;
  projectId: string;
};

export const MAIN_VIDEO_TRACK: VideoTrack = {
  id: "main",
  locked: true,
  label: "Main",
  type: "video",
  projectId: PROJECT_PLACEHOLDER.id,
};

export type VideoKeyFrame = {
  id: string;
  timestamp: number;
  duration: number;
  trackId: string;
  data: KeyFrameData;
};

export type KeyFrameData = {
  type: "prompt" | "image" | "video" | "voiceover" | "music";
  mediaId: string;
} & (
  | {
      type: "prompt";
      prompt: string;
    }
  | {
      type: "image";
      prompt: string;
      url: string;
    }
  | {
      type: "video";
      prompt: string;
      url: string;
    }
);

export type MediaItem = {
  id: string;
  kind: "generated" | "uploaded";
  endpointId?: string;
  requestId?: string;
  projectId: string;
  mediaType: "image" | "video" | "music" | "voiceover";
  status: "pending" | "running" | "completed" | "failed";
  createdAt: number;
  input?: Record<string, any>;
  output?: Record<string, any>;
  url?: string;
  metadata?: Record<string, any>; // TODO: Define the metadata schema
} & (
  | {
      kind: "generated";
      endpointId: string;
      requestId: string;
      input: Record<string, any>;
      output?: Record<string, any>;
    }
  | {
      kind: "uploaded";
      url: string;
    }
);

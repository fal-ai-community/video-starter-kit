import { openDB } from "idb";
import type {
  MediaItem,
  VideoKeyFrame,
  VideoProject,
  VideoTrack,
} from "./schema";

function open() {
  return openDB("ai-vstudio-db-v2", 1, {
    upgrade(db) {
      db.createObjectStore("projects", { keyPath: "id" });

      const trackStore = db.createObjectStore("tracks", { keyPath: "id" });
      trackStore.createIndex("by_projectId", "projectId");

      const keyFrameStore = db.createObjectStore("keyFrames", {
        keyPath: "id",
      });
      keyFrameStore.createIndex("by_trackId", "trackId");

      const mediaStore = db.createObjectStore("media_items", {
        keyPath: "id",
      });
      mediaStore.createIndex("by_projectId", "projectId");
    },
  });
}

export const db = {
  projects: {
    async find(id: string): Promise<VideoProject | null> {
      const db = await open();
      return db.get("projects", id);
    },
    async list(): Promise<VideoProject[]> {
      const db = await open();
      return db.getAll("projects");
    },
    async create(project: Omit<VideoProject, "id">) {
      const db = await open();
      const tx = db.transaction("projects", "readwrite");
      const result = await tx.store.put({
        id: crypto.randomUUID(),
        ...project,
      });
      await tx.done;
      return result;
    },
    async update(id: string, project: Partial<VideoProject>) {
      const db = await open();
      const existing = await db.get("projects", id);
      if (!existing) return;
      return db.put("projects", {
        ...existing,
        ...project,
        id,
      });
    },
  },

  tracks: {
    async find(id: string): Promise<VideoTrack | null> {
      const db = await open();
      return db.get("tracks", id);
    },
    async tracksByProject(projectId: string): Promise<VideoTrack[]> {
      const db = await open();
      return db.getAllFromIndex("tracks", "by_projectId", projectId);
    },
    async create(track: Omit<VideoTrack, "id">) {
      const db = await open();
      return db.put("tracks", {
        id: crypto.randomUUID(),
        ...track,
      });
    },
  },

  keyFrames: {
    async find(id: string): Promise<VideoKeyFrame | null> {
      const db = await open();
      return db.get("keyFrames", id);
    },
    async keyFramesByTrack(trackId: string): Promise<VideoKeyFrame[]> {
      const db = await open();
      const result = await db.getAllFromIndex(
        "keyFrames",
        "by_trackId",
        trackId,
      );
      return result.toSorted((a, b) => a.timestamp - b.timestamp);
    },
    async create(keyFrame: Omit<VideoKeyFrame, "id">) {
      const db = await open();
      return db.put("keyFrames", {
        id: crypto.randomUUID(),
        ...keyFrame,
        startOffset: keyFrame.startOffset ?? 0,
      });
    },
    async update(id: string, keyFrame: Partial<VideoKeyFrame>) {
      const db = await open();
      const existing = await db.get("keyFrames", id);
      if (!existing) return;

      return db.put("keyFrames", {
        ...existing,
        ...keyFrame,
        id,
      });
    },
    async delete(id: string) {
      const db = await open();
      return db.delete("keyFrames", id);
    },
  },

  media: {
    async find(id: string): Promise<MediaItem | null> {
      const db = await open();
      return db.get("media_items", id);
    },
    async mediaByProject(projectId: string): Promise<MediaItem[]> {
      const db = await open();
      const results = await db.getAllFromIndex(
        "media_items",
        "by_projectId",
        projectId,
      );

      return results.toSorted((a, b) => b.createdAt - a.createdAt);
    },
    async create(media: Omit<MediaItem, "id">) {
      const db = await open();
      const tx = db.transaction("media_items", "readwrite");
      const id = crypto.randomUUID().toString();
      const result = await tx.store.put({
        id,
        ...media,
      });
      await tx.done;
      return result;
    },
    async update(id: string, media: Partial<MediaItem>) {
      const db = await open();
      const existing = await db.get("media_items", id);
      if (!existing) return;
      const tx = db.transaction("media_items", "readwrite");
      const result = await tx.store.put({
        ...existing,
        ...media,
        id,
      });
      await tx.done;
      return result;
    },
    async delete(id: string) {
      const db = await open();
      const media: MediaItem | null = await db.get("media_items", id);
      if (!media) return;
      // Delete associated keyframes
      const tracks = await db.getAllFromIndex(
        "tracks",
        "by_projectId",
        media.projectId,
      );
      const trackIds = tracks.map((track) => track.id);
      const frames = (
        await Promise.all(
          trackIds.map(
            (trackId) =>
              db.getAllFromIndex("keyFrames", "by_trackId", trackId) as Promise<
                VideoKeyFrame[]
              >,
          ),
        )
      )
        .flatMap((f) => f)
        .filter((f) => f.data.mediaId === id)
        .map((f) => f.id);
      const tx = db.transaction(["media_items", "keyFrames"], "readwrite");
      await Promise.all(
        frames.map((id) => tx.objectStore("keyFrames").delete(id)),
      );
      await tx.objectStore("media_items").delete(id);
      await tx.done;
    },
  },
} as const;

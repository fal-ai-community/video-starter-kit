import { openDB } from "idb";
import {
  type MediaItem,
  PROJECT_PLACEHOLDER,
  type VideoKeyFrame,
  type VideoProject,
  type VideoTrack,
} from "./schema";

const dbPromise = openDB("ai-vstudio-db-v2", 1, {
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
  blocked() {
    console.warn(
      "[IndexedDB] Database upgrade blocked - another connection is open",
    );
  },
  blocking() {
    console.warn("[IndexedDB] This connection is blocking a version upgrade");
  },
  terminated() {
    console.error("[IndexedDB] Database connection terminated unexpectedly");
  },
});

function open() {
  return dbPromise;
}

export const db = {
  projects: {
    async find(id: string): Promise<VideoProject | null> {
      const db = await open();
      const project = await db.get("projects", id);
      if (!project) return null;
      return {
        ...PROJECT_PLACEHOLDER,
        ...project,
        duration:
          typeof project.duration === "number"
            ? project.duration
            : PROJECT_PLACEHOLDER.duration,
      } satisfies VideoProject;
    },
    async list(): Promise<VideoProject[]> {
      const db = await open();
      const projects = await db.getAll("projects");
      return projects.map((project) => ({
        ...PROJECT_PLACEHOLDER,
        ...project,
        duration:
          typeof project.duration === "number"
            ? project.duration
            : PROJECT_PLACEHOLDER.duration,
      })) as VideoProject[];
    },
    async create(project: Omit<VideoProject, "id">) {
      const db = await open();
      return db.put("projects", {
        id: crypto.randomUUID(),
        ...project,
        duration:
          typeof project.duration === "number"
            ? project.duration
            : PROJECT_PLACEHOLDER.duration,
      });
    },
    async update(id: string, project: Partial<VideoProject>) {
      const db = await open();
      const existing = await db.get("projects", id);
      if (!existing) return;
      return db.put("projects", {
        ...existing,
        ...project,
        id,
        duration:
          typeof (project.duration ?? existing.duration) === "number"
            ? (project.duration ?? existing.duration)
            : PROJECT_PLACEHOLDER.duration,
      });
    },
    async delete(id: string) {
      const db = await open();

      const tracks = await db.getAllFromIndex("tracks", "by_projectId", id);
      const trackIds = tracks.map((track) => track.id);

      const frames = (
        await Promise.all(
          trackIds.map((trackId) =>
            db.getAllFromIndex("keyFrames", "by_trackId", trackId),
          ),
        )
      ).flat();

      const mediaItems = await db.getAllFromIndex(
        "media_items",
        "by_projectId",
        id,
      );

      // Clean up blob URLs for all media items that have blobs (both uploaded and generated)
      for (const media of mediaItems) {
        const { revokeBlobUrl } = await import("@/lib/utils");
        if (media.blob) {
          revokeBlobUrl(media.id);
        }
        if (media.thumbnailBlob) {
          revokeBlobUrl(`${media.id}-thumbnail`);
        }
      }

      const tx = db.transaction(
        ["projects", "tracks", "keyFrames", "media_items"],
        "readwrite",
      );

      await Promise.all([
        ...frames.map((f) => tx.objectStore("keyFrames").delete(f.id)),
        ...tracks.map((t) => tx.objectStore("tracks").delete(t.id)),
        ...mediaItems.map((m) => tx.objectStore("media_items").delete(m.id)),
        tx.objectStore("projects").delete(id),
      ]);

      await tx.done;
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
      const id = crypto.randomUUID().toString();
      return db.put("media_items", {
        id,
        ...media,
      });
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

      // Clean up blob URLs if this media item has blobs (both uploaded and generated)
      const { revokeBlobUrl } = await import("@/lib/utils");
      if (media.blob) {
        revokeBlobUrl(id);
      }
      if (media.thumbnailBlob) {
        revokeBlobUrl(`${id}-thumbnail`);
      }

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
        .flat()
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

"use client";

import { Slider } from "@/components/ui/slider";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { MediaItem } from "@/data/schema";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  PlusIcon,
  UploadIcon,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { MediaItemRow } from "./media-panel";

interface TimelineImage {
  id: string;
  src: string;
  startFrame: number;
  name: string;
}

interface ImageLibraryItem {
  id: string;
  src: string | File;
  name: string;
}

interface VideoFrameSelectorProps {
  minFrame?: number;
  maxFrame?: number;
  mediaItems: MediaItem[];
  onChange: (
    images: {
      start_frame_num: number;
      image_url: string | File;
    }[],
  ) => void;
}

export default function VideoFrameSelector({
  minFrame = 0,
  maxFrame = 120,
  mediaItems,
  onChange,
}: VideoFrameSelectorProps) {
  const [open, setOpen] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(minFrame);
  const [images, _setImages] = useState<TimelineImage[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setImages = (images: TimelineImage[]) => {
    _setImages(images);
    onChange(
      images.map((img) => ({
        start_frame_num: img.startFrame,
        image_url: img.src,
      })),
    );
  };

  const addImageToTimeline = (libraryItem: ImageLibraryItem) => {
    const newImage: TimelineImage = {
      id: `timeline-${Date.now()}`,
      src: libraryItem.src as string,
      startFrame: currentFrame,
      name: libraryItem.name,
    };

    setImages([...images, newImage]);
    setIsDialogOpen(false);
  };

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const getFrameFromMousePosition = (clientX: number): number => {
    if (!timelineRef.current) return currentFrame;

    const frameMultiplier = 8;
    const timelineRect = timelineRef.current.getBoundingClientRect();
    const relativeX = clientX - timelineRect.left;
    const framePosition =
      (relativeX / timelineRect.width) * (maxFrame - minFrame) + minFrame;

    const roundedFrame =
      Math.round(framePosition / frameMultiplier) * frameMultiplier;

    return Math.max(minFrame, Math.min(maxFrame, roundedFrame));
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[draggable="true"]')) return;

    const newFrame = getFrameFromMousePosition(e.clientX);
    setCurrentFrame(newFrame);
  };

  const handlePlayheadDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingPlayhead(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newFrame = getFrameFromMousePosition(moveEvent.clientX);
      setCurrentFrame(newFrame);
    };

    const handleMouseUp = () => {
      setIsDraggingPlayhead(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleSelectMedia = (item: MediaItem) => {
    addImageToTimeline({
      id: item.id,
      src: item.output?.images?.[0]?.url || item.url || "",
      name: item.output?.prompt || "Untitled",
    });
  };

  const renderTimelineMarkers = () => {
    const markers = [];
    const majorStep = Math.ceil((maxFrame - minFrame) / 12);

    for (let i = minFrame; i <= maxFrame; i += majorStep) {
      markers.push(
        <div
          key={`major-${i}`}
          className="flex flex-col items-center"
          style={{
            position: "absolute",
            left: `${((i - minFrame) / (maxFrame - minFrame)) * 100}%`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="h-6 w-0.5 bg-neutral-600" />
          <span className="text-xs text-neutral-500">{i}</span>
        </div>,
      );
    }

    const minorStep = Math.ceil(majorStep / 5);
    for (let i = minFrame; i <= maxFrame; i += minorStep) {
      if ((i - minFrame) % majorStep !== 0) {
        markers.push(
          <div
            key={`minor-${i}`}
            className="flex flex-col items-center rounded"
            style={{
              position: "absolute",
              left: `${((i - minFrame) / (maxFrame - minFrame)) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="h-3 w-[1px] bg-neutral-500/50" />
          </div>,
        );
      }
    }

    return markers;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addImageToTimeline({
      id: `file-${Date.now()}`,
      src: file,
      name: file.name,
    });
  };

  const handleTimelineDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={cn(
        "w-full mx-auto  border-t border-neutral-800 py-3",
        open ? "min-h-52" : "",
      )}
    >
      {/* Header */}
      <button
        type="button"
        className="flex mb-6 justify-between items-center select-none w-full text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Select Image for Frames</span>
        </div>
        <Button variant="ghost" size="icon" className="text-white">
          {open ? (
            <ChevronUp className="h-6 w-6" />
          ) : (
            <ChevronDown className="h-6 w-6" />
          )}
        </Button>
      </button>
      {open && (
        <>
          <Slider
            value={[currentFrame]}
            min={minFrame}
            max={maxFrame}
            step={8}
            onValueChange={(value) => setCurrentFrame(value[0])}
            className="hidden"
          />

          <div className="w-full">
            <div
              ref={timelineRef}
              className="relative h-2 -mb-1 cursor-pointer"
              onClick={handleTimelineClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleTimelineClick(e as unknown as React.MouseEvent);
                }
              }}
              onDragOver={handleTimelineDragOver}
              role="slider"
              tabIndex={0}
              aria-valuenow={currentFrame}
              aria-valuemin={minFrame}
              aria-valuemax={maxFrame}
            >
              <div
                className={cn(
                  "absolute h-[52px] -top-8 bottom-0 flex flex-col items-center z-20",
                  isDraggingPlayhead ? "cursor-grabbing" : "cursor-grab",
                )}
                style={{
                  left: `${
                    ((currentFrame - minFrame) / (maxFrame - minFrame)) * 100
                  }%`,
                  transform: "translateX(-50%)",
                }}
                onMouseDown={handlePlayheadDragStart}
              >
                <span className="text-xs text-red-500 mt-1">
                  {currentFrame}
                </span>
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <GripVertical className="w-3 h-3 text-white" />
                </div>
                <div className="w-0.5 h-full bg-red-500" />
              </div>

              {/* Images on timeline */}
              {images.map((image) => {
                const startPercent =
                  ((image.startFrame - minFrame) / (maxFrame - minFrame)) * 100;
                const widthPercent =
                  ((Math.min(image.startFrame + 10, maxFrame) -
                    image.startFrame) /
                    (maxFrame - minFrame)) *
                  100;

                return (
                  <div
                    key={image.id}
                    className={
                      "absolute mt-10 rounded-md bg-neutral-300 h-12 min-w-12 max-w-12 aspect-square top-2 flex flex-col items-center"
                    }
                    style={{
                      left: `${startPercent - widthPercent / 2}%`,
                      width: `${widthPercent}%`,
                    }}
                  >
                    <div className="w-full flex relative">
                      <div className="w-3 h-3 rotate-45 absolute bg-neutral-300 left-1/2 -translate-x-1/2 -top-1" />
                    </div>
                    <div className="relative aspect-square w-full p-1 h-full overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          typeof image?.src !== "string"
                            ? URL.createObjectURL(image.src)
                            : image.src || "/placeholder.svg"
                        }
                        alt={image?.name || "Frame preview"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="w-6 h-6 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(image.id);
                          }}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="relative pointer-events-none h-12 w-full select-none">
              {renderTimelineMarkers()}
            </div>
          </div>

          <div className="flex mt-16 items-center justify-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon size={16} />
              Upload Image
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <PlusIcon size={16} />
                  Select Image
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Select an Image</DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-2 flex-wrap overflow-y-auto max-h-80 divide-y divide-border">
                  {mediaItems
                    .filter((media) => {
                      if (media.mediaType === "image") return true;
                    })
                    .map((job) => (
                      <MediaItemRow
                        draggable={false}
                        key={job.id}
                        data={job}
                        onOpen={handleSelectMedia}
                        className="cursor-pointer"
                      />
                    ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </>
      )}
    </div>
  );
}

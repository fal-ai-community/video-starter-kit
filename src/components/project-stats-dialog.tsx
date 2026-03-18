"use client";

import { useProjectMediaItems } from "@/data/queries";
import { useProjectId } from "@/data/store";
import { InfoIcon } from "lucide-react";
import { useMemo } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function ProjectStatsDialog() {
  const projectId = useProjectId();
  const { data: mediaItems = [] } = useProjectMediaItems(projectId);

  const stats = useMemo(() => {
    const generated = mediaItems.filter((item) => item.kind === "generated");

    // Calculate total cost
    const totalCost = generated.reduce((sum, item) => {
      const cost = item.metadata?.cost;
      if (typeof cost === "number") return sum + cost;
      if (typeof cost === "string") return sum + Number.parseFloat(cost);
      return sum;
    }, 0);

    // Check if any FAL generations exist
    const hasFalGenerations = generated.some((item) => item.provider === "fal");

    // Count by media type
    const byType = generated.reduce(
      (acc, item) => {
        acc[item.mediaType] = (acc[item.mediaType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Count by provider
    const byProvider = generated.reduce(
      (acc, item) => {
        const provider = item.provider || "unknown";
        acc[provider] = (acc[provider] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Count by model (endpointId)
    const byModel = generated.reduce(
      (acc, item) => {
        const model = item.endpointId || "unknown";
        acc[model] = (acc[model] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalFiles: mediaItems.length,
      generatedFiles: generated.length,
      uploadedFiles: mediaItems.filter((item) => item.kind === "uploaded")
        .length,
      totalCost,
      hasFalGenerations,
      byType,
      byProvider,
      byModel,
    };
  }, [mediaItems]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="px-2">
          <InfoIcon className="w-4 h-4 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Project Statistics</DialogTitle>
          <DialogDescription>
            Detailed breakdown of your project generations and costs
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 mt-4">
          {/* Overview */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Overview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1 p-3 border rounded-lg">
                <span className="text-2xl font-bold">{stats.totalFiles}</span>
                <span className="text-xs text-muted-foreground">
                  Total Files
                </span>
              </div>
              <div className="flex flex-col gap-1 p-3 border rounded-lg">
                <span className="text-2xl font-bold">
                  {stats.generatedFiles}
                </span>
                <span className="text-xs text-muted-foreground">Generated</span>
              </div>
              <div className="flex flex-col gap-1 p-3 border rounded-lg">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ${stats.totalCost.toFixed(4)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Total Cost
                  {stats.hasFalGenerations && " *"}
                </span>
              </div>
            </div>
            {stats.hasFalGenerations && (
              <div className="text-xs text-muted-foreground bg-accent/30 p-2 rounded border border-accent">
                * FAL generation costs are approximate. Actual costs may vary
                based on final processing requirements.
              </div>
            )}
          </div>

          {/* By Media Type */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">By Media Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div
                  key={type}
                  className="flex justify-between p-2 border rounded"
                >
                  <span className="text-sm capitalize">{type}</span>
                  <span className="text-sm font-mono">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* By Provider */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">By Provider</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(stats.byProvider).map(([provider, count]) => (
                <div
                  key={provider}
                  className="flex justify-between p-2 border rounded"
                >
                  <span className="text-sm capitalize">{provider}</span>
                  <span className="text-sm font-mono">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* By Model */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">By Model</h3>
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
              {Object.entries(stats.byModel)
                .sort(([, a], [, b]) => b - a)
                .map(([model, count]) => (
                  <div
                    key={model}
                    className="flex justify-between p-2 border rounded text-xs"
                  >
                    <span className="font-mono truncate flex-1">{model}</span>
                    <span className="font-mono ml-2">{count}x</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

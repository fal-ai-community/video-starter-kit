import { type ModelStats, getModelName } from "@/lib/analytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  FilmIcon,
  ImageIcon,
  MicIcon,
  MusicIcon,
  LayersIcon,
} from "lucide-react";
import { useState } from "react";
import type { MediaType } from "@/data/store";
import { AVAILABLE_ENDPOINTS } from "@/lib/fal";

interface ModelPerformanceProps {
  data: ModelStats[];
}

type FilterType = MediaType | "all";

export function ModelPerformance({ data }: ModelPerformanceProps) {
  const [selectedType, setSelectedType] = useState<FilterType>("video");

  const handleFilterChange = (value: string | undefined) => {
    if (!value) return;
    setSelectedType(value as FilterType);
  };

  const getModelType = (modelId: string): MediaType | null => {
    // First try exact match
    const endpoint = AVAILABLE_ENDPOINTS.find((e) => e.endpointId === modelId);
    if (endpoint) return endpoint.category;

    // Try matching base model ID (for variants like image-to-video)
    const baseModelId = modelId.split("/").slice(0, -1).join("/");
    const baseEndpoint = AVAILABLE_ENDPOINTS.find(
      (e) => e.endpointId === baseModelId,
    );
    return baseEndpoint?.category || null;
  };

  const filteredData = data.filter((stat) => {
    if (selectedType === "all") return true;
    const modelType = getModelType(stat.modelId);
    return modelType === selectedType;
  });

  const chartData = filteredData.map((stat) => ({
    name: getModelName(stat.modelId),
    Positive: stat.positive,
    Negative: stat.negative,
    Unrated: stat.unrated,
    total: stat.totalGenerations,
  }));

  // Find the maximum value to set the domain
  const maxValue = Math.max(...chartData.map((d) => d.total));
  // Calculate a nice round number for the max Y value
  const yAxisMax = Math.ceil(maxValue / 5) * 5;

  return (
    <div className="w-full space-y-6">
      <ToggleGroup
        type="single"
        value={selectedType}
        onValueChange={handleFilterChange}
        className="justify-start"
      >
        <ToggleGroupItem value="video" aria-label="Video models">
          <FilmIcon className="w-4 h-4 mr-2" />
          Video
        </ToggleGroupItem>
        <ToggleGroupItem value="image" aria-label="Image models">
          <ImageIcon className="w-4 h-4 mr-2" />
          Image
        </ToggleGroupItem>
        <ToggleGroupItem value="music" aria-label="Music models">
          <MusicIcon className="w-4 h-4 mr-2" />
          Music
        </ToggleGroupItem>
        <ToggleGroupItem value="voiceover" aria-label="Voiceover models">
          <MicIcon className="w-4 h-4 mr-2" />
          Voice
        </ToggleGroupItem>
        <ToggleGroupItem value="all" aria-label="All models">
          <LayersIcon className="w-4 h-4 mr-2" />
          All
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 100,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
            />
            <YAxis
              label={{
                value: "Number of Generations",
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
              tickFormatter={(value) => Math.round(value).toString()}
              domain={[0, yAxisMax]}
              ticks={Array.from({ length: yAxisMax + 1 }, (_, i) => i)}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value: number) => value}
              labelFormatter={(label) => `Model: ${label}`}
            />
            <Legend />
            <Bar dataKey="Positive" fill="hsl(142.1 76.2% 36.3%)" stackId="a" />{" "}
            {/* Green */}
            <Bar dataKey="Negative" fill="hsl(346.8 77.2% 49.8%)" stackId="a" />{" "}
            {/* Red */}
            <Bar dataKey="Unrated" fill="hsl(24.6 95% 53.1%)" stackId="a" />{" "}
            {/* Orange */}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredData.map((stat) => (
          <div key={stat.modelId} className="p-4 rounded-lg bg-accent">
            <h3 className="font-medium mb-1">{getModelName(stat.modelId)}</h3>
            <p className="text-sm text-muted-foreground">
              {stat.totalGenerations} generations
            </p>
            <div className="mt-2 space-y-1 text-sm">
              <p>
                <span className="text-[hsl(142.1,76.2%,36.3%)]">●</span>{" "}
                Positive: {stat.positive} ({stat.positiveRate.toFixed(1)}%)
              </p>
              <p>
                <span className="text-[hsl(346.8,77.2%,49.8%)]">●</span>{" "}
                Negative: {stat.negative} ({stat.negativeRate.toFixed(1)}%)
              </p>
              <p>
                <span className="text-[hsl(24.6,95%,53.1%)]">●</span> Unrated:{" "}
                {stat.unrated} ({stat.unratedRate.toFixed(1)}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

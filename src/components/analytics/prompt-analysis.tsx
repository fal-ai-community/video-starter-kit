import {
  type PromptAnalysis as PromptAnalysisType,
  getModelName,
} from "@/lib/analytics";
import {
  LightbulbIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  FilmIcon,
  ImageIcon,
  MusicIcon,
  MicIcon,
  LayersIcon,
  TrendingUpIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { MediaType } from "@/data/store";
import { AVAILABLE_ENDPOINTS } from "@/lib/fal";

interface ModelPrompts {
  modelId: string;
  positivePrompts: string[];
  negativePrompts: string[];
}

interface PromptAnalysisProps {
  data: ModelPrompts[];
  onAnalyze: (modelId: string) => Promise<PromptAnalysisType>;
  onAnalyzeCategory?: (category: MediaType, modelIds: string[]) => Promise<PromptAnalysisType>;
}

type FilterType = MediaType | "all";

function getModelType(modelId: string): MediaType | null {
  // First try exact match
  const endpoint = AVAILABLE_ENDPOINTS.find((e) => e.endpointId === modelId);
  if (endpoint) return endpoint.category;

  // Try matching base model ID (for variants like image-to-video)
  const baseModelId = modelId.split("/").slice(0, -1).join("/");
  const baseEndpoint = AVAILABLE_ENDPOINTS.find(
    (e) => e.endpointId === baseModelId,
  );
  return baseEndpoint?.category || null;
}

export function PromptAnalysis({ data, onAnalyze, onAnalyzeCategory }: PromptAnalysisProps) {
  const [selectedType, setSelectedType] = useState<FilterType>("video");
  const [analysisResults, setAnalysisResults] = useState<Record<string, PromptAnalysisType>>({});
  const [analyzing, setAnalyzing] = useState<Record<string, boolean>>({});
  const [categoryAnalysis, setCategoryAnalysis] = useState<Record<string, PromptAnalysisType>>({});
  const [analyzingCategory, setAnalyzingCategory] = useState(false);

  if (data.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No rated prompts available for analysis. Try rating some prompts as positive or negative first.
      </div>
    );
  }

  const handleFilterChange = (value: string | undefined) => {
    if (!value) return;
    setSelectedType(value as FilterType);
  };

  const handleAnalyze = async (modelId: string) => {
    setAnalyzing((prev) => ({ ...prev, [modelId]: true }));
    try {
      const result = await onAnalyze(modelId);
      setAnalysisResults((prev) => ({ ...prev, [modelId]: result }));
    } finally {
      setAnalyzing((prev) => ({ ...prev, [modelId]: false }));
    }
  };

  const handleAnalyzeCategory = async () => {
    if (!onAnalyzeCategory || analyzingCategory) return;
    
    setAnalyzingCategory(true);
    try {
      const category = selectedType as MediaType;
      const modelIds = data
        .filter(model => selectedType === "all" || getModelType(model.modelId) === selectedType)
        .map(model => model.modelId);
      
      if (modelIds.length === 0) return;
      
      const result = await onAnalyzeCategory(category, modelIds);
      setCategoryAnalysis(prev => ({ ...prev, [selectedType]: result }));
    } finally {
      setAnalyzingCategory(false);
    }
  };

  const filteredData = data.filter(model => 
    selectedType === "all" || getModelType(model.modelId) === selectedType
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
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

        {onAnalyzeCategory && filteredData.length > 0 && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleAnalyzeCategory}
              disabled={analyzingCategory}
            >
              <TrendingUpIcon className="w-4 h-4 mr-2" />
              {analyzingCategory
                ? `Analyzing ${selectedType === "all" ? "All Models" : selectedType} Usage...`
                : `Compare ${selectedType === "all" ? "All Models" : selectedType} Usage`}
            </Button>
          </div>
        )}
      </div>

      {/* Category Analysis Results */}
      {categoryAnalysis[selectedType] && (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
          <h3 className="text-xl font-semibold leading-none tracking-tight flex items-center gap-2">
            <TrendingUpIcon className="w-5 h-5" />
            {selectedType === "all" ? "Cross-Model Analysis" : `${selectedType} Models Analysis`}
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-green-600 dark:text-green-500 mb-2 flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4" />
                Key Success Patterns
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {categoryAnalysis[selectedType].analysis.positivePatterns.map((pattern, i) => (
                  <li key={i}>{pattern}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-red-600 dark:text-red-500 mb-2 flex items-center gap-1">
                <XCircleIcon className="w-4 h-4" />
                Common Challenges
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {categoryAnalysis[selectedType].analysis.negativePatterns.map((pattern, i) => (
                  <li key={i}>{pattern}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <LightbulbIcon className="w-4 h-4" />
                Strategic Recommendations
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {categoryAnalysis[selectedType].analysis.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Individual Model Analysis */}
      {filteredData.map((model) => (
        <div
          key={model.modelId}
          className="rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              {getModelName(model.modelId)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {model.positivePrompts.length + model.negativePrompts.length} rated prompts available ({model.positivePrompts.length} positive, {model.negativePrompts.length} negative)
            </p>
          </div>
          <div className="p-6 pt-0">
            {analysisResults[model.modelId] ? (
              <div className="grid gap-4">
                {/* Analysis Section */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-green-600 dark:text-green-500 mb-2 flex items-center gap-1">
                      <CheckCircleIcon className="w-4 h-4" />
                      Successful Patterns
                    </h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {analysisResults[model.modelId].analysis.positivePatterns.map((pattern, i) => (
                        <li key={i}>{pattern}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-red-600 dark:text-red-500 mb-2 flex items-center gap-1">
                      <XCircleIcon className="w-4 h-4" />
                      Unsuccessful Patterns
                    </h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {analysisResults[model.modelId].analysis.negativePatterns.map((pattern, i) => (
                        <li key={i}>{pattern}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <LightbulbIcon className="w-4 h-4" />
                      Recommendations
                    </h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {analysisResults[model.modelId].analysis.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Example Prompts */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-green-600 dark:text-green-500">
                      Example Successful Prompts
                    </h4>
                    <ScrollArea className="h-32 rounded border p-2">
                      {model.positivePrompts.slice(0, 5).map((prompt, i) => (
                        <p key={i} className="text-sm mb-2">
                          {prompt}
                        </p>
                      ))}
                    </ScrollArea>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-red-600 dark:text-red-500">
                      Example Unsuccessful Prompts
                    </h4>
                    <ScrollArea className="h-32 rounded border p-2">
                      {model.negativePrompts.slice(0, 5).map((prompt, i) => (
                        <p key={i} className="text-sm mb-2">
                          {prompt}
                        </p>
                      ))}
                    </ScrollArea>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center py-4">
                <Button
                  variant="outline"
                  onClick={() => handleAnalyze(model.modelId)}
                  disabled={analyzing[model.modelId]}
                >
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  {analyzing[model.modelId] ? "Analyzing Prompts..." : "Get Prompting Insights"}
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, FocusIcon } from "lucide-react";
import { useState } from "react";

const CameraMovement = ({
  value: initialValue,
  onChange,
}: {
  value: { movement: string; value: number } | undefined;
  onChange: (value: { movement: string; value: number } | undefined) => void;
}) => {
  const [open, setOpen] = useState(true);
  const [movement, setMovement] = useState(initialValue?.movement || "default");
  const [value, setValue] = useState(initialValue?.value || 0);

  const getTransformStyle = () => {
    switch (movement) {
      case "roll":
        return `rotate(${value * 2}deg)`;
      case "horizontal":
        return `translateX(${value * 3}px)`;
      case "vertical":
        return `translateY(${value * 3}px)`;
      case "pan":
        return `perspective(300px) rotateX(${-value * 4}deg)`;
      case "tilt":
        return `perspective(300px) rotateY(${-value * 4}deg)`;
      case "zoom":
        return `scale(${1 + value / 25})`;
      default:
        return "rotate(0deg)";
    }
  };

  const handleChange = (type: "movement" | "value", val: string | number) => {
    if (type === "movement") {
      setMovement(val as string);
      setValue(0);
      if (movement === "default") {
        setValue(0);
        onChange(undefined);
      }
      onChange({ movement: val as string, value: value });
    } else {
      setValue(val as number);
      onChange({ movement: movement, value: val as number });
    }
  };

  return (
    <div className="w-full mx-auto border-t border-neutral-800 py-3">
      {/* Header */}
      <button
        type="button"
        className="flex justify-between items-center select-none w-full text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Camera Movement</span>
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
          <div className="bg-neutral-800/40 px-4 py-8 flex items-center justify-center aspect-video relative rounded-md my-6">
            <div className="w-2/3 border border-dashed absolute border-neutral-800 rounded-xl aspect-video bg-neutral-950/50 flex items-center justify-center" />
            <div
              style={{
                transform: getTransformStyle(),
              }}
              className="w-2/3 border absolute rotate-0 border-green-400/20 rounded-xl aspect-video bg-green-400/30 flex items-center justify-center"
            >
              <FocusIcon size={24} />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground">Camera Control</div>
            </div>

            <div className="flex items-center gap-4">
              <Select
                value={movement}
                onValueChange={(value) => {
                  handleChange("movement", value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select movement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                  <SelectItem value="vertical">Vertical</SelectItem>
                  <SelectItem value="pan">Pan</SelectItem>
                  <SelectItem value="tilt">Tilt</SelectItem>
                  <SelectItem value="roll">Roll</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="secondary"
                onClick={() => handleChange("movement", "default")}
              >
                Reset
              </Button>
            </div>

            {movement !== "default" && (
              <div className="space-y-2">
                <span className="text-muted-foreground capitalize">
                  {movement}:
                </span>
                <div className="flex items-center gap-4">
                  <Slider
                    defaultValue={[value]}
                    value={[value]}
                    onValueChange={(value) => handleChange("value", value[0])}
                    max={10}
                    min={-10}
                    step={0.1}
                    className="flex-1 [&_.slider-range]:bg-transparent"
                  />

                  <div className="bg-neutral-900 px-3 py-2 text-xs rounded-md text-white inline-flex tabular-nums w-10 items-center justify-center text-center">
                    {value}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CameraMovement;

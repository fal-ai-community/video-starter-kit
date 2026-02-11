"use client";

import { useToast } from "@/hooks/use-toast";
import { fal } from "@/lib/fal";
import { getRunwareClient, resetRunwareClient } from "@/lib/runware";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { CheckCircle2, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";

type KeyDialogProps = {} & Parameters<typeof Dialog>[0];

export function KeyDialog({ onOpenChange, open, ...props }: KeyDialogProps) {
  const t = useTranslations("app.keyDialog");
  const [falKey, setFalKey] = useState("");
  const [runwareKey, setRunwareKey] = useState("");
  const [falTestStatus, setFalTestStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");
  const [runwareTestStatus, setRunwareTestStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");
  const { toast } = useToast();

  const notifyApiKeysUpdated = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("apiKeysUpdated"));
    }
  };

  const testFalKey = async () => {
    if (!falKey) return;
    setFalTestStatus("testing");
    try {
      localStorage.setItem("falKey", falKey);
      notifyApiKeysUpdated();
      await fal.queue.submit("fal-ai/flux/schnell", {
        input: { prompt: "test", image_size: "square_hd", num_images: 1 },
      });
      setFalTestStatus("success");
      toast({
        title: "FAL API Key Valid",
        description: "Your key is working correctly",
      });
    } catch (error) {
      setFalTestStatus("error");
      toast({
        title: "FAL API Key Invalid",
        description: "Please check your key",
        variant: "destructive",
      });
    }
  };

  const testRunwareKey = async () => {
    if (!runwareKey) return;
    setRunwareTestStatus("testing");
    try {
      localStorage.setItem("runwareKey", runwareKey);
      notifyApiKeysUpdated();
      resetRunwareClient();
      const client = await getRunwareClient();
      if (!client) throw new Error("Failed to initialize");
      setRunwareTestStatus("success");
      toast({
        title: "Runware API Key Valid",
        description: "Your key is working correctly",
      });
    } catch (error) {
      setRunwareTestStatus("error");
      toast({
        title: "Runware API Key Invalid",
        description: "Please check your key",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (open) {
      setFalTestStatus("idle");
      setRunwareTestStatus("idle");
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      const savedFalKey = localStorage.getItem("falKey") || "";
      const savedRunwareKey = localStorage.getItem("runwareKey") || "";
      setFalKey(savedFalKey);
      setRunwareKey(savedRunwareKey);
    }
  }, [open]);

  const handleOnOpenChange = (isOpen: boolean) => {
    onOpenChange?.(isOpen);
  };

  const handleSave = () => {
    localStorage.setItem("falKey", falKey);
    localStorage.setItem("runwareKey", runwareKey);
    notifyApiKeysUpdated();
    handleOnOpenChange(false);
    setFalKey("");
    setRunwareKey("");
  };

  return (
    <Dialog {...props} onOpenChange={handleOnOpenChange} open={open}>
      <DialogContent className="flex flex-col max-w-lg h-fit">
        <DialogHeader>
          <DialogTitle className="sr-only">{t("title")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col flex-1 gap-8">
          <h2 className="text-lg font-semibold flex flex-row gap-2">
            {t("saveKey")}
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="fal-api-key"
                className="text-sm font-medium text-muted-foreground"
              >
                FAL API Key
              </label>
              <div className="flex gap-2">
                <Input
                  id="fal-api-key"
                  type="password"
                  placeholder={t("placeholder")}
                  value={falKey}
                  onChange={(e) => setFalKey(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={testFalKey}
                  disabled={!falKey || falTestStatus === "testing"}
                >
                  {falTestStatus === "testing" ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : falTestStatus === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    "Test"
                  )}
                </Button>
              </div>
            </div>
            <div>
              <label
                htmlFor="runware-api-key"
                className="text-sm font-medium text-muted-foreground"
              >
                Runware API Key
              </label>
              <div className="flex gap-2">
                <Input
                  id="runware-api-key"
                  type="password"
                  placeholder={t("runwarePlaceholder")}
                  value={runwareKey}
                  onChange={(e) => setRunwareKey(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={testRunwareKey}
                  disabled={!runwareKey || runwareTestStatus === "testing"}
                >
                  {runwareTestStatus === "testing" ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : runwareTestStatus === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    "Test"
                  )}
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              {t("privacyNotice")}
            </p>
          </div>
          <div className="flex-1 flex flex-row items-end justify-center gap-2">
            <Button onClick={handleSave}>{t("save")}</Button>
          </div>
        </div>

        <DialogFooter>
          <p className="text-muted-foreground text-sm mt-4 w-full text-center">
            {t.rich("footerText", {
              falLink: (chunks) => (
                <a
                  className="underline underline-offset-2 decoration-foreground/50 text-foreground"
                  href="https://fal.ai/dashboard/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {chunks}
                </a>
              ),
              runwareLink: (chunks) => (
                <a
                  className="underline underline-offset-2 decoration-foreground/50 text-foreground"
                  href="https://runware.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

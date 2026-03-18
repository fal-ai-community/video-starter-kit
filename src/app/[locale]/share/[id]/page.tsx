import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { fetchSharedVideo } from "@/lib/share";
import { DownloadIcon } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageParams = {
  locale: string;
  id: string;
};

type PageProps = {
  params: PageParams;
};

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "share.metadata",
  });
  const video = await fetchSharedVideo(params.id);
  if (!video) {
    return {
      title: t("notFoundTitle"),
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: video.title,
    description: video.description || t("watchDescription"),

    openGraph: {
      title: video.title,
      description: video.description,
      type: "video.other",
      videos: [
        {
          url: video.videoUrl,
          width: video.width,
          height: video.height,
          type: "video/mp4",
        },
      ],
      images: [
        {
          url: video.thumbnailUrl,
          width: video.width,
          height: video.height,
          alt: video.title,
        },
        ...previousImages,
      ],
    },

    twitter: {
      card: "player",
      title: video.title,
      description: video.description,
      players: [
        {
          playerUrl: video.videoUrl,
          streamUrl: video.videoUrl,
          width: video.width,
          height: video.height,
        },
      ],
      images: [video.thumbnailUrl],
    },

    other: {
      "og:video:duration": "15",
      "video:duration": "15",
      "video:release_date": new Date(video.createdAt).toISOString(),
    },
  };
}

export default async function SharePage({ params }: PageProps) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "share",
  });
  const shareId = params.id;
  const shareData = await fetchSharedVideo(shareId);
  if (!shareData) {
    return notFound();
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex overflow-hidden h-full">
        <div className="container mx-auto py-8 h-full">
          <div className="flex flex-col gap-8 items-center justify-center h-full">
            <h1 className="font-semibold text-2xl">{shareData.title}</h1>
            <p className="text-muted-foreground max-w-3xl w-full sm:w-3xl text-center">
              {shareData.description}
            </p>
            <div className="max-w-4xl">
              <video
                src={shareData.videoUrl}
                poster={shareData.thumbnailUrl}
                controls
                className="w-full h-full aspect-video"
              >
                <track kind="captions" />
              </video>
            </div>
            <div className="flex flex-row gap-2 items-center justify-center">
              <Button variant="secondary" asChild size="lg">
                <a href={shareData.videoUrl} download>
                  <DownloadIcon className="w-4 h-4 opacity-50" />
                  {t("download")}
                </a>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/">{t("startProject")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

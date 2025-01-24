import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { fetchSharedVideo } from "@/lib/share";
import { DownloadIcon } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

type PageParams = {
  id: string;
};

type PageProps = {
  params: PageParams;
};

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const video = await fetchSharedVideo(params.id);
  if (!video) {
    return {
      title: "Video Not Found",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: video.title,
    description: video.description || `Watch on Video AI Studio`,

    // Open Graph metadata
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

    // Twitter Card metadata
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

    // Additional metadata
    other: {
      // TODO resolve duration
      "og:video:duration": "15",
      "video:duration": "15",
      "video:release_date": new Date(video.createdAt).toISOString(),
    },
  };
}

export default async function SharePage({ params }: PageProps) {
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
              />
            </div>
            <div className="flex flex-row gap-2 items-center justify-center">
              <Button variant="secondary" asChild size="lg">
                <a href={shareData.videoUrl} download>
                  <DownloadIcon className="w-4 h-4 opacity-50" />
                  Download
                </a>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <a href="/">Start your project</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

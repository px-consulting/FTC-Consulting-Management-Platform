"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import YouTubePlayer from "@/components/ui/youtube-player";

export default function TutorialCard({ tutorial, step }) {
  const { name, description, youtubeUrl } = tutorial;
  const videoId = extractVideoId(youtubeUrl);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg">{name}</CardTitle>
        <p className="text-sm text-muted-foreground">Step {step}</p>
      </CardHeader>
      <YouTubePlayer videoId={videoId} />
      <CardContent className="pt-4">
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function extractVideoId(url) {
  try {
    const u = new URL(url);
    return u.searchParams.get("v") || u.pathname.split("/").pop();
  } catch {
    return url;
  }
}


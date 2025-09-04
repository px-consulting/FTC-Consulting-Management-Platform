"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import YouTubePlayer from "@/components/ui/youtube-player";
import { toggleTutorial, deleteTutorial } from "@/lib/tutorials";

export default function TutorialCard({ tutorial, step }) {
  const { id, name, description, youtubeUrl, active } = tutorial;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const videoId = extractVideoId(youtubeUrl);

  async function handleToggle() {
    try {
      await toggleTutorial(id, !active);
      toast.success(`Tutorial ${active ? "deactivated" : "activated"}`);
    } catch (err) {
      toast.error("Failed to update tutorial");
    } finally {
      setConfirmOpen(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg">{name}</CardTitle>
          <p className="text-sm text-muted-foreground">Step {step}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch
              id={`tutorial-${id}`}
              checked={active}
              onCheckedChange={() => setConfirmOpen(true)}
            />
            <Label htmlFor={`tutorial-${id}`}>{active ? "Active" : "Inactive"}</Label>
          </div>
          <form action={deleteTutorial.bind(null, id)}>
            <SubmitButton type="submit" variant="ghost" pendingText="Deleting...">
              Delete
            </SubmitButton>
          </form>
        </div>
      </CardHeader>
      <YouTubePlayer videoId={videoId} />
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="rounded-lg" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {active ? "Deactivate tutorial?" : "Activate tutorial?"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleToggle}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
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

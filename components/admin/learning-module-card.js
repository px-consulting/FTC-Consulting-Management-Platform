"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, Download, Trash, X } from "lucide-react";
import { toggleModule, deleteModule } from "@/lib/learning-modules";

export default function LearningModuleCard({ module }) {
  const { id, name, description, active } = module;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const fileUrl = `/api/modules/${id}/file`;

  async function handleToggle() {
    try {
      await toggleModule(id, !active);
      toast.success(`Module ${active ? "deactivated" : "activated"}`);
    } catch (err) {
      toast.error("Failed to update module");
    } finally {
      setConfirmOpen(false);
    }
  }

  return (
    <div className="flex items-start justify-between rounded border p-4">
      <div className="pr-4">
        <h3 className="font-medium">{name}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Switch
            id={`module-${id}`}
            checked={active}
            onCheckedChange={() => setConfirmOpen(true)}
          />
          <Label htmlFor={`module-${id}`}>{active ? "Active" : "Inactive"}</Label>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" title="View">
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-3xl rounded-lg"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle>{name}</DialogTitle>
              <DialogClose className="cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogHeader>
            <iframe src={fileUrl} className="h-[75vh] w-full" />
          </DialogContent>
        </Dialog>
        <a href={fileUrl} download target="_blank">
          <Button variant="ghost" size="icon" title="Download">
            <Download className="h-4 w-4" />
          </Button>
        </a>
        <DeleteModuleButton id={id} />
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="rounded-lg" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {active ? "Deactivate module?" : "Activate module?"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleToggle}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DeleteModuleButton({ id }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Delete">
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="rounded-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Delete module?</DialogTitle>
        </DialogHeader>
        <form
          action={deleteModule.bind(null, id)}
          className="flex justify-end gap-2"
        >
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <SubmitButton type="submit" pendingText="Deleting...">
            Delete
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}


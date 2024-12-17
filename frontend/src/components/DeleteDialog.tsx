import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash, X } from "lucide-react";
import { useState } from "react";

interface DeleteDialogProps {
  onConfirm: () => void;
  message: string;
  isDeleting: boolean;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  onConfirm,
  message,
  isDeleting,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-red-600 hover:bg-red-600 hover:text-black">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[800px] p-12">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogTitle className="text-lg font-semibold leading-none tracking-tight">
          Delete Confirmation
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {message}
        </DialogDescription>
        <div className="flex justify-end mt-4 space-x-4">
          <Button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={() => {
              setOpen(!open);
            }}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-500 text-white px-4 py-2 rounded"
            disabled={isDeleting}
            onClick={() => {
              onConfirm();
              setOpen(!open);
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;

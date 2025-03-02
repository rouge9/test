import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Pen, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { TableTickets, TicketsFormInputs } from "@/types";
import { createtickets, updatetickets } from "@/queries";

export const TicketsSchema = z.object({
  title: z.string().min(1, "Ticket Title is required"),
  status: z.string().min(1, "Status is required"),
  description: z.string().min(1, "Description is required"),
});

type props = {
  currentPage: number;
  TicketsData?: TableTickets;
};

const CreateVM = ({ currentPage, TicketsData }: props) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<TicketsFormInputs>({
    resolver: zodResolver(TicketsSchema),
    defaultValues: TicketsData
      ? {
          title: TicketsData.title,
          status: TicketsData.status,
          description: TicketsData.description,
        }
      : { title: "", status: "", description: "" },
  });

  const mutation = useMutation({
    mutationFn: TicketsData ? updatetickets : createtickets,
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["tickets", currentPage] });
      toast({
        title: TicketsData ? "Update Success" : "Create Success",
        description: TicketsData
          ? "Tickets updated successfully"
          : "Tickets created successfully",
        variant: "default",
        className: "bg-green-500 text-white",
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: TicketsData
          ? "Failed to update vehicle"
          : "Failed to create vehicle",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TicketsFormInputs) => {
    console.log(data);
    if (TicketsData) {
      mutation.mutate({ id: TicketsData._id, data: data });
    } else {
      mutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {TicketsData ? (
          <Button className="bg-white text-blue-800 hover:bg-blue-600 hover:text-white">
            <Pen />
          </Button>
        ) : (
          <Button className="bg-white text-black hover:bg-blue-600">
            <Plus className="mr-2 h-4 w-4" /> Create VM
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[800px] p-12">
        <DialogHeader></DialogHeader>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Tickets Title"
                      className="border-muted py-2 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Tickets Description"
                      className="border-muted py-2 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end items-end">
              <Button
                type="submit"
                className="px-16 py-6 bg-blue-500"
                disabled={mutation.isPending}
              >
                {mutation.isPending && (
                  <Loader2 className="mr-2 animate-spin" />
                )}
                {TicketsData ? <span>Update</span> : <span>Create</span>}
              </Button>
            </div>
          </form>
        </Form>
        {/* )} */}
      </DialogContent>
    </Dialog>
  );
};

export default CreateVM;

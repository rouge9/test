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
import { TableVehchile, VehicleFormInputs } from "@/types";
import { createvechiles, updatevechile } from "@/queries";

// eslint-disable-next-line react-refresh/only-export-components
export const vehicleSchema = z.object({
  name: z.string().min(1, "Vehicle name is required"),
  status: z.string().min(1, "Status is required"),
});

type props = {
  currentPage: number;
  vehicleData?: TableVehchile;
};

const CreateVM = ({ currentPage, vehicleData }: props) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");

  const form = useForm<VehicleFormInputs>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicleData
      ? { name: vehicleData.name, status: vehicleData.status, userId }
      : { name: "", status: "", userId },
  });

  const mutation = useMutation({
    mutationFn: vehicleData ? updatevechile : createvechiles,
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["vehicles", currentPage] });
      toast({
        title: vehicleData ? "Update Success" : "Create Success",
        description: vehicleData
          ? "Vehicle updated successfully"
          : "Vehicle created successfully",
        variant: "default",
        className: "bg-green-500 text-white",
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: vehicleData
          ? "Failed to update vehicle"
          : "Failed to create vehicle",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VehicleFormInputs) => {
    if (vehicleData) {
      mutation.mutate({ id: vehicleData._id, data: data });
    } else {
      mutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {vehicleData ? (
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name"
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
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
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
                {vehicleData ? <span>Update</span> : <span>Create</span>}
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

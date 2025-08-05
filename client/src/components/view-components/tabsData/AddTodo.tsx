import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import moment from "moment";
import { UpdateTodo, AddTodo1 } from "../api/todo";

interface AddTodosProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditData?: React.Dispatch<React.SetStateAction<any>>;

  editData: any;
}
const AddTodo: React.FC<AddTodosProps> = ({
  open,
  setOpen,
  editData,
  setEditData,
}) => {
  const methods = useForm<any>();
  const { handleSubmit, getValues, reset, control } = methods;
  const handleClose = () => {
    setOpen(false);
    reset({
      taskTitle: "",
      description: "",
      taskDueDate: "",
    });
    setEditData?.(null);
  };
  const { mutate: addTodo } = AddTodo1();
  const { mutate: updateTodo } = UpdateTodo(editData?.id);

  const onsubmit = async () => {
    const values = getValues();
    const body: any = {
      taskName: values?.taskTitle,
      taskDescription: values?.description,
      taskDueDate: values?.taskDueDate,
    };
    try {
      if (editData) {
        updateTodo(body, {
          onSuccess: () => {
            toast.success("todo updated successfully");
            handleClose();
          },
          onError: () => {
            toast.error("failed to update todo");
          },
        });
      } else {
        addTodo(body, {
          onSuccess: () => {
            toast.success("todo add successfully");
            handleClose();
          },
          onError: () => {
            toast.error("failed to add todo");
          },
        });
      }
    } catch (error) {
      toast.error("failed to todo");
    }
  };
  useEffect(() => {
    if (editData && open) {
      reset({
        taskTitle: editData?.task_name,
        description: editData?.task_description,
        taskDueDate: moment(editData?.task_due_date).format("DD/MM/YYYY"),
      });
    }
  }, [editData, open]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onsubmit)}>
            <DialogHeader>
              <DialogTitle>{editData ? "Edit Todos" : "Add Todos"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-8">
              <FormField
                name="taskTitle"
                control={control}
                rules={{
                  required: "task name is required",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Task Name<span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Input placeholder="Enter your task..." {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={control}
                rules={{
                  required: "description is required",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Task Description
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Input
                          placeholder="Enter your description..."
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="taskDueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Task Due Date<span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Input type="date" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4 justify-between">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editData ? "Edit Todo" : "Add Todo"}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AddTodo;

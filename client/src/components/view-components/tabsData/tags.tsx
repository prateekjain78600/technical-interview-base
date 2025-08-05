import React, { useState, useEffect } from "react";
import { Plus, Trash2, User } from "lucide-react";
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
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Tag {
  id: number;
  name: string;
}
const Dashboard: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const methods = useForm<any>();
  const { handleSubmit, getValues, reset, control } = methods;

  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const generateId = (items: { id: number }[]) =>
    items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;

  const handleAddTags = () => {
    const values = getValues();
    const trimmed = values?.tagName.trim();

    // add api implementation

    if (!trimmed || tags.some((t) => t.name === trimmed)) return;
    setTags([...tags, { id: generateId(tags), name: trimmed }]);
    setIsTagDialogOpen(false);
  };

  const deleteTag = (tagId: number) => {
    setTags((prev) => prev?.filter((t) => t.id !== tagId));
  };

  useEffect(() => {
    setTags([
      { id: 1, name: "Urgent" },
      { id: 2, name: "Meeting" },
      { id: 3, name: "Health" },
    ]);
  }, []);
  const handleClose = () => {
    setIsTagDialogOpen(false);
    reset({
      tagName: "",
    });
  };
  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Tags</h2>
          <Button
            onClick={() => setIsTagDialogOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition duration-300"
          >
            <Plus className="h-4 w-4" />
            Add Tags
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags?.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No tags found. Add your first tag!
            </div>
          ) : (
            tags.map((tag) => (
              <div
                key={tag.id}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-green-800">
                    {tag.name}
                  </h3>
                  <button
                    onClick={() => deleteTag(tag.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog
        open={isTagDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            reset({
              tagName: "",
            });
          }
          setIsTagDialogOpen(open);
        }}
      >
        <DialogContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleAddTags)}>
              <DialogHeader>
                <DialogTitle>Add Tags</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-8">
                <FormField
                  name="tagName"
                  control={control}
                  rules={{
                    required: "tagName is required",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tag Name<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Input
                            placeholder="Enter your tagName..."
                            {...field}
                          />
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
                  <Button type="submit">Add Tag</Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;

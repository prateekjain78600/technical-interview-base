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

interface Category {
  id: number;
  name: string;
  description?: string;
}
const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const methods = useForm<any>();
  const { handleSubmit, getValues, reset, control } = methods;
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const generateId = (items: { id: number }[]) =>
    items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;

  const handleAddCategory = () => {
    const values = getValues();
    // add api implementation
    setCategories([
      ...categories,
      {
        id: generateId(categories),
        name: values?.categoryName,
        description: values?.description,
      },
    ]);

    setIsCategoryDialogOpen(false);
  };

  const deleteCategory = (categoryId: number) => {
    setCategories((prev) => prev?.filter((c) => c.id !== categoryId));
    reset({
      categoryName: "",
      description: "",
    });
  };

  useEffect(() => {
    setCategories([
      { id: 1, name: "Work", description: "Tasks related to job" },
      { id: 2, name: "Personal", description: "Private life activities" },
    ]);
  }, []);
  const handleClose = () => {
    setIsCategoryDialogOpen(false);
    reset({
      categoryName: "",
      description: "",
    });
  };
  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Categories</h2>
          <Button
            onClick={() => setIsCategoryDialogOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition duration-300"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No categories found. Add your first category!
            </div>
          ) : (
            categories?.map((category) => (
              <div
                key={category?.id}
                className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-indigo-800">
                    {category?.name}
                  </h3>
                  <button
                    onClick={() => deleteCategory(category?.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {category?.description && (
                  <p className="text-gray-600 text-sm mb-3">
                    {category?.description}
                  </p>
                )}
                <div className="text-xs text-indigo-600 font-medium">tasks</div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog
        open={isCategoryDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            reset({
              categoryName: "",
              description: "",
            });
          }
          setIsCategoryDialogOpen(open);
        }}
      >
        <DialogContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleAddCategory)}>
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-8">
                <FormField
                  name="categoryName"
                  control={control}
                  rules={{
                    required: "categoryName is required",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Category Name<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Input
                            placeholder="Enter your categoryName..."
                            {...field}
                          />
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
                <div className="flex gap-3 pt-4 justify-between">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Category</Button>
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

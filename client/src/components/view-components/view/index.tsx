import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { DeleteTodo, GetTodoById } from "../api/todo";
import { format } from "date-fns";
import AddTodo from "../tabsData/AddTodo";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, StepBack, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [openTodo, setOpenTodo] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: todoDetails } = GetTodoById(id ?? "");
  const { mutate: deleteTodo } = DeleteTodo();
  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "PPPp");
    } catch {
      return "Invalid date";
    }
  };
  const details = [
    { label: "Task Name", value: todoDetails?.task_name },
    { label: "Description", value: todoDetails?.task_description },
    { label: "Due Date", value: formatDate(todoDetails?.task_due_date) },
    { label: "Updated At", value: formatDate(todoDetails?.updated_at) },
  ];
  useEffect(() => {
    if (todoDetails) {
      setEditData(todoDetails);
    }
  }, [todoDetails]);

  const status = todoDetails?.is_completed
    ? {
        text: "Completed",
        color: "bg-green-100 text-green-700 border-green-300",
      }
    : {
        text: "Pending",
        color: "bg-yellow-100 text-yellow-700 border-yellow-300",
      };

  const handleDeleteClick = () => {
    deleteTodo(editData?.id, {
      onSuccess: () => {
        toast.success("Task deleted successfully");
        setDeleteDialogOpen(false);
        navigate("/dashboard");
      },
      onError: () => {
        toast.error("Task not deleted");
      },
    });
  };
  return (
    <>
      {openTodo && (
        <AddTodo open={openTodo} setOpen={setOpenTodo} editData={editData} />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900 p-4"
      >
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-indigo-800">
              View Todo Details
            </h1>
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 shadow-md"
            >
              <motion.div
                animate={{ rotate: openTodo ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <StepBack className="h-4 w-4" />
              </motion.div>
              Back to Dashboard
            </Button>
          </header>
          <div className="flex items-center justify-between mt-4 mb-4 ">
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-gray-600 mr-4">
                Status :{" "}
              </h3>
              <span
                className={`inline-block px-4 py-1 rounded-full border text-sm font-semibold ${status.color}`}
              >
                {status.text}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              <Button
                onClick={() => {
                  setOpenTodo(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow-sm transition"
              >
                <motion.div
                  animate={{ rotate: openTodo ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Pencil className="h-4 w-4" />
                </motion.div>
                Edit Task
              </Button>

              <Button
                onClick={() => {
                  setDeleteDialogOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-sm transition"
              >
                <motion.div
                  animate={{ rotate: openTodo ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Trash2 className="h-4 w-4" />
                </motion.div>
                Delete Task
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {details?.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No details found.
              </div>
            ) : (
              details.map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {item.label}
                  </h3>
                  <p className="text-lg font-semibold text-gray-800">
                    {item.value || "—"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              todo from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClick}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Dashboard;

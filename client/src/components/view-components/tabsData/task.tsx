import { Plus, Trash2, Pencil, Check, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import AddTodo from "./AddTodo";
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
import axios from "axios";
import { toast } from "sonner";
import moment from "moment";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { DeleteTodo, UpdateTodo } from "../api/todo";
import { useNavigate } from "react-router-dom";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  task_due_date: string;
}

interface TaskProps {
  todos: Todo[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Task: React.FC<TaskProps> = ({ todos, searchQuery, setSearchQuery }) => {
  const [openTodo, setOpenTodo] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [DeleteId, setDeleteId] = useState<number | null>(null);
  const [markId, setMarkID] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const todosPerPage = 5;
  const totalPages = Math.ceil(todos?.length / todosPerPage);
  const startIndex = (currentPage - 1) * todosPerPage;
  const paginatedTodos = todos?.slice(startIndex, startIndex + todosPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const editOpen = (data: any) => {
    setOpenTodo(true);
    setEditData(data);
  };

  const { mutate: deleteTodo } = DeleteTodo();
  const { mutate: updateTodo } = UpdateTodo(markId);

  const handleDeleteClick = (todo: number) => {
    setDeleteId(todo);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTodo = async () => {
    if (!DeleteId) return;

    try {
      deleteTodo(DeleteId, {
        onSuccess: () => {
          toast.success("Todo deleted successfully");
          setDeleteDialogOpen(false);
        },
        onError: () => {
          toast.error("Failed to delete Todo");
        },
      });
    } catch (error) {
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleMarkComplete = async (id: number) => {
    setMarkID(id);
    const body: any = {
      is_completed: true,
    };
    try {
      updateTodo(body, {
        onSuccess: () => {
          toast.success("Task marked complete successfully");
        },
        onError: () => {
          toast.error("unable to marker completed");
        },
      });
    } catch (error) {
      toast.error("unable to marker completed");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3 },
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <AnimatePresence>
        {openTodo && (
          <AddTodo
            open={openTodo}
            setOpen={setOpenTodo}
            editData={editData}
            setEditData={setEditData}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="bg-white rounded-xl shadow-lg p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout
      >
        <motion.div
          className="flex justify-between items-center mb-6"
          variants={itemVariants}
        >
          <motion.h2
            className="text-2xl font-semibold text-gray-800"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Tasks
          </motion.h2>
          <div className="flex gap-2">
            <motion.div
              className="relative flex-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9"
              />
            </motion.div>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                onClick={() => setOpenTodo(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition duration-300"
              >
                <motion.div
                  animate={{ rotate: openTodo ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Plus className="h-4 w-4" />
                </motion.div>
                Add Todo
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div className="overflow-x-auto" variants={itemVariants}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Task Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="wait">
                {paginatedTodos?.length > 0 ? (
                  paginatedTodos.map((todo, index) => (
                    <motion.tr
                      key={todo.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ delay: index * 0.05 }}
                      layout
                      className="border-b"
                      whileHover={{
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <TableCell className="font-medium">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {todo.title}
                        </motion.span>
                      </TableCell>
                      <TableCell>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.15 }}
                        >
                          {todo.description}
                        </motion.span>
                      </TableCell>
                      <TableCell>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {moment(todo.task_due_date).format("lll")}
                        </motion.span>
                      </TableCell>
                      <TableCell>
                        <motion.div
                          variants={badgeVariants}
                          initial="initial"
                          animate="animate"
                          whileHover="hover"
                        >
                          <Badge
                            className={`p-1 rounded transition-colors ${
                              todo.completed
                                ? "bg-green-100 text-green-600 hover:bg-green-200"
                                : "bg-gray-100 text-gray-500 hover:text-green-600"
                            }`}
                          >
                            {todo.completed ? "Completed" : "Pending"}
                          </Badge>
                        </motion.div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              size="sm"
                              onClick={() => handleMarkComplete(todo?.id)}
                            >
                              <motion.div
                                whileHover={{ scale: 1.2 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Check className="h-4 w-4" />
                              </motion.div>
                              <span className="sr-only">Complete</span>
                            </Button>
                          </motion.div>
                          <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              size="sm"
                              onClick={() => navigate(`/todos/${todo?.id}`)}
                            >
                              <motion.div
                                whileHover={{ scale: 1.2 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Eye className="h-4 w-4" />
                              </motion.div>
                              <span className="sr-only">View</span>
                            </Button>
                          </motion.div>
                          <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button size="sm" onClick={() => editOpen(todo)}>
                              <motion.div
                                whileHover={{ scale: 1.2, rotate: 15 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Pencil className="h-4 w-4" />
                              </motion.div>
                              <span className="sr-only">Edit</span>
                            </Button>
                          </motion.div>
                          <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(todo.id)}
                            >
                              <motion.div
                                whileHover={{ scale: 1.2, rotate: -15 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.div>
                              <span className="sr-only">Delete</span>
                            </Button>
                          </motion.div>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-gray-500"
                    >
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        No tasks found. Add one to get started!
                      </motion.div>
                    </TableCell>
                  </motion.tr>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </motion.div>

        {/* Pagination Controls */}
        <AnimatePresence>
          {totalPages > 1 && (
            <motion.div
              className="flex items-center justify-between mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.p
                className="text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + todosPerPage, todos?.length)} of{" "}
                {todos?.length} tasks
              </motion.p>
              <div className="flex items-center gap-2">
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                </motion.div>
                <motion.span
                  className="px-2 text-sm text-gray-700"
                  key={currentPage}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  Page {currentPage} of {totalPages}
                </motion.span>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              onClick={confirmDeleteTodo}
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

export default Task;

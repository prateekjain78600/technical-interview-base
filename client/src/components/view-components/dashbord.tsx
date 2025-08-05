import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from "./AuthProvider";
import { Button } from "../ui/button";
import Task from "./tabsData/task";
import axios from "axios";
import Category from "./tabsData/category";
import Tags from "./tabsData/tags";
import { AnimatePresence, motion } from "framer-motion";
import { FetchAllTodoList } from "./api/todo";
import { Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";

interface Todo {
  id: number;
  title: string;
  description: string;
  categoryId: number | null;
  tagIds: number[];
  completed: boolean;
  createdAt: string;
  task_due_date: string;
}
interface TabConfig {
  value: string;
  label: string;
  component: React.ComponentType<any>;
}

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: getAllData } = FetchAllTodoList(0, 100, searchQuery);
  console.log("todos", todos);
  useEffect(() => {
    setTodos(
      getAllData?.data?.rows.map((item: any) => ({
        ...item,
        id: item.id,
        title: item.task_name,
        description: item.task_description,
        createdAt: item.created_at,
        completed: item.is_completed,
      }))
    );
  }, [getAllData]);
  console.log("daa", todos);
  const tabConfigs: TabConfig[] = [
    {
      value: "tasks",
      label: "Tasks",
      component: Task,
    },
    {
      value: "categories",
      label: "Categories",
      component: Category,
    },
    {
      value: "tags",
      label: "Tags",
      component: Tags,
    },
  ];
  const [activeTab, setActiveTab] = React.useState<string>(tabConfigs[0].value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900 p-4"
    >
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-800">
            Smart Todo Dashboard
          </h1>
          <Button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 shadow-md"
          >
            <motion.div transition={{ duration: 0.2 }}>
              <LogOut className="h-4 w-4" />
            </motion.div>
            Logout
          </Button>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {tabConfigs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabConfigs.map((tab) => {
            const Component = tab.component;
            return (
              <AnimatePresence key={tab.value} mode="wait">
                {activeTab === tab.value && (
                  <TabsContent value={tab.value}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      {tab.value === "tasks" ? (
                        <Component
                          todos={todos}
                          searchQuery={searchQuery}
                          setSearchQuery={setSearchQuery}
                        />
                      ) : (
                        <Component />
                      )}
                    </motion.div>
                  </TabsContent>
                )}
              </AnimatePresence>
            );
          })}
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Dashboard;

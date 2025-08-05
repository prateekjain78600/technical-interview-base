import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const addTodo = async (formdata: FormData) => {
  try {
    const response = await axios.post<any>(
      "http://localhost:3000/api/v1/todo/create",
      formdata
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to add todo");
  }
};

export const AddTodo1 = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addTodo,
    retry: 2,
    retryDelay: 1000,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchTodos"] });
    },
  });
};

const fetchAllTodoList = async (
  page: number,
  rowsPerPage: number,
  searchQuery: string
) => {
  try {
    const { data } = await axios.get<any>(
      `http://localhost:3000/api/v1/todo/fetch?page=${
        page + 1
      }&limit=${rowsPerPage}&search=${searchQuery}`
    );
    return data;
  } catch (error) {}
};

export const FetchAllTodoList = (
  page: number,
  rowsPerPage: number,
  searchQuery: string
) => {
  return useQuery({
    queryKey: ["fetchTodos", page, rowsPerPage, searchQuery],
    queryFn: () => fetchAllTodoList(page, rowsPerPage, searchQuery),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    structuralSharing: true,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 3000),
  });
};

const updateTodo = async (formdata: FormData, id: number | null) => {
  try {
    const response = await axios.patch<any>(
      `http://localhost:3000/api/v1/todo/update/${id}`,
      formdata
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to update device"
    );
  }
};

export const UpdateTodo = (id: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formdata: FormData) => updateTodo(formdata, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchTodos"] });
      queryClient.invalidateQueries({ queryKey: ["fetchTodosById", id] });
    },
  });
};

const deleteTodo = async (id: number) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/v1/todo/delete/${id}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to delete todo");
  }
};
export const DeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchTodos"] });
    },
  });
};

const TodoDetails = async (id: string) => {
  const { data } = await axios.get(`http://localhost:3000/api/v1/todo/${id}`);
  return data?.data?.rows?.[0];
};

export const GetTodoById = (id: string) => {
  return useQuery({
    queryKey: ["fetchTodosById", id],
    queryFn: () => TodoDetails(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

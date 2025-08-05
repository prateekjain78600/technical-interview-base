import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/view-components/dashbord";
import Login from "./components/view-components/login";
import Register from "./components/view-components/register";
import { AuthProvider } from "./components/view-components/AuthProvider";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { PublicRoute } from "./components/publicRoute";
import { ProtectedRoute } from "./components/protectedRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Viewtodos from "./components/view-components/view";
const App = () => {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/todos/:id" element={<Viewtodos />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;

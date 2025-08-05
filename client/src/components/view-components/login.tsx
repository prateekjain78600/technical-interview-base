import { ChangeEvent, useState } from "react";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
type FormState = {
  email: string;
  password: string;
};
const Login = () => {
  const {
    handleSubmit,
    setValue,
    formState: { errors },
    register,
    clearErrors,
    getValues,
  } = useForm<FormState>();

  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue(name as keyof FormState, value);
    if (errors[name as keyof FormState]) {
      clearErrors(name as keyof FormState);
    }
  };
  const onSubmit = async () => {
    try {
      const values = getValues();
      const success = await login(values?.email, values?.password);
      if (success) {
        toast.success("login successfully");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to login");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-teal-50 to-indigo-100">
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-teal-500 text-white p-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md text-center"
        >
          <h2 className="text-6xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-xl mb-8">Log in to access your dashboard.</p>
          <img
            src="https://illustrations.popsy.co/gray/dashboard-chart.svg"
            alt="Illustration"
            className="w-3/4 mx-auto"
          />
        </motion.div>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12 bg-white border-red-100">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md border border-gray-200 rounded-2xl p-8 shadow-md bg-white"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-8 text-center">
              <div className="mx-auto bg-teal-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow">
                <Lock className="w-6 h-6 text-teal-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">Log In</h1>
              <p className="text-gray-500 text-sm">
                Please enter your credentials
              </p>
            </div>

            <div className="space-y-5">
              <motion.div initial="hidden" animate="visible" custom={0}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" />
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    type="email"
                    name="email"
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition text-gray-900"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * 1, duration: 0.6 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border transition text-gray-900 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-400 focus:border-red-500"
                        : "border-gray-300 focus:ring-teal-400 focus:border-teal-500"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {errors?.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors?.password?.message}
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </motion.button>

              <div className="text-center text-sm text-gray-600 mt-4">
                Don’t have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-teal-600 hover:underline font-medium"
                >
                  Sign up
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

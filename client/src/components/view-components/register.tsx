import { ChangeEvent, useState } from "react";
import { Lock, Mail, Eye, EyeOff, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "./AuthProvider";

type RegisterFormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormState>();

  const { registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue(name as keyof RegisterFormState, value);
    if (errors[name as keyof RegisterFormState]) {
      clearErrors(name as keyof RegisterFormState);
    }
  };

  const onSubmit = async () => {
    const values = getValues();

    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const success = await registerUser(
        values?.name,
        values?.email,
        values?.password
      );
      if (success) {
        toast.success("Registered successfully");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Failed to register");
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
          <h2 className="text-6xl font-bold mb-4">Join Us!</h2>
          <p className="text-xl mb-8">Create an account to get started.</p>
          <img
            src="https://illustrations.popsy.co/gray/add-user.svg"
            alt="Illustration"
            className="w-3/4 mx-auto"
          />
        </motion.div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md border border-gray-200 rounded-2xl p-8 shadow-md bg-white"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-8 text-center">
              <div className="mx-auto bg-teal-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow">
                <User className="w-6 h-6 text-teal-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">Sign Up</h1>
              <p className="text-gray-500 text-sm">Create your account</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" />
                  <input
                    {...register("name", {
                      required: "Name is required",
                    })}
                    name="name"
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition text-gray-900"
                    placeholder="Your name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
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
                    name="email"
                    type="email"
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
              </div>
              <div>
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
                    placeholder="*******"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                    })}
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border transition text-gray-900 ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-400 focus:border-red-500"
                        : "border-gray-300 focus:ring-teal-400 focus:border-teal-500"
                    }`}
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </motion.button>

              <div className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-teal-600 hover:underline font-medium"
                >
                  Log in
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

// const SignUpPage = () => {
//   return (
//     <div>h</div>)}

// export default SignUpPage;

import { useState } from "react";

import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthstore } from "../store/useAuthstore.js";

const SignUpPage = () => {
  const { signup, isSigningUp } = useAuthstore(); // Destructure Zustand store methods and state
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // Validate form inputs

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    try {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      toast.success("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login page in 2 sec after successful signup
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="card w-full max-w-md md:shadow-xl shadow-accent bg-base-100">
        <div className="card-body">
          <div className="text-center mb-8">
            <h1 className="text-3xl text-base-content font-bold flex items-center justify-center gap-2">
              <MessageSquare className="text-primary" size={28} />
              BitTalk
            </h1>
            <p className="mt-2 text-sm text-base-content">
              Create your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Full Name</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 -content size-5" />
                <input
                  type="text"
                  placeholder="Jahan Sid"
                  className="input input-bordered w-full pl-10 transition-all duration-200  focus:outline-none focus:ring-2 focus:ring-base-content focus:border-transparent"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Email</span>
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 -content"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="input input-bordered w-full pl-10 transition-all duration-200  focus:outline-none focus:ring-2 focus:ring-base-content focus:border-transparent"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Password</span>
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 -content"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 transition-all duration-200  focus:outline-none focus:ring-2 focus:ring-base-content focus:border-transparent"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  minLength="6"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-6"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Signing Up...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <span className="text-sm text-base-content/80 ">
                Already have an account?{" "}
                <Link to="/login" className=" text-primary hover:underline">
                  Login here
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

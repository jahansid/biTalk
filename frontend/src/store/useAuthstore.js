import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
export const useAuthstore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isAuthChecking: true,

  // Check authentication status
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ isAuthChecking: false });
    }
  },

  //SignUp function
  signup: async (formData) => {
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      set({ authUser: res.data }); // Set authenticated user
      toast.success("Account created successfully!");
      return res.data; // Return user data for further use
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      throw error; // Re-throw error for component-level handling
    } finally {
      set({ isSigningUp: false });
    }
  },
}));

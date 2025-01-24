import { create } from "zustand";
import { axiosInstance } from "../../lib/axios.js";
export const useAuthstore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isAuthChecking: true,

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
}));

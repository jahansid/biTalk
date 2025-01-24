import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import { useAuthstore } from "./components/store/useAuthstore";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const { authUser, checkAuth, isAuthChecking } = useAuthstore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isAuthChecking && !authUser) {
    return (
      <div className=" flex items-center justify-center h-screen">
        <LoaderCircle className=" animate-spin size-12" />
      </div>
    );
  }

  return (
    <div className=" font-poppins">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;

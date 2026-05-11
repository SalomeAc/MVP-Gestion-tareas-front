import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./assets/layout/Layout";
import About from "./assets/pages/about/About";
import Contact from "./assets/pages/contact/Contact";
import CreateList from "./assets/pages/create-list/CreateList";
import CreateTask from "./assets/pages/create-task/CreateTask";
import Dashboard from "./assets/pages/dashboard/Dashboard";
import EditProfile from "./assets/pages/edit-profile/EditProfile";
import EditTask from "./assets/pages/edit-task/EditTask";
import Login from "./assets/pages/login/Login";
import Logout from "./assets/pages/logout/logout";
import RecoverPassword from "./assets/pages/recover-password/RecoverPassword";
import Register from "./assets/pages/register/Register";
import ResetPassword from "./assets/pages/reset-password/ResetPassword";
import Security from "./assets/pages/security/security";
import UserProfile from "./assets/pages/user-profile/Profile";
import Tasks from "./assets/pages/tasks/Tasks";
import LandingPage from "./assets/pages/landing/LandingPage";

function withLayout(component) {
  return <Layout>{component}</Layout>;
}

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/logout"
          element={withLayout(
            <RequireAuth>
              <Logout />
            </RequireAuth>
          )}
        />

        <Route
          path="/dashboard"
          element={withLayout(
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          )}
        />
        <Route
          path="/tasks"
          element={withLayout(
            <RequireAuth>
              <Tasks />
            </RequireAuth>
          )}
        />
        <Route
          path="/user-profile"
          element={withLayout(
            <RequireAuth>
              <UserProfile />
            </RequireAuth>
          )}
        />
        <Route
          path="/edit-profile"
          element={withLayout(
            <RequireAuth>
              <EditProfile />
            </RequireAuth>
          )}
        />
        <Route
          path="/security"
          element={withLayout(
            <RequireAuth>
              <Security />
            </RequireAuth>
          )}
        />
        <Route
          path="/create-list"
          element={withLayout(
            <RequireAuth>
              <CreateList />
            </RequireAuth>
          )}
        />
        <Route
          path="/create-task"
          element={withLayout(
            <RequireAuth>
              <CreateTask />
            </RequireAuth>
          )}
        />
        <Route
          path="/edit-task/:id"
          element={withLayout(
            <RequireAuth>
              <EditTask />
            </RequireAuth>
          )}
        />
        <Route
          path="/about"
          element={withLayout(
            <RequireAuth>
              <About />
            </RequireAuth>
          )}
        />
        <Route
          path="/contact"
          element={withLayout(
            <RequireAuth>
              <Contact />
            </RequireAuth>
          )}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

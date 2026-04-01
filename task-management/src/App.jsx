import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import LandingPage from "./assets/pages/landing/LandingPage";

function withLayout(component) {
  return <Layout>{component}</Layout>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/dashboard" element={withLayout(<Dashboard />)} />
        <Route path="/user-profile" element={withLayout(<UserProfile />)} />
        <Route path="/edit-profile" element={withLayout(<EditProfile />)} />
        <Route path="/security" element={withLayout(<Security />)} />
        <Route path="/create-list" element={withLayout(<CreateList />)} />
        <Route path="/create-task" element={withLayout(<CreateTask />)} />
        <Route path="/edit-task" element={withLayout(<EditTask />)} />
        <Route path="/about" element={withLayout(<About />)} />
        <Route path="/contact" element={withLayout(<Contact />)} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

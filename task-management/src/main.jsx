import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditProfile from "./pages/EditProfile";
import Password from "./pages/Password";
import CreateList from "./pages/CreateList";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* rutas con sidebar/navbar */}
        <Route element={<Layout />}>

          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/password" element={<Password />} />

          <Route path="/create-list" element={<CreateList />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
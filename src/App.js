import "./App.css";
import React from "react";
import HomePage from "./pages/HomePage/homePage";
import AuthForm from "./pages/Auth/AuthForm";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import ManagementUser from "./pages/User/ManagementUser";
import ViewUser from "./pages/User/ViewUser";
import UpdateUser from "./pages/User/UpdateUser";
import AdminUpdateUser from "./pages/User/AdminUpdateUser";
import Profile from "./pages/User/Profile";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="profile" element={<Profile/>}/>
          <Route
            path="/dashboard"
            element={
              // localStorage.getItem("token") ? (
              //   <Dashboard />
              // ) : (
              //   <>
              //     <h1 className="h-[100px] box-border 2xl:text-2xl mt-20">
              //       Không có quyền truy cập !
              //     </h1>
              //   </>
              // )
              <Dashboard />
            }
          />
          <Route path="/all-user" element={<ManagementUser />} />
          <Route path="/view-user/:id" element={<ViewUser />} />
          <Route path="/update-user/:id" element={<UpdateUser />} />
          <Route path="/admin-update-user/:id" element={<AdminUpdateUser />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

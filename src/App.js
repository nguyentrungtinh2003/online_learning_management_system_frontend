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
import AdminAddUser from "./pages/User/AdminAddUser";
import Sidebar from "./pages/Dashboard/Sidebar";
import Header from "./pages/Dashboard/Header";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <HomePage />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <AuthForm />
              </>
            }
          />
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
          <Route
            path="/all-user"
            element={
              <div className="flex m-4">
                <Sidebar />
                <div className="flex-grow-1">
                  <Header />
                  <ManagementUser />
                </div>
              </div>
            }
          />
          <Route
            path="/view-user"
            element={
              <div className="flex m-4">
                <Sidebar />
                <div className="flex-grow-1">
                  <Header />
                  <ViewUser />
                </div>
              </div>
            }
          />
          <Route
            path="/add-user"
            element={
              <div className="flex m-4">
                <Sidebar />
                <div className="flex-grow-1">
                  <Header />
                  <AdminAddUser />
                </div>
              </div>
            }
          />
          <Route path="/update-user/:id" element={<UpdateUser />} />
          <Route
            path="/admin-update-user"
            element={
              <div className="flex m-4">
                <Sidebar />
                <div className="flex-grow-1">
                  <Header />
                  <AdminUpdateUser />
                </div>
              </div>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <Profile />
              </>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;

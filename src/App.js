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
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer/Footer";
import AddCourse from "./pages/Course/AddCourse";
import AddLesson from "./pages/Lesson/AddLesson";
import AdminCourseManagement from "./pages/Dashboard/AdminManagement/AdminCourseManagement";

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
              <div className="flex">
                <Sidebar />
                <div className="flex">
                  <Header />
                  <ManagementUser />
                </div>
              </div>
            }
          />
          <Route
            path="/admin-course-management"
            element={
              <div className="flex">
                <Sidebar />
                <div className="flex-1 box-border">
                  <Header/>
                  <AdminCourseManagement/>
                </div>
              </div>
            }
          />
          <Route
            path="/view-user"
            element={
              <div className="flex">
                <Sidebar />
                <div className="flex">
                  <Header />
                  <ViewUser />
                </div>
              </div>
            }
          />
          <Route
            path="/add-user"
            element={
              <div className="flex">
                <Sidebar />
                <div className="flex">
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
              <div className="flex">
                <Sidebar />
                <div className="flex">
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
          <Route
            path="/add-course"
            element={
              <>
                <Navbar />
                <AddCourse />
              </>
            }
          />
          <Route
            path="/add-lesson"
            element={
              <>
                <Navbar />
                <AddLesson />
              </>
            }
          />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;

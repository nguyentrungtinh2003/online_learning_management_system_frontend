import "./App.css";
import React from "react";
import HomePage from "./pages/HomePage/homePage";
import AuthForm from "./pages/Auth/AuthForm";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import ManagementUser from "./pages/User/ManagementUser";
import ViewUser from "./pages/User/ViewUser";
import UpdateUser from "./pages/User/UpdateUser";
import AdminUpdateUser from "./pages/User/AdminUpdateUser";
import Profile from "./pages/User/Profile";
import AdminAddUser from "./pages/User/AdminAddUser";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer/Footer";
import AddCourse from "./pages/Course/AddCourse";
import AddLesson from "./pages/Lesson/AddLesson";
<<<<<<< HEAD
import ManagementCourse from "./pages/Course/ManagementCourse";
import WatchLesson from "./pages/Lesson/WatchLesson";
import ManagementLesson from "./pages/Lesson/ManagementLesson";
import UpdateCourse from "./pages/Course/UpdateCourse";
import UpdateLesson from "./pages/Lesson/UpdateLesson";
import Dashboard from "./pages/Dashboard/Dashboard";
=======
import AdminCourseManagement from "./pages/Dashboard/AdminManagement/AdminCourseManagement";
>>>>>>> 415d4b4e01e61ac30d6c897de8ecdfcf38103112

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
<<<<<<< HEAD
              <>
                <Navbar />
                <Dashboard />
              </>
=======
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
>>>>>>> 415d4b4e01e61ac30d6c897de8ecdfcf38103112
            }
          />
          <Route path="/all-user" element={<ManagementUser />} />
          <Route path="/view-user" element={<ViewUser />} />
          <Route path="/add-user" element={<AdminAddUser />} />
          <Route path="/update-user/:id" element={<UpdateUser />} />
<<<<<<< HEAD
          <Route path="/admin-update-user" element={<AdminUpdateUser />} />
=======
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
>>>>>>> 415d4b4e01e61ac30d6c897de8ecdfcf38103112
          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <Profile />
              </>
            }
          />
          <Route path="/all-course" element={<ManagementCourse />} />
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
            path="/update-course/:id"
            element={
              <>
                <Navbar />
                <UpdateCourse />
              </>
            }
          />
          <Route
            path="/all-lesson"
            element={
              <>
                <Navbar />
                <ManagementLesson />
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
          <Route
            path="/update-lesson/:id"
            element={
              <>
                <Navbar />
                <UpdateLesson />
              </>
            }
          />
          <Route
            path="/watch-lesson"
            element={
              <>
                <Navbar />
                <WatchLesson />
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

import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "../components/Sidebar/AdminSidebar";
import Dashboard from "../pages/Dashboard/Dashboard";
import ManagementUser from "../pages/User/ManagementUser";
import AdminAddUser from "../pages/User/AdminAddUser";
import AdminUpdateUser from "../pages/User/AdminUpdateUser";
import ManagementCourse from "../pages/Course/ManagementCourse";
import AddCourse from "../pages/Course/AddCourse";
import UpdateCourse from "../pages/Course/EditCourse";
import ManagementLesson from "../pages/Lesson/ManagementLesson";
import AddLesson from "../pages/Lesson/AddLesson";
import EditLesson from "../pages/Lesson/EditLesson";
import QuizzManagement from "../pages/Quizz/QuizzManagement";
import AddQuizz from "../pages/Quizz/AddQuizz";
import CommentManagement from "../pages/Comment/CommentManagement";
import AdminBlogManagement from "../pages/Blog/AdminBlogManagement";
import AdminAddBlog from "../pages/Blog/AdminAddBlog";
import AdminEditBlog from "../pages/Blog/AdminEditBlog";
import AdminPaymentManagement from "../pages/Payment/AdminPaymentManagement";
import AdminSettings from "../pages/Dashboard/AdminSetting";

const AdminRouter = () => {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <div className="flex h-fit bg-focolor">
            <AdminSidebar />
            <Dashboard />
          </div>
        }
      />
      <Route
        path="/admin/users"
        element={
          <div className="flex h-fit bg-focolor">
            <AdminSidebar />
            <ManagementUser />
          </div>
        }
      />
      <Route
        path="/admin/users/add-user"
        element={
          <div className="flex h-fit bg-focolor">
            <AdminSidebar />
            <AdminAddUser />
          </div>
        }
      />
      <Route
        path="/admin/users/edit-user/:userId"
        element={
          <div className="flex bg-focolor">
            <AdminSidebar />
            <AdminUpdateUser />
          </div>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <div className="flex h-fit bg-focolor">
            <AdminSidebar />
            <ManagementCourse />
          </div>
        }
      />
      <Route
        path="/admin/courses/add-course"
        element={
          <div className="flex h-fit bg-focolor">
            <AdminSidebar />
            <AddCourse />
          </div>
        }
      />
      <Route
        path="/admin/courses/edit-course/:id"
        element={
          <div className="flex bg-focolor">
            <AdminSidebar />
            <UpdateCourse />
          </div>
        }
      />
      <Route
        path="/admin/courses/:courseId/lessons"
        element={
          <div className="flex bg-focolor">
            <AdminSidebar />
            <ManagementLesson />
          </div>
        }
      />
      <Route
        path="/admin/courses/:courseId/lessons/add"
        element={
          <div className="flex bg-focolor">
            <AdminSidebar />
            <AddLesson />
          </div>
        }
      />
      <Route
        path="/admin/courses/:courseId/lessons/edit/:lessonId"
        element={
          <div className="flex bg-focolor">
            <AdminSidebar />
            <EditLesson />
          </div>
        }
      />
      <Route
        path="/admin/lessons/:lessonId/quizzes"
        element={
          <div className="flex bg-focolor">
            <AdminSidebar />
            <QuizzManagement />
          </div>
        }
      />
      <Route
        path="/admin/lessons/:lessonId/quizzes/add"
        element={
          <div className="flex bg-focolor">
            <AdminSidebar />
            <AddQuizz />
          </div>
        }
      />
      <Route
        path="/admin/comment"
        element={
          <div className="flex h-fit bg-focolor">
            <AdminSidebar />
            <CommentManagement />
          </div>
        }
      />
      <Route
        path="/admin/blog"
        element={
          <div className="flex h-fit bg-focolor">
            <AdminSidebar />
            <AdminBlogManagement />
          </div>
        }
      />
      <Route
        path="/admin/blog/add-blog"
        element={
          <div className="flex h-screen bg-focolor">
            <AdminSidebar />
            <AdminAddBlog />
          </div>
        }
      />
      <Route
        path="/admin/blog/edit-blog"
        element={
          <div className="flex bg-focolor">
            <AdminSidebar />
            <AdminEditBlog />
          </div>
        }
      />
      <Route
        path="/admin/payment"
        element={
          <div className="flex h-fit bg-focolor">
            <AdminSidebar />
            <AdminPaymentManagement />
          </div>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <div className="flex h-fit bg-focolor">
            <AdminSidebar />
            <AdminSettings />
          </div>
        }
      />
    </Routes>
  );
};

export default AdminRouter;

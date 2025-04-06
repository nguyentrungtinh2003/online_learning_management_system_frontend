// src/routes/AdminRoutes.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRouter from "./ProtectedRouter";
import AdminSidebar from "../components/Sidebar/AdminSidebar";

// Admin Pages
import Dashboard from "../pages/Dashboard/Dashboard";
import AdminSettings from "../pages/Dashboard/AdminSetting";
import ManagementUser from "../pages/User/ManagementUser";
import AdminAddUser from "../pages/User/AdminAddUser";
import AdminUpdateUser from "../pages/User/AdminUpdateUser";
import CommentManagement from "../pages/Comment/CommentManagement";
import AdminBlogManagement from "../pages/Blog/AdminBlogManagement";
import AdminAddBlog from "../pages/Blog/AdminAddBlog";
import AdminEditBlog from "../pages/Blog/AdminEditBlog";
import AdminPaymentManagement from "../pages/Payment/AdminPaymentManagement";
import ManagementCourse from "../pages/Course/ManagementCourse";
import AddCourse from "../pages/Course/AddCourse";
import UpdateCourse from "../pages/Course/EditCourse";
import ManagementLesson from "../pages/Lesson/ManagementLesson";
import AddLesson from "../pages/Lesson/AddLesson";
import EditLesson from "../pages/Lesson/EditLesson";
import QuizzManagement from "../pages/Quizz/QuizzManagement";
import AddQuizz from "../pages/Quizz/AddQuizz";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex bg-focolor">
              <AdminSidebar />
              <Dashboard />
            </div>
          </ProtectedRouter>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex bg-focolor">
              <AdminSidebar />
              <AdminSettings />
            </div>
          </ProtectedRouter>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex bg-focolor">
              <AdminSidebar />
              <ManagementUser />
            </div>
          </ProtectedRouter>
        }
      />

      <Route
        path="/admin/users/add-user"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex bg-focolor">
              <AdminSidebar />
              <AdminAddUser />
            </div>
          </ProtectedRouter>
        }
      />

      <Route
        path="/admin/users/edit-user/:userId"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex bg-focolor">
              <AdminSidebar />
              <AdminUpdateUser />
            </div>
          </ProtectedRouter>
        }
      />

      <Route
        path="/admin/comment"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex bg-focolor">
              <AdminSidebar />
              <CommentManagement />
            </div>
          </ProtectedRouter>
        }
      />

      <Route
        path="/admin/blog"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex bg-focolor">
              <AdminSidebar />
              <AdminBlogManagement />
            </div>
          </ProtectedRouter>
        }
      />

      <Route
        path="/admin/blog/add-blog"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex h-screen bg-focolor">
              <AdminSidebar />
              <AdminAddBlog />
            </div>
          </ProtectedRouter>
        }
      />

      <Route
        path="/admin/blog/edit-blog"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex bg-focolor">
              <AdminSidebar />
              <AdminEditBlog />
            </div>
          </ProtectedRouter>
        }
      />

      <Route
        path="/admin/payment"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex bg-focolor">
              <AdminSidebar />
              <AdminPaymentManagement />
            </div>
          </ProtectedRouter>
        }
      />

      <Route
        path="/admin/courses"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex h-fit bg-focolor">
              <AdminSidebar />
              <ManagementCourse />
            </div>
          </ProtectedRouter>
        }
      />

      <Route
        path="/admin/courses/add-course"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex h-fit bg-focolor">
              <AdminSidebar />
              <AddCourse />
            </div>
          </ProtectedRouter>
        }
      />

      <Route
        path="/admin/courses/edit-course/:id"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex bg-focolor">
              <AdminSidebar />
              <UpdateCourse />
            </div>
          </ProtectedRouter>
        }
      />

      <Route
        path="/admin/courses/:courseId/lessons"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex bg-focolor">
              <AdminSidebar />
              <ManagementLesson />
            </div>
          </ProtectedRouter>
        }
      />

      <Route
        path="/admin/courses/:courseId/lessons/add"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex bg-focolor">
              <AdminSidebar />
              <AddLesson />
            </div>
          </ProtectedRouter>
        }
      />

      <Route
        path="/admin/courses/:courseId/lessons/edit/:lessonId"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex bg-focolor">
              <AdminSidebar />
              <EditLesson />
            </div>
          </ProtectedRouter>
        }
      />

      <Route
        path="/admin/lessons/:lessonId/quizzes"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex bg-focolor">
              <AdminSidebar />
              <QuizzManagement />
            </div>
          </ProtectedRouter>
        }
      />

      <Route
        path="/admin/lessons/:lessonId/quizzes/add"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <div className="flex bg-focolor">
              <AdminSidebar />
              <AddQuizz />
            </div>
          </ProtectedRouter>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer/Footer";
import AddCourse from "./pages/Course/AddCourse";
import AddLesson from "./pages/Lesson/AddLesson";
import ManagementCourse from "./pages/Course/ManagementCourse";
import ManagementLesson from "./pages/Lesson/ManagementLesson";
import QuizzManagement from "./pages/Quizz/QuizzManagement";
import ManagementQuestion from "./pages/Question/QuestionManagement";
import LearningProgress from "./pages/User/LearningProcess";
import CommentManagement from "./pages/Comment/CommentManagement";
import AdminBlogManagement from "./pages/Blog/AdminBlogManagement";
import AdminPaymentManagement from "./pages/Payment/AdminPaymentManagement";
import PaymentPage from "./pages/Payment/PaymentPage";
import PaymentHistory from "./pages/Payment/PaymentHistory";
import RankManagement from "./pages/Ranking/RankManagement";
import AdminSidebar from "./components/Sidebar/AdminSidebar";
import AdminSettings from "./pages/Dashboard/AdminSetting";
import AdminAddBlog from "./pages/Blog/AdminAddBlog";
import UpdateCourse from "./pages/Course/EditCourse";
import AdminEditBlog from "./pages/Blog/AdminEditBlog";
import UserCourse from "./pages/Course/UserCourse";
import UserViewCourse from "./pages/Course/UserViewCourse";
import EditLesson from "./pages/Lesson/EditLesson";
import UserViewLesson from "./pages/Lesson/UserViewLesson";
import UserViewBlog from "./pages/Blog/UserViewBlog";
import UpLevelEffect from "./components/Effect/UpLevelEffect";


function App() {
  return (
    <>
      <>
        <ToastContainer />
        <Router>
          <Routes>
            <Route path="/admin/comment" element={<CommentManagement />} />
            <Route path="/admin/payment" element={<AdminPaymentManagement />} />
            <Route path="/admin/lesson" element={<ManagementLesson />} />
            <Route
              path="/admin/*"
              element={
                <div className="flex h-fit bg-focolor">
                  <AdminSidebar />
                  <Dashboard />
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
              path="/admin/users"
              element={
                <div className="flex h-fit bg-focolor">
                  <AdminSidebar />
                  <ManagementUser />
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
              path="/admin/settings"
              element={
                <div className="flex h-fit bg-focolor">
                  <AdminSidebar />
                  <AdminSettings />
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
              path="/admin/users/add-user"
              element={
                <div className="flex h-fit bg-focolor">
                  <AdminSidebar />
                  <AdminAddUser />
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
              path="/admin/users/edit-user/:userId"
              element={
                <div className="flex bg-focolor">
                  <AdminSidebar />
                  <AdminUpdateUser />
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
          </Routes>
        </Router>
      </>
      <>
        <Router>
          <Routes>
            <Route path="/test" element={<AddCourse />} />
            <Route path="/user/process" element={<LearningProgress />} />
            <Route path="/user/payment" element={<PaymentPage />} />
            <Route path="/user/payment/history" element={<PaymentHistory />} />
            <Route
              path="/"
              element={
                <div className="flex bg-focolor">
                  <AdminSidebar />
                  <HomePage />
                </div>
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
              path="/user-course"
              element={
                <div className="flex bg-focolor">
                  <AdminSidebar />
                  <UserCourse />
                </div>
              }
            />
            <Route
              path="/view-course"
              element={
                <div className="flex bg-focolor">
                  <AdminSidebar />
                  <UserViewCourse />
                </div>
              }
            />
            <Route
              path="/view-lesson"
              element={
                <div className="flex bg-focolor">
                  <AdminSidebar />
                  <UserViewLesson />
                </div>
              }
            />
            <Route path="/quiz" element={<QuizzManagement />} />
            <Route path="/lesson" element={<ManagementLesson />} />
            <Route path="/question" element={<ManagementQuestion />} />
            <Route
              path="/profile"
              element={
                <div className="flex bg-focolor">
                  <AdminSidebar />
                  <Profile />
                </div>
              }
            />
            <Route
              path="/blog"
              element={
                <div className="flex bg-focolor">
                  <AdminSidebar />
                  <UserViewBlog />
                </div>
              }
            />
            <Route
              path="/"
              element={
                <div className="flex bg-focolor">
                  <AdminSidebar />
                  <HomePage />
                </div>
              }
            />
            <Route path="effect" element={<UpLevelEffect />} />
          </Routes>
        </Router>
      </>
    </>
  );
}

export default App;

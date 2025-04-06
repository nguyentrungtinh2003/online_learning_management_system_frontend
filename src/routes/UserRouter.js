import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import AdminSidebar from "../components/Sidebar/AdminSidebar";
import AuthForm from "../pages/Auth/AuthForm";
import HomePage from "../pages/HomePage/homePage";
import LearningProgress from "../pages/User/LearningProcess";
import PaymentPage from "../pages/Payment/PaymentPage";
import PaymentHistory from "../pages/Payment/PaymentHistory";
import PaymentSuccess from "../pages/Payment/PaymentSuccess ";
import UserCourse from "../pages/Course/UserCourse";
import UserViewCourse from "../pages/Course/UserViewCourse";
import UserViewLesson from "../pages/Lesson/UserViewLesson";
import UserViewBlog from "../pages/Blog/UserViewBlog";
import QuizzManagement from "../pages/Quizz/QuizzManagement";
import ManagementLesson from "../pages/Lesson/ManagementLesson";
import ManagementQuestion from "../pages/Question/QuestionManagement";
import Profile from "../pages/User/Profile";
import UpLevelEffect from "../components/Effect/UpLevelEffect";

const UserRouter = () => {
  return (
    <Routes>
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
        path="/user/process"
        element={
          <div className="flex bg-focolor">
            <AdminSidebar />
            <LearningProgress />
          </div>
        }
      />
      <Route
        path="/user/payment"
        element={
          <div className="flex bg-focolor">
            <AdminSidebar />
            <PaymentPage />
          </div>
        }
      />
      <Route
        path="/user/payment/history"
        element={
          <div className="flex bg-focolor">
            <AdminSidebar />
            <PaymentHistory />
          </div>
        }
      />
      <Route path="/payment-success" element={<PaymentSuccess />} />
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
        path="/quiz"
        element={
          <div className="flex bg-focolor">
            <AdminSidebar />
            <QuizzManagement />
          </div>
        }
      />
      <Route
        path="/lesson"
        element={
          <div className="flex bg-focolor">
            <AdminSidebar />
            <ManagementLesson />
          </div>
        }
      />
      <Route
        path="/question"
        element={
          <div className="flex bg-focolor">
            <AdminSidebar />
            <ManagementQuestion />
          </div>
        }
      />
      <Route
        path="/profile"
        element={
          <div className="flex bg-focolor">
            <AdminSidebar />
            <Profile />
          </div>
        }
      />
      <Route path="/effect" element={<UpLevelEffect />} />
    </Routes>
  );
};

export default UserRouter;

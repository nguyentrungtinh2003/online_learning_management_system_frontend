import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import AdminSidebar from "../components/Sidebar/AdminSidebar";
import AuthForm from "../pages/Auth/AuthForm";
import HomePage from "../pages/HomePage/homePage";
import LearningProgress from "../pages/User/LearningProcess";
import PaymentPage from "../pages/Payment/PaymentPage";
import PaymentHistory from "../pages/Payment/PaymentHistory";
import PaymentSuccessPayPal from "../pages/Payment/PaymentSuccessPayPal ";
import VNPaySuccess from "../pages/Payment/PaymentSuccessVNPay";
import UserCourse from "../pages/Course/UserCourse";
import UserViewCourse from "../pages/Course/UserViewCourse";
import UserViewLesson from "../pages/Lesson/UserViewLesson";
import UserViewBlog from "../pages/Blog/UserViewBlog";
import QuizzManagement from "../pages/Quizz/QuizzManagement";
import ManagementLesson from "../pages/Lesson/ManagementLesson";
import ManagementQuestion from "../pages/Question/QuestionManagement";
import Profile from "../pages/User/Profile";
import UpLevelEffect from "../components/Effect/UpLevelEffect";
import ProtectedRouter from "./ProtectedRouter";
import NotFound from "../pages/NotFound/NotFound";
import UserRanking from "../pages/Ranking/UserRanking";

const UserRouter = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
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
          <ProtectedRouter requiredRoles={["ADMIN", "STUDENT", "TEACHER"]}>
            <div className="flex bg-focolor">
              <AdminSidebar />
              <LearningProgress />
            </div>
          </ProtectedRouter>
        }
      />
      <Route
        path="/user/payment"
        element={
          <ProtectedRouter requiredRoles={["ADMIN", "STUDENT", "TEACHER"]}>
            <div className="flex bg-focolor">
              <AdminSidebar />
              <PaymentPage />
            </div>
          </ProtectedRouter>
        }
      />
      <Route
        path="/user/payment/history"
        element={
          <ProtectedRouter requiredRoles={["ADMIN", "STUDENT", "TEACHER"]}>
            <div className="flex bg-focolor">
              <AdminSidebar />
              <PaymentHistory />
            </div>
          </ProtectedRouter>
        }
      />
      <Route path="/payment-success" element={<PaymentSuccessPayPal />} />
      <Route path="/vnpay-return" element={<VNPaySuccess />} />
      <Route
        path="/user-course"
        element={
          <ProtectedRouter requiredRoles={["ADMIN", "STUDENT", "TEACHER"]}>
            <div className="flex bg-focolor">
              <AdminSidebar />
              <UserCourse />
            </div>
          </ProtectedRouter>
        }
      />
      <Route
        path="/view-course/:id"
        element={
          <ProtectedRouter requiredRoles={["ADMIN", "STUDENT", "TEACHER"]}>
            <div className="flex bg-focolor">
              <AdminSidebar />
              <UserViewCourse />
            </div>
          </ProtectedRouter>
        }
      />
      <Route
        path="/view-lesson"
        element={
          <ProtectedRouter requiredRoles={["ADMIN", "STUDENT", "TEACHER"]}>
            <div className="flex bg-focolor">
              <AdminSidebar />
              <UserViewLesson />
            </div>
          </ProtectedRouter>
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
          <ProtectedRouter requiredRoles={["ADMIN", "STUDENT", "TEACHER"]}>
            <div className="flex bg-focolor">
              <AdminSidebar />
              <Profile />
            </div>
          </ProtectedRouter>
        }
      />
      <Route
        path="/ranking"
        element={
          <div className="flex bg-focolor">
            <AdminSidebar />
            <UserRanking />
          </div>
        }
      />
      <Route path="/effect" element={<UpLevelEffect />} />
    </Routes>
  );
};

export default UserRouter;

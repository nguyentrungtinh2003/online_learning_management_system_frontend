import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import AuthForm from "../pages/Auth/AuthForm";
import PaymentSuccessPayPal from "../pages/Payment/PaymentSuccessPayPal ";
import VNPaySuccess from "../pages/Payment/PaymentSuccessVNPay";
import NotFound from "../pages/NotFound/NotFound";
import UpLevelEffect from "../components/Effect/UpLevelEffect";

import ProtectedRouter from "./ProtectedRouter";

import HomePage from "../pages/HomePage/homePage";
import LearningProgress from "../pages/User/LearningProcess";
import PaymentPage from "../pages/Payment/PaymentPage";
import PaymentHistory from "../pages/Payment/PaymentHistory";
import UserCourse from "../pages/Course/UserCourse";
import UserViewCourse from "../pages/Course/UserViewCourse";
import UserViewLesson from "../pages/Lesson/UserViewLesson";
import UserViewBlog from "../pages/Blog/UserViewBlog";
import QuizzManagement from "../pages/Quizz/QuizzManagement";
import ManagementLesson from "../pages/Lesson/ManagementLesson";
import ManagementQuestion from "../pages/Question/QuestionManagement";
import Profile from "../pages/User/Profile";
import UserRanking from "../pages/Ranking/UserRanking";
import UserLayout from "../components/Layout/UserLayout";
import UserSetting from "../pages/User/UserSetting";

const UserRouter = () => {
  return (
    <Routes>
      {/* Route không có layout */}
      <Route path="/login" element={<AuthForm />} />
      <Route path="/payment-success" element={<PaymentSuccessPayPal />} />
      <Route path="/vnpay-return" element={<VNPaySuccess />} />
      <Route path="/effect" element={<UpLevelEffect />} />
      <Route path="*" element={<NotFound />} />

      {/* Route có layout (dùng ProtectedRouter bọc ngoài) */}
      <Route
        path="/"
        element={
          <ProtectedRouter requiredRoles={["ADMIN", "STUDENT", "TEACHER"]}>
            <UserLayout/>
          </ProtectedRouter>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="user/process" element={<LearningProgress />} />
        <Route path="user/payment" element={<PaymentPage />} />
        <Route path="user/payment/history" element={<PaymentHistory />} />
        <Route path="user-course" element={<UserCourse />} />
        <Route path="view-course/:id" element={<UserViewCourse />} />
        <Route path="view-lesson/:courseId" element={<UserViewLesson />} />
        <Route path="blog" element={<UserViewBlog />} />
        <Route path="quiz" element={<QuizzManagement />} />
        <Route path="lesson" element={<ManagementLesson />} />
        <Route path="question" element={<ManagementQuestion />} />
        <Route path="profile" element={<Profile />} />
        <Route path="ranking" element={<UserRanking />} />
        <Route path="settings" element={<UserSetting/>} />
      </Route>
    </Routes>
  );
};

export default UserRouter;

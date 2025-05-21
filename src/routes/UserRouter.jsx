import { Routes, Route } from "react-router-dom";

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
import Profile from "../pages/User/Profile";
import UserRanking from "../pages/Ranking/UserRanking";
import UserLayout from "../components/Layout/UserLayout";
import ChatRoom from "../pages/Chat/ChatRoom";
import UserQuizz from "../pages/Quizz/UserQuizz";
import UserQuizzResult from "../pages/Quizz/UserQuizzResult";
import ViewLessonDetail from "../pages/Lesson/ViewLessonDetail";
import OAuthSuccess from "../pages/Auth/OAuthSuccess";

const UserRouter = () => {
  return (
    <>
      {/* Thêm ToastContainer */}
      <Routes>
        {/* Route không có layout */}
        <Route path="/login" element={<AuthForm />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/payment-success" element={<PaymentSuccessPayPal />} />
        <Route path="/vnpay-return" element={<VNPaySuccess />} />
        <Route path="/effect" element={<UpLevelEffect />} />
        <Route path="*" element={<NotFound />} />

        {/* Các route cần login */}
        <Route element={<UserLayout />}>
          {/* Không yêu cầu đăng nhập */}
          <Route index element={<HomePage />} />
          <Route path="blog" element={<UserViewBlog />} />
          <Route path="ranking" element={<UserRanking />} />
          <Route path="view-course/:id" element={<UserViewCourse />} />

          {/* Yêu cầu đăng nhập và quyền tương ứng */}
          <Route
            path="user/process"
            element={
              <ProtectedRouter requiredRoles={["STUDENT", "ADMIN", "TEACHER"]}>
                <LearningProgress />
              </ProtectedRouter>
            }
          />

          <Route
            path="user/payment"
            element={
              <ProtectedRouter requiredRoles={["STUDENT", "ADMIN", "TEACHER"]}>
                <PaymentPage />
              </ProtectedRouter>
            }
          />

          <Route
            path="user/payment/history"
            element={
              <ProtectedRouter requiredRoles={["STUDENT", "ADMIN", "TEACHER"]}>
                <PaymentHistory />
              </ProtectedRouter>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRouter requiredRoles={["STUDENT", "TEACHER", "ADMIN"]}>
                <ChatRoom />
              </ProtectedRouter>
            }
          />

          <Route
            path="user-course"
            element={
              <ProtectedRouter requiredRoles={["STUDENT", "ADMIN", "TEACHER"]}>
                <UserCourse />
              </ProtectedRouter>
            }
          />

          <Route
            path="view-lesson/:courseId"
            element={
              <ProtectedRouter requiredRoles={["STUDENT", "ADMIN", "TEACHER"]}>
                <UserViewLesson />
              </ProtectedRouter>
            }
          />

          <Route
            path="view-lesson-detail/:lessonId"
            element={
              <ProtectedRouter requiredRoles={["STUDENT", "ADMIN", "TEACHER"]}>
                <ViewLessonDetail />
              </ProtectedRouter>
            }
          />

          <Route
            path="view-quiz/:quizId"
            element={
              <ProtectedRouter requiredRoles={["STUDENT", "ADMIN", "TEACHER"]}>
                <UserQuizz />
              </ProtectedRouter>
            }
          />

          <Route
            path="view-result/:quizId"
            element={
              <ProtectedRouter requiredRoles={["STUDENT", "ADMIN", "TEACHER"]}>
                <UserQuizzResult />
              </ProtectedRouter>
            }
          />

          <Route
            path="profile"
            element={
              <ProtectedRouter requiredRoles={["STUDENT", "TEACHER", "ADMIN"]}>
                <Profile />
              </ProtectedRouter>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default UserRouter;

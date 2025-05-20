// src/routes/AdminRoutes.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRouter from "./ProtectedRouter";

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
import AddLesson from "../pages/Lesson/AddLesson";
import EditLesson from "../pages/Lesson/EditLesson";
import QuizzManagementByLesson from "../pages/Quizz/QuizzManagementByLesson";
import UpdateQuizz from "../pages/Quizz/UpdateQuizz";
import QuestionManagementByQuiz from "../pages/Question/QuestionManagementByQuiz";
import AddQuestion from "../pages/Question/AddQuestion";
import UserQuizz from "../pages/Quizz/UserQuizz";
import AdminLayout from "../components/Layout/AdminLayout";
import ManagementLesson from "../pages/Lesson/ManagementLesson";
import AddLessonByCourse from "../pages/Lesson/AddLessonByCourse";
import QuizzManagement from "../pages/Quizz/QuizzManagement";
import ManagementlessonByCourse from "../pages/Lesson/ManagementLessonByCourse";
import AddQuizz from "../pages/Quizz/AddQuizz";
import QuestionManagement from "../pages/Question/QuestionManagement";
import AddQuestionByQuiz from "../pages/Question/AddQuestionByQuiz";
import AddQuizzByLesson from "../pages/Quizz/AddQuizzByLesson";
import UserViewCourse from "../pages/Course/UserViewCourse";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRouter requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRouter>
        }
      >
        {/* Các route con dùng chung layout */}
        <Route index element={<Dashboard />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="users" element={<ManagementUser />} />
        <Route path="users/add-user" element={<AdminAddUser />} />
        <Route path="users/edit-user/:userId" element={<AdminUpdateUser />} />
        <Route path="comment" element={<CommentManagement />} />
        <Route path="blog" element={<AdminBlogManagement />} />
        <Route path="blog/add-blog" element={<AdminAddBlog />} />
        <Route path="blog/edit-blog/:id" element={<AdminEditBlog />} />
        <Route path="payment" element={<AdminPaymentManagement />} />
        <Route path="courses" element={<ManagementCourse />} />
        <Route path="admin-view-course/:id" element={<UserViewCourse />} />
        <Route path="lessons" element={<ManagementLesson />} />
        <Route path="quizzes" element={<QuizzManagement />} />
        <Route path="questions" element={<QuestionManagement />} />
        <Route path="lessons/add" element={<AddLesson />} />
        <Route path="quizzes/add" element={<AddQuizz />} />
        <Route path="questions/add" element={<AddQuestion />} />
        <Route path="courses/add-course" element={<AddCourse />} />
        <Route path="courses/edit-course/:id" element={<UpdateCourse />} />

        <Route
          path="courses/:courseId/lessons"
          element={<ManagementlessonByCourse />}
        />
        <Route
          path="courses/:courseId/lessons/add"
          element={<AddLessonByCourse />}
        />
        <Route path="lessons/edit/:id" element={<EditLesson />} />
        <Route
          path="lessons/:lessonId/quizzes"
          element={<QuizzManagementByLesson />}
        />
        <Route
          path="lessons/:lessonId/quizzes/add"
          element={<AddQuizzByLesson />}
        />
        <Route
          path="lessons/:lessonId/quizzes/edit/:quizId"
          element={<UpdateQuizz />}
        />
        <Route path="quiz-test/:quizId" element={<UserQuizz />} />
        <Route
          path="quizzes/:quizId/questions"
          element={<QuestionManagementByQuiz />}
        />
        <Route
          path="quizzes/:quizId/questions/add"
          element={<AddQuestionByQuiz />}
        />
        <Route path="courses/view-course/:id" element={<UserViewCourse />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;

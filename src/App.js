import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AdminRouter from "./routes/AdminRouter";
import UserRouter from "./routes/UserRouter";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/admin/*" element={<AdminRouter />} />
          <Route path="/*" element={<UserRouter />} />
          <Route path="/404" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

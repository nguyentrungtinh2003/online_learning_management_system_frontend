import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AdminRouter from "./routes/AdminRouter";
import UserRouter from "./routes/UserRouter";
import NotFound from "./pages/NotFound/NotFound";
import Forbidden from "./pages/NotFound/Forbidden";
import ServerError from "./pages/NotFound/ServerError";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/admin/*" element={<AdminRouter />} />
          <Route path="/*" element={<UserRouter />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/403" element={<Forbidden />} />
          <Route path="/500" element={<ServerError />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

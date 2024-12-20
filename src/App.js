import "./App.css";
import React from "react";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/homePage";
import AuthForm from "./pages/Auth/AuthForm";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
    <Routes>
      <Route path="/"element={<HomePage/>} />
      <Route path="/login"element={<AuthForm/>} />
    </Routes>
    </>
  );
}

export default App;

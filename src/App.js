import "./App.css";
import React from "react";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/homePage";
import AuthForm from "./pages/Auth/AuthForm";

function App() {
  return (
    <>
      <Navbar />
      <HomePage />
      <AuthForm />
    </>
  );
}

export default App;

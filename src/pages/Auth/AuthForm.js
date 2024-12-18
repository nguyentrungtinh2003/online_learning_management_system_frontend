import React, { useState, useRef, useEffect } from "react"
import './AuthForm.css'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const formContainerRef = useRef(null);

  useEffect(() => {
    const formContainer = formContainerRef.current;
    formContainer.classList.add("animate");

    setTimeout(() => {
      formContainer.classList.remove("animate");
    }, 1000); // Thời gian kéo dài của animation
  }, [isLogin]); // Phụ thuộc vào trạng thái isLogin
  return (
    <div className="h-[800px] flex justify-center items-center ">
      <div id="toggle-form" className="h-[600px] shadow-custom px-40 py-10" ref={formContainerRef}>
        <div className="flex justify-center items-center font-bold text-2xl text-gray-500 mb-10">
          <button className="mr-20 shadow-custom-btn-off px-10 py-3 rounded-2xl"
            id={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button className="shadow-custom-btn-off px-10 py-3 rounded-2xl"
            id={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        {isLogin ? (
          <>
            <div className="grid">
              <input className="border-2 h-14 pl-4 rounded-xl my-2" type="text" placeholder="Username" />
              <input className="border-2 h-14 pl-4 rounded-xl mb-4" type="password" placeholder="Password" />
              <a className="text-rose-600 mb-4" href="#">Forget your Password? Click here!</a>
              <button className="border-2 rounded-xl hover:bg-cyan-300 mx-20 h-14 text-xl font-semibold">Sign In</button>
              <p className="flex justify-center items-center text-lg m-2">Or</p>
              <button className="border-2 flex rounded-2xl items-center hover:bg-cyan-300">
                <img className="ml-3" src="google-color.svg"/>
                <p className="ml-20">Login with Google</p>
              </button>
              <p className="text-rose-600 my-4">
                You don't have an account?
                <a href="#" onClick={() => setIsLogin(false)}>
                  {" "}
                  Sign Up Now
                </a>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="grid">
              <input className="border-2 h-14 pl-4 rounded-xl my-2" type="text" placeholder="Username" />
              <input className="border-2 h-14 pl-4 rounded-xl my-2" type="password" placeholder="Password" />
              <input className="border-2 h-14 pl-4 rounded-xl my-2" type="password" placeholder="Confirm Password" />
              <button className="border-2 rounded-xl hover:bg-cyan-300 mx-20 h-14 text-xl font-semibold my-4">Sign Up</button>
              <p className="text-rose-600">You already have an account? Sign in now</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

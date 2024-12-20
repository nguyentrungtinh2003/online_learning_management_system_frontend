/* eslint-disable react-hooks/rules-of-hooks */
import Rating from "@mui/material/Rating";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseLanding from "../../components/CourseLanding/CourseLanding";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import useMediaQuery from "@mui/material/useMediaQuery";
import SectionOne from "./SectionPage/SectionOne";

export default function homePage() {
  const [posts, setPosts] = useState([]);
  const matches = useMediaQuery("(max-width: 1280px)");

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      setPosts(response.data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="h-[800px] box-border 2xl:text-2xl">
      <Navbar />
      <div className="box-border grid grid-cols-2 ml-20 mt-20 text-gray-600 font-sans">
        <div className="">
          <div className="cursor-default">
            <h4 className="2xl:text-3xl text-2xl text-cyan-400 font-bold mb-2 animate-fade-in">
              YOU CAN CODE ONCE YOU TRY IT WITH CODE ARENA
            </h4>
            <h1 className="2xl:text-6xl text-5xl font-bold mb-4 animate-slide-in-from-left">
              Learn Coding Online in a Fun Way
            </h1>
            <p className="mb-4 animate-fade-in-from-bottom">
              Code Arena: Your battle field to coding mastery. Ready to level up
              your programming skills? At Code Arena, we're not just teaching
              you to code; we're equipping you with the tools to become a
              creative problem-solver. Earn points as you complete challenges
              and climb the leader board to unlock exclusive courses and
              rewards. Join our vibrant community and start your coding journey
              today!
            </p>
            <div className="flex justify-between m-2 text-gray-600 font-bold 2xl:text-lg text-base">
              <div className="2xl:h-20 h-14 flex justify-center items-center">
                <img src="facebook-ico.svg" className="max-h-full mr-2" />
                <div>
                  <p>5.0</p>
                  <Rating
                    size={matches ? "small" : "medium"}
                    defaultValue={5}
                    precision={0.5}
                    readOnly
                  />
                  <h1>65+ reviews</h1>
                </div>
              </div>
              <div className="2xl:h-20 h-14 flex justify-center items-center">
                <img className="max-h-full mr-2" src="logoCode.png" alt="" />
                <div>
                  <p>4.8</p>
                  <Rating
                    size={matches ? "small" : "medium"}
                    defaultValue={4.8}
                    precision={0.5}
                    readOnly
                  />
                  <h1>765+ reviews</h1>
                </div>
              </div>
              <div className="2xl:h-20 h-14 flex justify-center items-center">
                <img src="google-ico.svg" className="max-h-full mr-2" />
                <div>
                  <p>4.9</p>
                  <Rating
                    size={matches ? "small" : "medium"}
                    defaultValue={4.9}
                    precision={0.5}
                    readOnly
                  />
                  <h1>97+ reviews</h1>
                </div>
              </div>
            </div>
          </div>
          <button className="hover:shadow-custom animate-pulse border-2 rounded-xl border-gray-300 mt-4 px-20 py-4 text-2xl font-bold hover:bg-cyan-300">
            <Link className="flex" to={"/login"}>
              I'm ready - Start Now
              <img src="sword.svg" className="h-8 ml-4" />
            </Link>
          </button>
        </div>
        <div id="right-content" className="min-h-full pb-20 m-0">
          <div className="relative w-full h-full">
            <CourseLanding />
          </div>
        </div>
      </div>
      <div id="page_1" className="box-border h-[800px] px-20 ">
        <SectionOne/>
      </div>
      <Footer />
    </div>
  );
}

/* eslint-disable react-hooks/rules-of-hooks */
import "./HomePage.css";
import Rating from "@mui/material/Rating";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseLanding from "../../components/CourseLanding/CourseLanding";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Button from '@mui/material/Button';

export default function homePage() {
  const [posts, setPosts] = useState([]);

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
    <div className='relative h-[800px] w-[1280px] box-border border-2'>
      <div className="box-border grid grid-cols-2 ml-10 mt-10 text-gray-600 font-sans h-[800px]">
        <div className="">
          <div className="cursor-default">
            <h4 className="text-3xl text-cyan-400 font-bold mb-2 animate-fade-in">
              YOU CAN CODE ONCE YOU TRY IT WITH CODE ARENA
            </h4>
            <h1 className="text-6xl font-bold mb-4 animate-slide-in-from-left">
              Learn Coding Online in a Fun Way
            </h1>
            <p className="text-2xl mb-4 animate-fade-in-from-bottom">
              Code Arena: Your battle field to coding mastery. Ready to level up
              your programming skills? At Code Arena, we're not just teaching
              you to code; we're equipping you with the tools to become a
              creative problem-solver. Earn points as you complete challenges
              and climb the leader board to unlock exclusive courses and rewards.
              Join our vibrant community and start your coding journey today!
            </p>
            <div className="flex justify-between m-2 text-gray-600">
              <div className="h-20 flex justify-center items-center">
                <img src="facebook-ico.svg" className="h-20 mr-2" />
                <div className="text-lg font-bold">
                  <p>5.0</p>
                  <Rating
                    name="half-rating-read"
                    defaultValue={5}
                    precision={0.5}
                    readOnly
                  />
                  <h1>65+ reviews</h1>
                </div>
              </div>
              <div className="h-20 flex justify-center items-center">
                <img
                  className="h-20 mr-2"
                  src="logoCode.png"
                  alt=""
                />
                <div className="text-lg font-bold">
                  <p>4.8</p>
                  <Rating
                    name="half-rating-read"
                    defaultValue={4.8}
                    precision={0.1}
                    readOnly
                  />
                  <h1>765+ reviews</h1>
                </div>
              </div>
              <div className="h-20 flex justify-center items-center">
                <img src="google-ico.svg" className="h-20 mr-2" />
                <div className="text-lg font-bold">
                  <p>4.9</p>
                  <Rating
                    className="bg-cyan-200 h-6 w-3 !important"
                    name="half-rating-read"
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
      <div id="page_1" className="box-border bg-cyan-200 h-[800px] w-[1280px]">
        <div>
          <h1>Danh sách bài viết</h1>
          <ul className="overflow-hidden">
            {/* {posts.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))} */}
          </ul>
        </div>
      </div>
      <button type="button" class="btn btn-primary bg-cyan-200 ">Primary</button>
      
    </div>
  );
}

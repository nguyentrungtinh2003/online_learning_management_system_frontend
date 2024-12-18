/* eslint-disable react-hooks/rules-of-hooks */
import "./HomePage.css";
import Rating from "@mui/material/Rating";
import React, { useState, useEffect} from "react";
import axios from "axios";
import CourseLanding from "../../components/CourseLanding/CourseLanding";

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
    <>
      <div className="grid grid-cols-2 ml-20 mt-20 text-gray-600 font-sans h-[800px]">
        <div className="">
          <div className="cursor-default">
            <h4 className="text-4xl text-cyan-400 font-bold mb-5 animate-fade-in">
              YOU CAN CODE ONCE YOU TRY IT WITH CODE ARENA
            </h4>
            <h1 className="text-7xl font-bold mb-10 animate-slide-in-from-left">
              Learn Coding Online in a Fun Way
            </h1>
            <p className="text-2xl mb-5 animate-fade-in-from-bottom">
              Code Arena: Your battle field to coding mastery. Ready to level up
              your programming skills? At Code Arena, we're not just teaching
              you to code; we're equipping you with the tools to become a
              creative problem-solver. Earn points as you complete challenges
              and climb the leaderboard to unlock exclusive courses and rewards.
              Join our vibrant community and start your coding journey today!
            </p>
            <div className="flex justify-between m-4 text-gray-600">
              <div className="h-24 flex justify-center items-center">
                <img src="facebook-ico.svg" className="h-24 mr-2" />
                <div className="text-xl font-bold">
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
              <div className="h-24 flex justify-center items-center">
                <img
                  className="h-24 mix-blend-lighten mr-2"
                  src="logoCode.jpg"
                  alt=""
                />
                <div className="text-xl font-bold">
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
              <div className="h-24 flex justify-center items-center">
                <img src="google-ico.svg" className="h-24 mr-2" />
                <div className="text-xl font-bold">
                  <p>4.9</p>
                  <Rating
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
          <button className="animate-pulse border-2 rounded-xl border-gray-400 mt-10 px-20 py-4 flex text-2xl font-bold hover:bg-cyan-300">
            I'm ready - Start Now
            <img src="sword.svg" className="h-8 ml-4" />
          </button>
        </div>
        <div id="right-content" className="min-h-full pb-20 m-0">
          <div className="relative w-full h-full">
            <CourseLanding />
          </div>
        </div>
      </div>
      <div id="page_1" className="bg-cyan-200 h-screen">
        <div>
          <h1>Danh sách bài viết</h1>
          <ul className="overflow-hidden">
            {posts.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

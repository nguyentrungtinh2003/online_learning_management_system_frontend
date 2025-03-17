/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import CourseLanding from "../../components/CourseLanding/CourseLanding";
import SectionCourseFree from "./SectionPage/SectionCourseFree";
import SectionCoursePro from "./SectionPage/SectionCoursePro";
import SectionBlog from "./SectionPage/SectionBlog";
import SectionRewards from "./SectionPage/SectionRewards ";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

export default function homePage() {
  return (
    <div className="h-screen pt-3 pr-3">
      <div className="flex-1 rounded-xl bg-white shadow overflow-y-auto h-full 2xl:text-2xl">
        <Navbar />
        <CourseLanding />
        <SectionCourseFree />
        <SectionCoursePro />
        <SectionRewards />
        <SectionBlog />
        <Footer />
      </div>
    </div>
  );
}

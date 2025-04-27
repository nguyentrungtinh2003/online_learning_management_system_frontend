/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import CourseLanding from "../../components/CourseLanding/CourseLanding";
import SectionCourseFree from "./SectionPage/SectionCourseFree";
import SectionCoursePro from "./SectionPage/SectionCoursePro";
import SectionBlog from "./SectionPage/SectionBlog";
import SectionRewards from "./SectionPage/SectionRewards ";
import Footer from "../../components/Footer/Footer";

export default function homePage() {
  return (
    <div className="h-fit flex-1 gap-4 rounded-xl dark:bg-darkBackground shadow 2xl:text-2xl">
        <CourseLanding />
        <SectionCourseFree />
        <SectionCoursePro />
        <SectionRewards />
        <SectionBlog />
        <Footer />
    </div>
  );
}

/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import CourseLanding from "../../components/CourseLanding/CourseLanding";
import SectionCourseFree from "./SectionPage/SectionCourseFree";
import SectionCoursePro from "./SectionPage/SectionCoursePro";
import SectionBlog from "./SectionPage/SectionBlog";
import SectionRewards from "./SectionPage/SectionRewards ";
import Footer from "../../components/Footer/Footer";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function homePage() {
  const courseSectionRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    // Kiểm tra nếu có query scroll=true thì mới scroll
    const params = new URLSearchParams(location.search);
    if (params.get("scroll") === "true") {
      courseSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);
  return (
    <div className="h-fit flex-1 gap-4 rounded-xl dark:bg-darkBackground shadow 2xl:text-2xl">
        <CourseLanding />
        <SectionCourseFree />
        <div ref={courseSectionRef}>
          <SectionCoursePro />
        </div>
        <SectionRewards />
        <SectionBlog />
        <Footer />
    </div>
  );
}

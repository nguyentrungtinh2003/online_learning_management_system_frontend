/* eslint-disable react-hooks/rules-of-hooks */
import Rating from "@mui/material/Rating";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseLanding from "../../components/CourseLanding/CourseLanding";
import SectionCourseFree from "./SectionPage/SectionCourseFree";
import SectionCoursePro from "./SectionPage/SectionCoursePro";
import SectionBlog from "./SectionPage/SectionBlog";
import SectionRewards from "./SectionPage/SectionRewards ";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";

export default function homePage() {
  return (
    <div className="h-[100px] box-border 2xl:text-2xl mt-20">
      <CourseLanding />
      <SectionCourseFree />
      <SectionCoursePro />
      <SectionRewards />
      <SectionBlog />
      <Footer />
    </div>
  );
}

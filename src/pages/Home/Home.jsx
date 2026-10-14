import React from "react";
import Hero from "./Hero";
import JobsLatest from "./JobsLatest";
import HowItWorks from "./HowItWorks";

const Home = () => {
  return (
    <>
      <Hero
        imageSrc='/home-hero.jpg' /* Leading slash refers to the public/ folder */
        imageAlt='Students meeting employers at a campus placement drive'
      />
      <JobsLatest />
      <HowItWorks />
    </>
  );
};

export default Home;

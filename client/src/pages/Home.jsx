import React from "react";
import { BestSeller, Footer, Hero, LatestCollection, NewsLetterBox, Policy } from "../components";

function Home() {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <Policy />
      <NewsLetterBox />
    </div>
  );
}

export default Home;

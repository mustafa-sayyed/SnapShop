import React from "react";
import {
  BestSeller,
  Container,
  Hero,
  LatestCollection,
  NewsLetterBox,
  Policy,
} from "../components";

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Width */}
      <Hero />
      <Container>
        <LatestCollection />
        <BestSeller />
        <Policy />
        <NewsLetterBox />
      </Container>
    </div>
  );
}

export default Home;

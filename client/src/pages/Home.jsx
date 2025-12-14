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
    <div>
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

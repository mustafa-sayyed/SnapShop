import React from "react";
import {
  BestSeller,
  Container,
  Hero,
  LatestCollection,
  NewsLetterBox,
  Policy,
} from "../components";
import { useShop } from "../contexts/ShopContext";
import { Spinner } from "../components/ui/spinner";

function Home() {
  const { initialLoading } = useShop();

  if (initialLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] w-full gap-4">
        <Spinner className="w-10 h-10" />
        <p className="text-gray-600 font-medium">Loading SnapShop...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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

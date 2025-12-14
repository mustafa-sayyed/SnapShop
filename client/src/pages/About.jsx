import React from "react";
import { Container, NewsLetterBox, Title } from "../components";
import { assets } from "../assets/frontend_assets";

function About() {
  return (
    <Container>
        <div className="text-center border-t text-3xl pt-8 mx-auto">
          <Title children1={"About"} children2={"Us"} />
        </div>

        <div className="my-8 flex flex-col md:flex-row gap-16 items-center justify-center">
          <img src={assets.about_img} alt="aboutUs" className="w-full md:max-w-[450px]" />
          <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur
              quibusdam aspernatur commodi dicta eum itaque nostrum repellendus harum
              atque tenetur culpa quo, quidem sapiente deserunt odit sit impedit saepe
              necessitatibus! Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Id fugiat
              blanditiis aliquid ullam ex laudantium error? Delectus ab at velit officiis
              dolores? Tempore, maiores reiciendis harum mollitia perspiciatis atque qui,
              magnam, quisquam debitis dolore asperiores. Lorem ipsum dolor sit amet.
            </p>
            <b className="text-gray-800">Our Mission</b>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Id fugiat
              blanditiis aliquid ullam ex laudantium error? Delectus ab at velit officiis
              dolores? Tempore, maiores reiciendis, quisquam debitis dolore asperiores.
            </p>
          </div>
        </div>

        <div className="text-3xl text-center py-4">
          <Title children1={"Why"} children2={"Choose Us"} />
        </div>

        <div className="flex flex-col md:flex-row text-sm mb-20">
          <div className="border border-gray-400 flex flex-col px-10 md:px-16 py-8 sm:py-20 gap-5">
            <b>Quality Assurance:</b>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis cum
              placeat ipsum atque explicabo, eum labore totam obcaecati cumque ipsa.
            </p>
          </div>
          <div className="border border-gray-400 flex flex-col px-10 md:px-16 py-8 sm:py-20 gap-5">
            <b>Convenience:</b>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis cum
              placeat ipsum atque explicabo, eum labore totam obcaecati cumque ipsa.
            </p>
          </div>
          <div className="border border-gray-400 flex flex-col px-10 md:px-16 py-8 sm:py-20 gap-5">
            <b>Exceptional Customer Support</b>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis cum
              placeat ipsum atque explicabo, eum labore totam obcaecati cumque ipsa.
            </p>
          </div>
        </div>

        <NewsLetterBox />
    </Container>
  );
}

export default About;

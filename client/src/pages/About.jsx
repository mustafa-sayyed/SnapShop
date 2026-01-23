import React from "react";
import { Container, NewsLetterBox } from "../components";
import { assets } from "../assets/frontend_assets";
import { CheckCircle, Package, Headphones, Award } from "lucide-react";

function About() {
  const features = [
    {
      icon: Award,
      title: "Quality Assurance",
      description: "We meticulously curate every product to ensure premium quality and authenticity."
    },
    {
      icon: Package,
      title: "Convenience",
      description: "Shop from home with seamless browsing, secure checkout, and fast delivery."
    },
    {
      icon: Headphones,
      title: "Exceptional Support",
      description: "Our dedicated team is here to assist you 24/7 with any questions or concerns."
    }
  ];

  return (
    <Container>
      <div className="py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About <span className="text-red-500">Us</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your trusted partner in fashion and lifestyle
          </p>
        </div>

        <div className="mb-20 flex flex-col md:flex-row gap-12 items-center">
          <img 
            src={assets.about_img} 
            alt="About Us" 
            className="w-full md:w-1/2 rounded-2xl shadow-lg" 
          />
          <div className="flex flex-col gap-6 md:w-1/2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
              <p className="text-gray-600 leading-relaxed">
                SnapShop was founded with a simple vision: to make fashion accessible, affordable, 
                and enjoyable for everyone. We believe that shopping should be an experience, not 
                just a transaction.
              </p>
            </div>
            <div>
              <p className="text-gray-600 leading-relaxed">
                With years of expertise in the fashion industry, we've built a platform that 
                combines the latest trends with timeless classics, ensuring you always find 
                something that speaks to your style.
              </p>
            </div>
            <div className="bg-slate-50 border  rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Our Mission
              </h3>
              <p className="text-gray-700">
                To empower individuals through fashion by providing high-quality products, 
                exceptional service, and a seamless shopping experience.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-red-500">Us</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to excellence in every aspect of your shopping journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 border border-gray-200 "
              >
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <NewsLetterBox />
      </div>
    </Container>
  );
}

export default About;

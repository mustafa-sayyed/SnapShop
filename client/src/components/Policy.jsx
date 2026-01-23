import React from "react";
import { Shield, Headphones, Zap } from "lucide-react";

function Policy() {
  const policies = [
    {
      icon: Zap,
      title: "Fast & Smooth Shopping",
      description: "Browse products, add to cart, and checkout with a seamless experience",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Your payment information is encrypted and protected",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your queries",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <section className="py-16 md:py-20">

      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Why Choose Us
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 text-sm sm:text-base md:text-lg">
          We're committed to providing you with the best shopping experience possible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {policies.map((policy, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${policy.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000`} />
            
            <div className={`w-16 h-16 ${policy.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <policy.icon className={`w-8 h-8 ${policy.iconColor}`} />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {policy.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {policy.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Policy;

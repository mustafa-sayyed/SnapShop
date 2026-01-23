import React from "react";

function Title({ children1, children2 }) {
  return (
    <div className="inline-flex items-center gap-2 mb-3 text-2xl sm:text-4xl">
      <p className="text-gray-500">
        {children1} <span className="text-gray-700 font-medium">{children2}</span>
      </p>
      <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
    </div>
  );
}

export default Title;

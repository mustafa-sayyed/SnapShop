import React from "react";

function NewsLetterBox() {
  const onSubmitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="text-center p-2">
      <p className="sm:text-2xl text-xl text-gray-800 font-medium">
        Subscribe now and get 20% off
      </p>
      <p className="text-gray-400 mt-3">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia, pariatur!
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex flex-col sm:flex-row items-center gap-3 mx-auto my-6">
        <input
          type="text"
          className="px-6 py-3 outline-none bg-gray-100 w-full rounded-md"
          placeholder="Enter your Email"
          required
        />
        <button className="sm:flex-1 bg-black text-white text-sm px-8 py-3 rounded-md cursor-pointer active:bg-gray-900">
          Subscribe
        </button>
      </form>
    </div>
  );
}

export default NewsLetterBox;

import React from "react";

function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <div className="bg-muted/50 aspect-video rounded-xl px-6 py-4 hover:bg-muted">
          <div className="text-base font-light">Total Users</div>
          <div className="text-5xl font-medium p-2 py-4">112</div>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl px-6 py-4 hover:bg-muted">
          <div className="text-base font-light">Order Placed In last 24 hours</div>
          <div className="text-5xl font-medium p-2 py-4">549</div>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl px-6 py-4 hover:bg-muted">
          <div className="text-base font-light">Amount of Product Purchased</div>
          <div className="text-5xl font-medium p-2 py-4">123000</div>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl px-6 py-4 hover:bg-muted">
          <div className="text-base font-light">Total Products Purchased</div>
          <div className="text-5xl font-medium p-2 py-4">886</div>
        </div>
      </div>
      <div className="bg-muted/50 w-full min-h-60 p-4 rounded-xl"> 
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum possimus obcaecati quo sapiente, laborum tenetur cumque, eligendi dolorum cupiditate odit aperiam ipsam reiciendis dolores veniam magnam nostrum doloribus quibusdam sunt.
      </div>
      <div className="bg-muted/50 w-full min-h-60 p-4 rounded-xl"> 
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum possimus obcaecati quo sapiente, laborum tenetur cumque, eligendi dolorum cupiditate odit aperiam ipsam reiciendis dolores veniam magnam nostrum doloribus quibusdam sunt.
      </div>
      <div className="bg-muted/50 w-full min-h-60 p-4 rounded-xl"> 
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum possimus obcaecati quo sapiente, laborum tenetur cumque, eligendi dolorum cupiditate odit aperiam ipsam reiciendis dolores veniam magnam nostrum doloribus quibusdam sunt.
      </div>
    </div>
  );
}

export default Home;

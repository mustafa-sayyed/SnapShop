import IndexBarChart from "@/components/charts/BarCharts";
import IndexLineChart from "@/components/charts/LineChart";
import React from "react";

function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 ">
        <div className="border bg-accent/30 caret-card rounded-xl px-6 py-6 hover:bg-accent/40">
          <div className="text-base font-light">Total Users</div>
          <div className="text-4xl sm:text-5xl font-medium p-2 py-2">112</div>
        </div>
        <div className="border bg-accent/30 caret-card rounded-xl px-6 py-6 hover:bg-accent/40">
          <div className="text-base font-light">Order Placed In last 24 hours</div>
          <div className="text-4xl sm:text-5xl font-medium p-2 py-2">549</div>
        </div>
        <div className="border bg-accent/30 caret-card rounded-xl px-6 py-6 hover:bg-accent/40">
          <div className="text-base font-light">Amount of Product Purchased</div>
          <div className="text-4xl sm:text-5xl font-medium p-2 py-2">123000</div>
        </div>
        <div className="border bg-accent/30 caret-card rounded-xl px-6 py-6 hover:bg-accent/40">
          <div className="text-base font-light">Total Products Purchased</div>
          <div className="text-4xl sm:text-5xl font-medium p-2 py-2">886</div>
        </div>
      </div>
      <div className="border w-full min-h-60 p-6 rounded-xl"> 
        <IndexBarChart />
      </div>
      <div className="border w-full min-h-60 p-6 rounded-xl"> 
        <IndexLineChart />
      </div>
    </div>
  );
}

export default Home;

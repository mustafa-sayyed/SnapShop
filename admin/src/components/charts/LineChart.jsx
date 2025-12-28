import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";

const data = [
  {
    name: "A",
    uv: 400,
    pv: 240,
    amt: 2400,
  },
  {
    name: "B",
    uv: 300,
    pv: 456,
    amt: 2400,
  },
  {
    name: "C",
    uv: 300,
    pv: 139,
    amt: 2400,
  },
  {
    name: "D",
    uv: 200,
    pv: 980,
    amt: 2400,
  },
  {
    name: "E",
    uv: 278,
    pv: 390,
    amt: 2400,
  },
  {
    name: "F",
    uv: 189,
    pv: 480,
    amt: 2400,
  },
  {
    name: "D",
    uv: 200,
    pv: 980,
    amt: 2400,
  },
  {
    name: "E",
    uv: 278,
    pv: 390,
    amt: 2400,
  },
  {
    name: "F",
    uv: 189,
    pv: 480,
    amt: 2400,
  },
  {
    name: "D",
    uv: 200,
    pv: 980,
    amt: 2400,
  },
  {
    name: "E",
    uv: 278,
    pv: 390,
    amt: 2400,
  },
  {
    name: "F",
    uv: 189,
    pv: 480,
    amt: 2400,
  },
];

const chartConfig = {
  uv: {
    label: "uv",
    color: "#2563eb",
  },
  pv: {
    label: "pv",
    color: "#60a5fa",
  },
  name: {
    label: "pv",
    color: "#60a5fa",
  },
  amt: {
    label: "pv",
    color: "#60a5fa",
  },
};

export default function IndexLineChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-60 max-h-[400px] w-full">
      <LineChart responsive data={data}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis />
        <YAxis />
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  );
}

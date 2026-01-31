import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const defaultChartConfig = {
  pending: {
    label: "Pending",
    color: "#f59e0b",
  },
  delivered: {
    label: "Delivered",
    color: "#22c55e",
  },
  cancelled: {
    label: "Cancelled",
    color: "#ef4444",
  },
};

export default function IndexBarChart({ 
  data = [], 
  config = defaultChartConfig,
  xAxisKey = "day",
  bars = ["pending", "delivered", "cancelled"],
  title = "",
  loading = false 
}) {
  if (loading) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center">
        <div className="animate-spin inline-block size-8 border-4 border-current border-t-transparent text-primary rounded-full" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ChartContainer config={config} className="h-[350px] w-full">
        <BarChart accessibilityLayer data={data} className="-ml-5">
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {bars.map((bar) => (
            <Bar
              key={bar}
              dataKey={bar}
              fill={`var(--color-${bar})`}
              radius={4}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  );
}

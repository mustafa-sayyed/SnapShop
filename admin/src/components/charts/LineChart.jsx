import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Spinner } from "../ui/spinner";

const defaultChartConfig = {
  revenue: {
    label: "Revenue",
    color: "#2563eb",
  },
  orders: {
    label: "Orders",
    color: "#22c55e",
  },
};

export default function IndexLineChart({
  data = [],
  config = defaultChartConfig,
  xAxisKey = "month",
  lines = ["revenue", "orders"],
  title = "",
  loading = false,
  formatYAxis = (value) => value,
}) {
  if (loading) {
    return (
      <div className="min-h-60 max-h-[400px] w-full flex items-center justify-center">
        <Spinner className='size-10' />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="min-h-60 max-h-[400px] w-full flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-8">{title}</h3>}
      <ChartContainer config={config} className="min-h-60 max-h-[400px] w-full">
        <LineChart data={data} className="-ml-5">
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tickMargin={5}
            tickSize={0}
            tickFormatter={formatYAxis}
          />
          {lines.map((line) => (
            <Line
              key={line}
              type="monotone"
              dot={false}
              dataKey={line}
              stroke={`var(--color-${line})`}
              strokeWidth={2}
            />
          ))}
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

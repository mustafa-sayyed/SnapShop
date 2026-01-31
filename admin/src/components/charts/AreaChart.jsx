import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const defaultChartConfig = {
  users: {
    label: "Users",
    color: "#8b5cf6",
  },
};

export default function IndexAreaChart({
  data = [],
  config = defaultChartConfig,
  xAxisKey = "month",
  areas = ["users"],
  title = "",
  loading = false,
}) {
  if (loading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="animate-spin inline-block size-8 border-4 border-current border-t-transparent text-primary rounded-full" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ChartContainer config={config} className="h-[300px] w-full -ml-5">
        <AreaChart data={data}>
          <defs>
            {areas.map((area) => (
              <linearGradient
                key={`gradient-${area}`}
                id={`gradient-${area}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={`var(--color-${area})`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${area})`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis tickLine={false} axisLine={false} />
          {areas.map((area) => (
            <Area
              key={area}
              type="monotone"
              dataKey={area}
              stroke={`var(--color-${area})`}
              fill={`url(#gradient-${area})`}
              strokeWidth={2}
            />
          ))}
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Currency } from "@/lib/money/money.schema";
import { formatCompactMoney, formatMoney } from "@/lib/money/money.format";
import type { MonthlyFlow } from "@/lib/stats/stats.schema";

const chartConfig = {
  cashIn: { label: "Cash in", color: "var(--chart-2)" },
  cashOut: { label: "Cash out", color: "var(--chart-1)" },
} satisfies ChartConfig;

function formatMonth(month: string): string {
  const [year, monthIndex] = month.split("-");
  const date = new Date(Number(year), Number(monthIndex) - 1, 1);
  return `${date.toLocaleString("en-US", { month: "short" })} '${year.slice(2)}`;
}

export function MoneyInOutChart({ data, currency }: { data: MonthlyFlow[]; currency: Currency }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Money in vs money out by month</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={1}
              tickFormatter={formatMonth}
              className="text-[11px]"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(value: number) => formatCompactMoney(value)}
              className="text-[11px]"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => formatMonth(String(label))}
                  formatter={(value, name) => (
                    <span className="flex w-full justify-between gap-4">
                      <span className="text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label ?? name}
                      </span>
                      <span className="tabular-nums">{formatMoney(Number(value), currency)}</span>
                    </span>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="cashIn" fill="var(--color-cashIn)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cashOut" fill="var(--color-cashOut)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

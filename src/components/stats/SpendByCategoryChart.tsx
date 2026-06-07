"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Currency } from "@/lib/money/money.schema";
import { formatCompactMoney, formatMoney } from "@/lib/money/money.format";
import type { CategoryTotal } from "@/lib/stats/stats.schema";

const chartConfig = {
  total: { label: "Spend", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function SpendByCategoryChart({
  data,
  currency,
}: {
  data: CategoryTotal[];
  currency: Currency;
}) {
  const top = data.slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by category</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart data={top} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={56}
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
                  formatter={(value) => formatMoney(Number(value), currency)}
                />
              }
            />
            <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

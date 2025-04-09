"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface BarChartProps {
  title: string
  description: string
  icon: LucideIcon
  data: any[]
  dataKey: string
  nameKey: string
  colors: string[]
  valueFormatter?: (value: number) => string
  layout?: "vertical" | "horizontal"
  height?: number
}

export function BarChart({
  title,
  description,
  icon: Icon,
  data,
  dataKey,
  nameKey,
  colors,
  valueFormatter = (value) => value.toString(),
  layout = "horizontal",
  height = 300,
}: BarChartProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={data}
              layout={layout}
              margin={{
                top: 5,
                right: 30,
                left: layout === "vertical" ? 80 : 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              {layout === "vertical" ? (
                <>
                  <XAxis type="number" />
                  <YAxis dataKey={nameKey} type="category" width={70} />
                </>
              ) : (
                <>
                  <XAxis dataKey={nameKey} />
                  <YAxis />
                </>
              )}
              <Tooltip
                formatter={(value) => [valueFormatter(Number(value)), ""]}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey={dataKey}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface PieChartProps {
  title: string
  description: string
  icon: LucideIcon
  data: any[]
  dataKey: string
  nameKey: string
  colors: string[]
  height?: number
  showLabel?: boolean
  valueFormatter?: (value: number) => string
}

export function PieChart({
  title,
  description,
  icon: Icon,
  data,
  dataKey,
  nameKey,
  colors,
  height = 300,
  showLabel = true,
  valueFormatter = (value) => value.toString(),
}: PieChartProps) {
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
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={showLabel}
                label={showLabel ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : undefined}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey}
                nameKey={nameKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [valueFormatter(Number(value)), ""]} />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

"use client";

import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartDataItem } from "@/lib/services/types";

const COLORS = [
  "oklch(0.55 0.15 185)",
  "oklch(0.45 0.1 250)",
  "oklch(0.65 0.12 155)",
  "oklch(0.70 0.13 75)",
  "oklch(0.55 0.12 310)",
  "oklch(0.60 0.14 30)",
  "oklch(0.50 0.10 200)",
  "oklch(0.55 0.15 120)",
];

export function EnrollmentChart({ data }: { data: ChartDataItem[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Student Enrollment Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="oklch(0.6 0 0)" />
            <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.6 0 0)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.98 0 0)",
                border: "1px solid oklch(0.9 0 0)",
                borderRadius: "8px",
                fontSize: 13,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="oklch(0.55 0.15 185)"
              strokeWidth={2.5}
              dot={{ fill: "oklch(0.55 0.15 185)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CourseDistributionChart({ data }: { data: ChartDataItem[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Students by Course</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={55}
              paddingAngle={2}
              label={({ name, percent }) => (percent != null ? `${name} ${(percent * 100).toFixed(0)}%` : String(name))}
              labelLine={{ strokeWidth: 1 }}
              style={{ fontSize: 10 }}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.98 0 0)",
                border: "1px solid oklch(0.9 0 0)",
                borderRadius: "8px",
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function AttendanceChart({ data }: { data: ChartDataItem[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Weekly Attendance Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="oklch(0.6 0 0)" />
            <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.6 0 0)" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.98 0 0)",
                border: "1px solid oklch(0.9 0 0)",
                borderRadius: "8px",
                fontSize: 13,
              }}
              formatter={(value) => [`${value ?? 0}%`, "Attendance"]}
            />
            <Bar
              dataKey="value"
              fill="oklch(0.55 0.15 185)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function AdmissionsFunnelChart({ data }: { data: ChartDataItem[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Admissions Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="oklch(0.6 0 0)" />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="oklch(0.6 0 0)" width={90} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.98 0 0)",
                border: "1px solid oklch(0.9 0 0)",
                borderRadius: "8px",
                fontSize: 13,
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={30}>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

"use client";

import { Bar, BarChart, Line, LineChart, Area, AreaChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

const tooltipStyle = {
  backgroundColor: "oklch(0.99 0 0)",
  border: "none",
  borderRadius: "12px",
  fontSize: 13,
  boxShadow: "0 8px 30px oklch(0 0 0 / 8%), 0 4px 10px oklch(0 0 0 / 4%)",
  padding: "8px 12px",
};

export function EnrollmentChart({ data }: { data: ChartDataItem[] }) {
  return (
    <Card className="border-0 shadow-float">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Student Enrollment Trend</CardTitle>
        <CardDescription className="text-xs">Monthly enrollment data</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.55 0.15 185)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.55 0.15 185)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} stroke="oklch(0.85 0 0)" tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} stroke="oklch(0.85 0 0)" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="oklch(0.55 0.15 185)"
              strokeWidth={2.5}
              fill="url(#enrollmentGradient)"
              dot={{ fill: "oklch(0.55 0.15 185)", r: 4, strokeWidth: 2, stroke: "white" }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "white", fill: "oklch(0.55 0.15 185)" }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CourseDistributionChart({ data }: { data: ChartDataItem[] }) {
  return (
    <Card className="border-0 shadow-float">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Students by Course</CardTitle>
        <CardDescription className="text-xs">Distribution across programs</CardDescription>
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
              innerRadius={60}
              paddingAngle={3}
              cornerRadius={4}
              label={({ name, percent }) => (percent != null ? `${name} ${(percent * 100).toFixed(0)}%` : String(name))}
              labelLine={{ strokeWidth: 1, stroke: "oklch(0.7 0 0)" }}
              style={{ fontSize: 10 }}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function AttendanceChart({ data }: { data: ChartDataItem[] }) {
  return (
    <Card className="border-0 shadow-float">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Weekly Attendance Rate</CardTitle>
        <CardDescription className="text-xs">Average attendance percentage</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <defs>
              <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.55 0.15 185)" stopOpacity={1} />
                <stop offset="95%" stopColor="oklch(0.45 0.12 250)" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} stroke="oklch(0.85 0 0)" tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} stroke="oklch(0.85 0 0)" domain={[0, 100]} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [`${value ?? 0}%`, "Attendance"]}
            />
            <Bar
              dataKey="value"
              fill="url(#attendanceGradient)"
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function AdmissionsFunnelChart({ data }: { data: ChartDataItem[] }) {
  return (
    <Card className="border-0 shadow-float">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Admissions Funnel</CardTitle>
        <CardDescription className="text-xs">Application-to-enrollment pipeline</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} stroke="oklch(0.85 0 0)" tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} stroke="oklch(0.85 0 0)" width={90} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar
              dataKey="value"
              radius={[0, 6, 6, 0]}
              maxBarSize={28}
              animationDuration={1500}
              animationEasing="ease-out"
            >
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

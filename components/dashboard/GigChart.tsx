import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", gigs: 2 },
  { month: "Feb", gigs: 3 },
  { month: "Mar", gigs: 5 },
  { month: "Apr", gigs: 4 },
  { month: "May", gigs: 7 },
  { month: "Jun", gigs: 6 },
];

export function GigChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#2D3748"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#A0AEC0" }}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#A0AEC0" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A202C",
              borderColor: "#2D3748",
              borderRadius: "0.5rem",
            }}
            itemStyle={{ color: "#E2E8F0" }}
          />
          <Line
            type="monotone"
            dataKey="gigs"
            stroke="#ED8936"
            strokeWidth={2}
            dot={{ fill: "#ED8936", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

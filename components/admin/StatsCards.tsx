"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Music } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    newUsersThisWeek: number;
    activeUsers: number;
    totalGigs: number;
    bookedGigs: number;
    revenue: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      change: `${Math.round(
        (stats.newUsersThisWeek / stats.totalUsers) * 100
      )}% this week`,
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: Users,
      change: "Recently active",
    },
    {
      title: "Total Gigs",
      value: stats.totalGigs,
      icon: Music,
      change: `${stats.bookedGigs} booked`,
    },
    {
      title: "Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      change: "All time",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

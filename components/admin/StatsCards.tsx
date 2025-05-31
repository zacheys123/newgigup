"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Music, ArrowUpRight, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  hover: {
    y: -4,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Community",
      value: stats.totalUsers,
      icon: Users,
      change: `${stats.newUsersThisWeek} new this week`,
      trend: stats.newUsersThisWeek > 0 ? "up" : "down",
      accent: "from-blue-400/20 to-blue-600/20",
      iconColor: "text-blue-500",
    },
    {
      title: "Engagement",
      value: stats.activeUsers,
      icon: Activity,
      change: "Active users",
      trend: "neutral",
      accent: "from-emerald-400/20 to-emerald-600/20",
      iconColor: "text-emerald-500",
    },
    {
      title: "Gigs",
      value: stats.totalGigs,
      icon: Music,
      change: `${stats.bookedGigs} booked`,
      trend: stats.bookedGigs > stats.totalGigs / 2 ? "up" : "down",
      accent: "from-purple-400/20 to-purple-600/20",
      iconColor: "text-purple-500",
    },
    {
      title: "Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      change: "All time",
      trend: "up",
      accent: "from-amber-400/20 to-amber-600/20",
      iconColor: "text-amber-500",
    },
    // Additional cards to demonstrate scrolling
    {
      title: "Conversion Rate",
      value: `${Math.round((stats.bookedGigs / stats.totalGigs) * 100)}%`,
      icon: Activity,
      change: "Booking efficiency",
      trend: "up",
      accent: "from-rose-400/20 to-rose-600/20",
      iconColor: "text-rose-500",
    },
    {
      title: "Avg. Revenue",
      value: `$${Math.round(stats.revenue / (stats.bookedGigs || 1))}`,
      icon: DollarSign,
      change: "Per booked gig",
      trend: "neutral",
      accent: "from-indigo-400/20 to-indigo-600/20",
      iconColor: "text-indigo-500",
    },
  ];

  return (
    <div
      className="overflow-y-auto h-[500px] pr-3" // Fixed height with vertical scroll
      style={{
        scrollbarWidth: "thin",
        scrollbarGutter: "stable",
      }}
    >
      <div className="grid gap-5 pb-4">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={index}
          >
            <Card
              className={cn(
                "relative overflow-hidden border border-transparent",
                "bg-gradient-to-br backdrop-blur-sm",
                card.accent,
                "shadow-[0_8px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.1)]",
                "hover:shadow-[0_12px_28px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_12px_28px_rgba(0,0,0,0.15)]",
                "transition-all duration-300 ease-out"
              )}
            >
              {/* Floating icon decoration */}
              <card.icon
                className={cn(
                  "absolute -right-4 -top-4 h-24 w-24 opacity-10",
                  card.iconColor
                )}
              />

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div
                    className={cn(
                      "p-2 rounded-lg bg-white/50 dark:bg-black/30",
                      "backdrop-blur-sm border border-border",
                      card.iconColor
                    )}
                  >
                    <card.icon className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col gap-1">
                  <div className="text-3xl font-semibold tracking-tight">
                    {card.value}
                  </div>
                  <div
                    className={cn(
                      "flex items-center text-sm",
                      card.trend === "up"
                        ? "text-green-500"
                        : card.trend === "down"
                        ? "text-rose-500"
                        : "text-muted-foreground"
                    )}
                  >
                    {card.trend === "up" && (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    )}
                    {card.trend === "down" && (
                      <ArrowUpRight className="h-3 w-3 mr-1 rotate-180" />
                    )}
                    {card.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

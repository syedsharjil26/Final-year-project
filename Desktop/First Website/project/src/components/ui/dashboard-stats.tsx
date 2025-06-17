import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Eye, Star, Users } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trending?: "up" | "down" | "neutral";
  trendingValue?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trending,
  trendingValue,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trending && trendingValue && (
          <div className="flex items-center pt-1">
            <span
              className={`text-xs ${
                trending === "up"
                  ? "text-green-500"
                  : trending === "down"
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {trending === "up" ? "↑" : trending === "down" ? "↓" : "→"}{" "}
              {trendingValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  role: "student" | "homeowner" | "admin";
}

export function DashboardStats({ role }: DashboardStatsProps) {
  if (role === "student") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Saved Properties"
          value="2"
          icon={<Star className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Browsed Listings"
          value="12"
          description="Last 30 days"
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Top Locality Score"
          value="9.0"
          description="College Grove"
          icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Property Recommendations"
          value="5"
          description="Based on your preferences"
          icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
    );
  }

  if (role === "homeowner") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Listings"
          value="6"
          icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Total Views"
          value="1,024"
          description="Last 30 days"
          trending="up"
          trendingValue="12% from last month"
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Saved By Students"
          value="45"
          trending="up"
          trendingValue="8% from last month"
          icon={<Star className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Inquiries"
          value="18"
          description="Last 30 days"
          trending="neutral"
          trendingValue="Similar to last month"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
    );
  }

  // Admin
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Users"
        value="387"
        description="103 new this month"
        trending="up"
        trendingValue="16% from last month"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Active Listings"
        value="246"
        trending="up"
        trendingValue="8% from last month"
        icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Total Views"
        value="12.4K"
        description="All properties"
        trending="up"
        trendingValue="24% from last month"
        icon={<Eye className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Avg. Locality Score"
        value="7.9"
        description="Across all localities"
        trending="up"
        trendingValue="0.3 from last month"
        icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}
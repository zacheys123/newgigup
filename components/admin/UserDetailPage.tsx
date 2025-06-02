"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Music,
  Mic2,
  Disc,
  User,
  Briefcase,
  FileText,
  Star,
  Shield,
  ChevronLeft,
  Ban,
} from "lucide-react";
import Link from "next/link";
import { BanUserButton } from "@/components/admin/BanButton";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@clerk/nextjs";

export interface PageProps {
  user: {
    _id: string;
    picture?: string;
    firstname?: string;
    lastname?: string;
    roleType?: string;
    instrument?: string;

    isAdmin?: boolean;
    isClient?: boolean;
    username: string;
    email: string;
    phone: string;
    city: string;
    talentbio: string;
    date: string;
    month: string;
    year: string;
    createdAt: string;
    isBanned: boolean;
    bannedAt?: Date;
    banReason?: string;
    banExpiresAt?: Date;
    banReference?: string;
    address?: string;
    isMusician: boolean;
    vocalistGenre?: string;
    djGenre?: string;
    musiciangenres?: string[];
    organization?: string;
    adminRole?: string;
    lastAdminAction?: string;
    adminPermissions?: string[];
  };
}

export default function UserDetailPage({ user }: PageProps) {
  const { userId } = useAuth();
  const { subscription } = useSubscription(userId as string);
  return (
    <div className="flex flex-col h-screen bg-neutral-600 dark:bg-gray-900 overflow-hidden">
      {/* Scrollable content container */}
      <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-400/30 scrollbar-track-transparent py-6 px-4 sm:px-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6 sticky top-0 z-10 bg-gray-100 dark:bg-gray-900 pb-4">
          <Link href="/admin/users">
            <Button
              variant="ghost"
              className="gap-1.5 group transition-all duration-200 hover:pl-2 hover:pr-3"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Back to Users</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
          <Button
            variant="default"
            className="gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/20 transition-all"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        </div>

        {/* User Profile Card */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/70 dark:border dark:border-gray-700/50 mb-6 transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-800/30">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                {user?.picture && (
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-primary/20 dark:border-primary/30 group hover:border-primary/50 transition-all duration-300">
                    <AvatarImage
                      src={user.picture}
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                    <AvatarFallback className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/80 font-medium">
                      {user.firstname?.charAt(0)}
                      {user.lastname?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-wrap gap-2 justify-center">
                  {user.isAdmin && (
                    <Badge
                      variant="destructive"
                      className="px-2.5 py-1 bg-red-500/10 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700/50"
                    >
                      Admin
                    </Badge>
                  )}
                  {user.roleType === "instrumentalist" && (
                    <Badge className="capitalize px-2.5 py-1 bg-indigo-500/10 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700/50">
                      {user?.instrument}
                    </Badge>
                  )}
                  {user.roleType === "vocalist" && (
                    <Badge className="capitalize px-2.5 py-1 bg-indigo-500/10 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700/50">
                      Vocalist
                    </Badge>
                  )}{" "}
                  {user.roleType === "dj" && (
                    <Badge className="capitalize px-2.5 py-1 bg-indigo-500/10 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700/50">
                      Deejay
                    </Badge>
                  )}{" "}
                  {user.roleType === "mc" && (
                    <Badge className="capitalize px-2.5 py-1 bg-indigo-500/10 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700/50">
                      EMcee
                    </Badge>
                  )}
                  {user.isClient && (
                    <Badge className="px-2.5 py-1 bg-emerald-500/10 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50">
                      Client
                    </Badge>
                  )}
                  <Badge
                    className={`px-2.5 py-1 ${
                      subscription?.user.tier === "pro"
                        ? "bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:from-purple-900/30 dark:to-indigo-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700/50"
                        : "bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600/50"
                    }`}
                  >
                    {subscription?.user.tier.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* User Info Section */}
              <div className="flex-1 grid gap-4 md:grid-cols-2 w-full">
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {user.firstname} {user.lastname}
                  </h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      @{user.username}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      {user.email}
                    </span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        {user.phone}
                      </span>
                    </div>
                  )}
                  {user.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        {user.city}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Detailed Info */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto gap-1.5 p-1.5 bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-300/50 dark:border-gray-700/50 sticky top-0 z-10 mb-4">
            {[
              { value: "profile", icon: User, label: "Profile" },
              { value: "professional", icon: Briefcase, label: "Professional" },
              { value: "activity", icon: FileText, label: "Activity" },
              { value: "reviews", icon: Star, label: "Reviews" },
              { value: "admin", icon: Shield, label: "Admin" },
              { value: "ban", icon: Ban, label: "Ban User" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`py-2 px-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs sm:text-sm transition-all duration-200 hover:bg-gray-100/70 dark:hover:bg-gray-700/50 border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-600/50 ${
                  tab.value === "ban" && "bg-red-500 text-white"
                }`}
                disabled={tab.value === "admin" && !user.isAdmin}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-2">
            <Card className="border-none shadow-sm bg-white dark:bg-gray-800/50 dark:border dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Bio
                    </h4>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      {user.talentbio || (
                        <span className="text-muted-foreground italic">
                          No bio provided
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Date of Birth
                    </h4>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      {user.date && user.month && user.year ? (
                        `${user.date}/${user.month}/${user.year}`
                      ) : (
                        <span className="text-muted-foreground italic">
                          Not specified
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Address
                    </h4>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      {user.address || (
                        <span className="text-muted-foreground italic">
                          Not specified
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Member Since
                    </h4>
                    {user.createdAt && (
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* bann tab */}
          {/* Ban tab */}
          <TabsContent value="ban" className="mt-2 my-9">
            <Card className="border-none shadow-sm bg-white dark:bg-gray-800/50 dark:border dark:border-gray-700/50 flex flex-col h-[calc(100vh-200px)]">
              {" "}
              {/* Adjust height as needed */}
              <CardHeader className="sticky top-0 z-10 bg-white dark:bg-gray-800/50 border-b dark:border-gray-700">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.isBanned ? "User Banned" : "Ban User"}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-6">
                {user.isBanned ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
                      {user.bannedAt && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          ⚠️ This user was banned on{" "}
                          {new Date(user.bannedAt).toLocaleString()}
                        </p>
                      )}
                      {user.banReason && (
                        <p className="mt-2 text-sm">
                          <span className="font-medium">Reason:</span>{" "}
                          {user.banReason}
                        </p>
                      )}
                    </div>
                    <BanUserButton user={user} />
                  </div>
                ) : (
                  <BanUserButton user={user} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {/* Professional Tab */}
          <TabsContent value="professional" className="mt-2">
            <Card className="border-none shadow-sm bg-white dark:bg-gray-800/50 dark:border dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Professional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {user.isMusician && (
                  <>
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                        Musical Information
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-center gap-3">
                          <Music className="h-4 w-4 text-indigo-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Instrument
                            </p>
                            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                              {user.instrument || (
                                <span className="text-muted-foreground italic">
                                  Not specified
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mic2 className="h-4 w-4 text-indigo-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Vocal Genre
                            </p>
                            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                              {user.vocalistGenre || (
                                <span className="text-muted-foreground italic">
                                  Not specified
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Disc className="h-4 w-4 text-indigo-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              DJ Genre
                            </p>
                            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                              {user.djGenre || (
                                <span className="text-muted-foreground italic">
                                  Not specified
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                        Genres
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {user.musiciangenres?.length &&
                        user.musiciangenres?.length > 0 ? (
                          user.musiciangenres.map((genre) => (
                            <Badge
                              key={genre}
                              variant="outline"
                              className="px-3 py-1 text-xs bg-indigo-50/70 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/50 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-colors"
                            >
                              {genre}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground italic">
                            No genres specified
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {user.isClient && user.organization && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Organization
                    </h4>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      {user.organization}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Tab (only visible for admins) */}
          {user.isAdmin && (
            <TabsContent value="admin" className="mt-2">
              <Card className="border-none shadow-sm bg-white dark:bg-gray-800/50 dark:border dark:border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    Administrative Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Admin Role
                      </h4>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        {user.adminRole || (
                          <span className="text-muted-foreground italic">
                            Not specified
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Last Admin Action
                      </h4>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        {user.lastAdminAction ? (
                          new Date(user.lastAdminAction).toLocaleString(
                            "en-US",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          )
                        ) : (
                          <span className="text-muted-foreground italic">
                            No actions recorded
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Permissions
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {user.adminPermissions?.length &&
                        user.adminPermissions?.length > 0 ? (
                          user.adminPermissions.map((perm) => (
                            <Badge
                              key={perm}
                              variant="outline"
                              className="px-3 py-1 text-xs bg-purple-50/70 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700/50 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-colors"
                            >
                              {perm}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground italic">
                            No special permissions
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}

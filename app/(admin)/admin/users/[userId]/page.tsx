// app/admin/users/[userId]/page.tsx
import { notFound } from "next/navigation";
import { getUserById } from "@/lib/adminActions";
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
} from "lucide-react";
import Link from "next/link";

export default async function UserDetailPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await getUserById(params.userId);

  if (!user) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <Link href="/admin/users">
          <Button variant="ghost">← Back to Users</Button>
        </Link>
        <Button variant="default">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* User Profile Card */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.picture} />
                <AvatarFallback>
                  {user.firstname?.charAt(0)}
                  {user.lastname?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-wrap gap-2 justify-center">
                {user.isAdmin && <Badge variant="destructive">Admin</Badge>}
                {user.isMusician && <Badge>Musician</Badge>}
                {user.isClient && <Badge variant="secondary">Client</Badge>}
                <Badge variant={user.tier === "pro" ? "default" : "outline"}>
                  {user.tier.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* User Info Section */}
            <div className="flex-1 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                  {user.firstname} {user.lastname}
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>@{user.username}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{user.city}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Detailed Info */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="professional">
            <Briefcase className="mr-2 h-4 w-4" />
            Professional
          </TabsTrigger>
          <TabsTrigger value="activity">
            <FileText className="mr-2 h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <Star className="mr-2 h-4 w-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="admin">
            <Shield className="mr-2 h-4 w-4" />
            Admin
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Bio
                  </h4>
                  <p>{user.bio || "No bio provided"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Date of Birth
                  </h4>
                  <p>
                    {user.date && user.month && user.year
                      ? `${user.date}/${user.month}/${user.year}`
                      : "Not specified"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Address
                  </h4>
                  <p>{user.address || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Member Since
                  </h4>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professional Tab */}
        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {user.isMusician && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Musical Information
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <Music className="h-4 w-4" />
                        <span>
                          Instrument: {user.instrument || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mic2 className="h-4 w-4" />
                        <span>
                          Vocal Genre: {user.vocalistGenre || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Disc className="h-4 w-4" />
                        <span>DJ Genre: {user.djGenre || "Not specified"}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Genres
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.musiciangenres?.length > 0
                        ? user.musiciangenres.map((genre) => (
                            <Badge key={genre} variant="outline">
                              {genre}
                            </Badge>
                          ))
                        : "No genres specified"}
                    </div>
                  </div>
                </>
              )}
              {user.isClient && user.organization && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Organization
                  </h4>
                  <p>{user.organization}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Disc className="h-4 w-4" />
                <span>Bio:{user?.talentbio}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Tab (only visible for admins) */}
        {user.isAdmin && (
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Administrative Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Admin Role
                    </h4>
                    <p>{user.adminRole || "Not specified"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Last Admin Action
                    </h4>
                    <p>
                      {user.lastAdminAction
                        ? new Date(user.lastAdminAction).toLocaleString()
                        : "No actions recorded"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Permissions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.adminPermissions &&
                      user.adminPermissions?.length > 0
                        ? user.adminPermissions.map((perm) => (
                            <Badge key={perm} variant="outline">
                              {perm}
                            </Badge>
                          ))
                        : "No special permissions"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

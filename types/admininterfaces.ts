// export interface Activity {
//   _id: string;
//   type: string;
//   message?: string;
//   timestamp: Date;
//   metadata?: {
//     [key: string]: any;
//   };
//   userId?: string;
// }

// types/admin-nav.ts
export interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  allowedRoles: string[];
  exact?: boolean;
}

export type UserRole = "super" | "content" | "support" | "analytics" | "admin";

export interface AdminNavbarProps {
  isAdmin: boolean;
  adminRole: string;
  adminPermissions: string[];
  firstname?: string;
  lastname?: string;
  email?: string;
  picture?: string;
}

export interface PageProps {
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
  status?: "active" | "banned" | "pending";
}

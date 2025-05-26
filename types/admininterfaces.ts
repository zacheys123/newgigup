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

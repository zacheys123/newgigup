import { IUser } from "@/models/user";
import { Types } from "mongoose";

export interface IReport {
  _id: Types.ObjectId | string;
  reportedUser: IUser | Types.ObjectId | string;
  reportedBy: IUser | Types.ObjectId | string;
  reason: string;
  additionalInfo?: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: Types.ObjectId | IUser; // Reference to User (admin)
}
export interface CreateReportRequest {
  reportedUserId: string;
  reason: string;
  additionalInfo?: string;
  userid: string;
}

export interface PopulatedReport
  extends Omit<IReport, "reportedUser" | "reportedBy" | "resolvedBy"> {
  _id: string;
  reportedUser: IUser;
  reportedBy: IUser;
  resolvedBy?: IUser;
}

export interface ReportsTableProps {
  reports: PopulatedReport[]; // Using the populated version since you're accessing user.name
}
// For admin report filtering
export interface ReportFilter {
  status?: IReport["status"];
  startDate?: Date;
  endDate?: Date;
  reportedUserId?: string;
  resolvedById?: string;
}

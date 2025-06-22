import { IReport } from "@/types/reports";
import { Schema, model, models } from "mongoose";

const reportSchema = new Schema<IReport>({
  reportedUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reportedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true, trim: true },
  additionalInfo: { type: String, trim: true },
  status: {
    type: String,
    enum: ["pending", "reviewed", "resolved", "dismissed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: Date,
  resolvedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

const Report = models.Report || model<IReport>("Report", reportSchema);
export default Report;

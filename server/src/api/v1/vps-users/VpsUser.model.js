import { Schema, model } from "mongoose";

const vpsUserSchema = new Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, index: true },
    customerPhone: { type: String },
    vpsServerIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "VpsServer",
        default: null,
      },
    ],
    subscriptionPlan: {
      type: String,
      enum: ["monthly", "3_monthly", "6_monthly", "yearly"],
      required: true,
    },
    subscriptionStartDate: { type: Date, required: true },
    subscriptionEndDate: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
      index: true,
    },
    notes: { type: String },
  },
  { timestamps: true },
);

export const VpsUserModel = model("VpsUser", vpsUserSchema);

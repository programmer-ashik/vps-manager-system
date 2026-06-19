import { z } from "../../../core/validation/zod-openapi.js";

const subscriptionPlans = ["monthly", "3_monthly", "6_monthly", "yearly"];
const vpsUserStatuses = ["active", "expired", "cancelled"];

export const createVpsUserSchema = z
  .object({
    customerName: z.string().trim().min(1).max(120),
    customerEmail: z.string().email(),
    customerPhone: z.string().max(30).optional(),
    vpsServerIds: z.array(z.string()).default([]),
    subscriptionPlan: z.enum(subscriptionPlans),
    subscriptionStartDate: z.coerce.date().optional(),
    notes: z.string().max(2000).optional(),
  })
  .openapi("CreateVpsUserBody");

export const updateVpsUserSchema = z
  .object({
    customerName: z.string().trim().min(1).max(120).optional(),
    customerEmail: z.string().email().optional(),
    customerPhone: z.string().max(30).optional(),
    vpsServerId: z.string().nullable().optional(),
    subscriptionPlan: z.enum(subscriptionPlans).optional(),
    subscriptionStartDate: z.coerce.date().optional(),
    subscriptionEndDate: z.coerce.date().optional(),
    status: z.enum(vpsUserStatuses).optional(),
    notes: z.string().max(2000).optional(),
  })
  .openapi("UpdateVpsUserBody");

export const renewVpsUserSchema = z
  .object({
    subscriptionPlan: z.enum(subscriptionPlans),
  })
  .openapi("RenewVpsUserBody");

export const vpsUserQuerySchema = z.object({
  status: z.enum(vpsUserStatuses).optional(),
  subscriptionPlan: z.enum(subscriptionPlans).optional(),
  expiringSoon: z.enum(["true", "false"]).optional(),
  search: z.string().optional(),
});

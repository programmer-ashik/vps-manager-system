import { z } from '../../../core/validation/zod-openapi.js'

const paymentTypes = ['Payoneer', 'Wise', 'Bank Transfer', 'Other']
const statuses = ['pending', 'paid', 'rejected']

export const createPartnerPaymentSchema = z
  .object({
    partnerName: z.string().trim().min(1).max(120),
    partnerEmail: z.string().email(),
    amount: z.coerce.number().positive(),
    paymentType: z.enum(paymentTypes),
    transactionId: z.string().trim().min(1).max(120),
    notes: z.string().max(2000).optional(),
  })
  .openapi('CreatePartnerPaymentBody')

export const updatePartnerPaymentSchema = z
  .object({
    partnerName: z.string().trim().min(1).max(120).optional(),
    partnerEmail: z.string().email().optional(),
    amount: z.coerce.number().positive().optional(),
    paymentType: z.enum(paymentTypes).optional(),
    transactionId: z.string().trim().min(1).max(120).optional(),
    notes: z.string().max(2000).optional(),
  })
  .openapi('UpdatePartnerPaymentBody')

export const updatePartnerPaymentStatusSchema = z
  .object({
    status: z.enum(statuses),
  })
  .openapi('UpdatePartnerPaymentStatusBody')

export const partnerPaymentQuerySchema = z.object({
  status: z.enum(statuses).optional(),
  search: z.string().optional(),
})

import { z } from '../../../core/validation/zod-openapi.js'

const transactionTypes = ['Nagad', 'bKash', 'Rocket', 'Upay', 'Other']
const paymentStatuses = ['pending', 'paid', 'rejected']
const serverStatuses = ['processing', 'ready_to_share', 'shared']

export const createServerRequestSchema = z
  .object({
    customerName: z.string().trim().min(1).max(120),
    customerEmail: z.string().email(),
    customerPhone: z.string().max(30).optional(),
    serverName: z.string().trim().min(1).max(200),
    serverDetails: z.string().trim().min(1),
    description: z.string().max(2000).optional(),
    transactionType: z.enum(transactionTypes),
    transactionId: z.string().trim().min(1).max(120),
    amount: z.number().positive(),
  })
  .openapi('CreateServerRequestBody')

export const updateServerRequestSchema = z
  .object({
    customerName: z.string().trim().min(1).max(120).optional(),
    customerEmail: z.string().email().optional(),
    customerPhone: z.string().max(30).optional(),
    serverName: z.string().trim().min(1).max(200).optional(),
    serverDetails: z.string().trim().min(1).optional(),
    description: z.string().max(2000).optional(),
    transactionType: z.enum(transactionTypes).optional(),
    transactionId: z.string().trim().min(1).max(120).optional(),
    amount: z.number().positive().optional(),
  })
  .openapi('UpdateServerRequestBody')

export const updatePaymentStatusSchema = z
  .object({
    paymentStatus: z.enum(paymentStatuses),
  })
  .openapi('UpdateServerRequestPaymentStatusBody')

export const updateServerStatusSchema = z
  .object({
    serverStatus: z.enum(serverStatuses),
  })
  .openapi('UpdateServerRequestServerStatusBody')

export const sendServerDetailsSchema = z
  .object({
    serverIp: z.string().trim().min(1).max(120),
    serverUsername: z.string().trim().min(1).max(120),
    serverPassword: z.string().trim().min(1).max(200),
    serverPanelUrl: z.string().trim().max(500).optional(),
    additionalNotes: z.string().max(2000).optional(),
  })
  .openapi('SendServerDetailsBody')

export const serverRequestQuerySchema = z.object({
  paymentStatus: z.enum(paymentStatuses).optional(),
  serverStatus: z.enum(serverStatuses).optional(),
  search: z.string().optional(),
})

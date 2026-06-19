import { z } from '../../core/validation/zod-openapi.js'

export const userDtoSchema = z
  .object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().optional(),
    role: z.enum(['user', 'admin']),
    status: z.enum(['active', 'inactive']),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi('UserDto')

export const todoDtoSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    completed: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi('TodoDto')

export const serverDeliveryDtoSchema = z
  .object({
    serverIp: z.string().optional(),
    serverUsername: z.string().optional(),
    serverPassword: z.string().optional(),
    serverPanelUrl: z.string().optional(),
    additionalNotes: z.string().optional(),
  })
  .openapi('ServerDeliveryDto')

export const serverRequestDtoSchema = z
  .object({
    id: z.string(),
    customerName: z.string(),
    customerEmail: z.string().email(),
    customerPhone: z.string().optional(),
    serverName: z.string(),
    serverDetails: z.string(),
    description: z.string().optional(),
    transactionType: z.enum(['Nagad', 'bKash', 'Rocket', 'Upay', 'Other']),
    transactionId: z.string(),
    amount: z.number(),
    paymentStatus: z.enum(['pending', 'paid', 'rejected']),
    serverStatus: z.enum(['processing', 'ready_to_share', 'shared']),
    serverDeliveryDetails: serverDeliveryDtoSchema.optional(),
    emailSentAt: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi('ServerRequestDto')

export const partnerPaymentDtoSchema = z
  .object({
    id: z.string(),
    partnerName: z.string(),
    partnerEmail: z.string().email(),
    amount: z.number(),
    paymentType: z.enum(['Payoneer', 'Wise', 'Bank Transfer', 'Other']),
    transactionId: z.string(),
    notes: z.string().optional(),
    screenshotUrl: z.string().optional(),
    status: z.enum(['pending', 'paid', 'rejected']),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi('PartnerPaymentDto')

export const vpsCredentialsDtoSchema = z
  .object({
    username: z.string().optional(),
    password: z.string().optional(),
    panelUrl: z.string().optional(),
    additionalNotes: z.string().optional(),
  })
  .openapi('VpsCredentialsDto')

export const vpsServerDtoSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    serverDetails: z.string(),
    ip: z.string(),
    credentials: vpsCredentialsDtoSchema.optional(),
    availabilityStatus: z.enum(['available', 'shared']),
    pingStatus: z.enum(['online', 'offline', 'unknown']),
    isActive: z.boolean(),
    lastPingedAt: z.string().optional(),
    assignedVpsUserId: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi('VpsServerDto')

export const vpsUserDtoSchema = z
  .object({
    id: z.string(),
    customerName: z.string(),
    customerEmail: z.string().email(),
    customerPhone: z.string().optional(),
    vpsServerId: z.string().nullable().optional(),
    vpsServer: vpsServerDtoSchema.nullable().optional(),
    subscriptionPlan: z.enum(['monthly', '3_monthly', '6_monthly', 'yearly']),
    subscriptionStartDate: z.string(),
    subscriptionEndDate: z.string(),
    status: z.enum(['active', 'expired', 'cancelled']),
    notes: z.string().optional(),
    expiringSoon: z.boolean(),
    daysUntilExpiry: z.number().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi('VpsUserDto')

export const dashboardSummarySchema = z
  .object({
    usersCount: z.number(),
    pendingServerRequests: z.number(),
    paidServerRequests: z.number(),
    processingServers: z.number(),
    readyToShareServers: z.number(),
    pendingPartnerPayments: z.number(),
    paidPartnerPayments: z.number(),
    recentServerRequests: z.array(serverRequestDtoSchema),
    recentPartnerPayments: z.array(partnerPaymentDtoSchema),
  })
  .openapi('DashboardSummary')

export const authPayloadSchema = z
  .object({
    token: z.string().openapi({ description: 'JWT access token' }),
    user: userDtoSchema,
  })
  .openapi('AuthPayload')

export const errorResponseSchema = z
  .object({
    success: z.literal(false),
    code: z.string(),
    message: z.string(),
    details: z
      .array(
        z.object({
          path: z.string().optional(),
          message: z.string(),
        })
      )
      .optional(),
    requestId: z.string().optional(),
    clientIp: z.string().optional(),
  })
  .openapi('ErrorResponse')

export function successEnvelope(dataSchema) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
  })
}

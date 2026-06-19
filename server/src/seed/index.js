import 'dotenv/config'
import mongoose from 'mongoose'
import { connectToDatabase } from '../loaders/mongoose.loader.js'
import { UserModel } from '../api/v1/users/User.model.js'
import { ServerRequestModel } from '../api/v1/server-requests/ServerRequest.model.js'
import { PartnerPaymentModel } from '../api/v1/partner-payments/PartnerPayment.model.js'
import { VpsServerModel } from '../api/v1/vps-servers/VpsServer.model.js'
import { VpsUserModel } from '../api/v1/vps-users/VpsUser.model.js'
import { calculateSubscriptionEndDate } from '../utils/subscription.js'
import { hashPassword } from '../utils/password.js'
import { logger } from '../core/logging/logger.js'

const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASSWORD = 'Password@1234'

async function seedAdmin() {
  const existing = await UserModel.findOne({ email: ADMIN_EMAIL })
  if (existing) {
    logger.info('Default admin already exists, skipping')
    return
  }
  await UserModel.create({
    name: 'Admin',
    email: ADMIN_EMAIL,
    password: await hashPassword(ADMIN_PASSWORD),
    role: 'admin',
    status: 'active',
  })
  logger.info('Seeded default admin user')
}

async function seedUsers() {
  const users = [
  {
    name: 'Jane Operator',
    email: 'jane@example.com',
    password: 'Password@1234',
    role: 'user',
  },
  {
    name: 'Mark Support',
    email: 'mark@example.com',
    password: 'Password@1234',
    role: 'user',
  },
  ]

  for (const user of users) {
    const exists = await UserModel.findOne({ email: user.email })
    if (exists) continue
    await UserModel.create({
      ...user,
      email: user.email.toLowerCase(),
      password: await hashPassword(user.password),
      status: 'active',
    })
  }
  logger.info('Seeded sample users')
}

async function seedServerRequests() {
  const count = await ServerRequestModel.countDocuments()
  if (count > 0) {
    logger.info('Server requests already exist, skipping')
    return
  }

  await ServerRequestModel.insertMany([
    {
      customerName: 'Rahim Uddin',
      customerEmail: 'rahim@example.com',
      customerPhone: '+8801712345678',
      serverName: 'VPS Basic',
      serverDetails: '2 vCPU, 4GB RAM, 80GB SSD',
      description: 'Need Ubuntu 22.04',
      transactionType: 'bKash',
      transactionId: 'BK123456',
      amount: 1500,
      paymentStatus: 'pending',
      serverStatus: 'processing',
    },
    {
      customerName: 'Sadia Khan',
      customerEmail: 'sadia@example.com',
      serverName: 'VPS Pro',
      serverDetails: '4 vCPU, 8GB RAM, 160GB SSD',
      transactionType: 'Nagad',
      transactionId: 'NG789012',
      amount: 2800,
      paymentStatus: 'paid',
      serverStatus: 'processing',
    },
    {
      customerName: 'Karim Ahmed',
      customerEmail: 'karim@example.com',
      serverName: 'Dedicated Mini',
      serverDetails: '8 vCPU, 16GB RAM, 500GB SSD',
      transactionType: 'Rocket',
      transactionId: 'RK345678',
      amount: 5500,
      paymentStatus: 'paid',
      serverStatus: 'ready_to_share',
    },
    {
      customerName: 'Nusrat Jahan',
      customerEmail: 'nusrat@example.com',
      serverName: 'VPS Standard',
      serverDetails: '2 vCPU, 4GB RAM, 100GB SSD',
      transactionType: 'Upay',
      transactionId: 'UP901234',
      amount: 1800,
      paymentStatus: 'paid',
      serverStatus: 'shared',
      serverDeliveryDetails: {
        serverIp: '203.0.113.10',
        serverUsername: 'root',
        serverPassword: 'temp-pass-123',
        serverPanelUrl: 'https://panel.example.com',
        additionalNotes: 'Please change password after first login.',
      },
      emailSentAt: new Date(),
    },
    {
      customerName: 'Imran Hossain',
      customerEmail: 'imran@example.com',
      serverName: 'VPS Starter',
      serverDetails: '1 vCPU, 2GB RAM, 40GB SSD',
      transactionType: 'Other',
      transactionId: 'OT567890',
      amount: 900,
      paymentStatus: 'rejected',
      serverStatus: 'processing',
    },
  ])
  logger.info('Seeded server requests')
}

async function seedPartnerPayments() {
  const count = await PartnerPaymentModel.countDocuments()
  if (count > 0) {
    logger.info('Partner payments already exist, skipping')
    return
  }

  await PartnerPaymentModel.insertMany([
    {
      partnerName: 'Alpha Hosting',
      partnerEmail: 'alpha@partner.com',
      amount: 250,
      paymentType: 'Payoneer',
      transactionId: 'PYN-10001',
      notes: 'January commission',
      status: 'pending',
    },
    {
      partnerName: 'Beta Cloud',
      partnerEmail: 'beta@partner.com',
      amount: 480,
      paymentType: 'Wise',
      transactionId: 'WISE-20002',
      status: 'paid',
    },
    {
      partnerName: 'Gamma Networks',
      partnerEmail: 'gamma@partner.com',
      amount: 120,
      paymentType: 'Bank Transfer',
      transactionId: 'BNK-30003',
      status: 'rejected',
      notes: 'Invalid reference',
    },
    {
      partnerName: 'Delta Partners',
      partnerEmail: 'delta@partner.com',
      amount: 350,
      paymentType: 'Other',
      transactionId: 'OTH-40004',
      status: 'pending',
    },
  ])
  logger.info('Seeded partner payments')
}

async function seedVpsServers() {
  const count = await VpsServerModel.countDocuments()
  if (count > 0) {
    logger.info('VPS servers already exist, skipping')
    return
  }

  await VpsServerModel.insertMany([
    {
      name: 'VPS-US-01',
      serverDetails: '2 vCPU, 4GB RAM, 80GB SSD — Ubuntu 22.04',
      ip: '8.8.8.8',
      credentials: {
        username: 'root',
        password: 'seed-pass-001',
        panelUrl: 'https://panel.example.com/vps-us-01',
        additionalNotes: 'Available for assignment',
      },
      availabilityStatus: 'available',
      pingStatus: 'unknown',
      isActive: true,
    },
    {
      name: 'VPS-EU-02',
      serverDetails: '4 vCPU, 8GB RAM, 160GB SSD — Debian 12',
      ip: '1.1.1.1',
      credentials: {
        username: 'admin',
        password: 'seed-pass-002',
        panelUrl: 'https://panel.example.com/vps-eu-02',
      },
      availabilityStatus: 'available',
      pingStatus: 'unknown',
      isActive: true,
    },
    {
      name: 'VPS-ASIA-03',
      serverDetails: '2 vCPU, 4GB RAM, 100GB SSD — Ubuntu 24.04',
      ip: '203.0.113.50',
      credentials: {
        username: 'root',
        password: 'seed-pass-003',
      },
      availabilityStatus: 'shared',
      pingStatus: 'unknown',
      isActive: true,
    },
  ])
  logger.info('Seeded VPS servers')
}

async function seedVpsUsers() {
  const count = await VpsUserModel.countDocuments()
  if (count > 0) {
    logger.info('VPS users already exist, skipping')
    return
  }

  const sharedServer = await VpsServerModel.findOne({ name: 'VPS-ASIA-03' })
  const now = new Date()
  const expiringEnd = new Date()
  expiringEnd.setDate(expiringEnd.getDate() + 3)

  const users = await VpsUserModel.insertMany([
    {
      customerName: 'Rahim Uddin',
      customerEmail: 'rahim.vps@example.com',
      customerPhone: '+8801712345678',
      vpsServerId: sharedServer?._id ?? null,
      subscriptionPlan: 'monthly',
      subscriptionStartDate: now,
      subscriptionEndDate: calculateSubscriptionEndDate(now, 'monthly'),
      status: 'active',
      notes: 'Assigned from seed data',
    },
    {
      customerName: 'Sadia Khan',
      customerEmail: 'sadia.vps@example.com',
      subscriptionPlan: 'yearly',
      subscriptionStartDate: now,
      subscriptionEndDate: expiringEnd,
      status: 'active',
      notes: 'Expiring soon — contact for renewal',
    },
    {
      customerName: 'Karim Ahmed',
      customerEmail: 'karim.vps@example.com',
      subscriptionPlan: '6_monthly',
      subscriptionStartDate: new Date(now.getFullYear(), now.getMonth() - 7, 1),
      subscriptionEndDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      status: 'expired',
    },
  ])

  if (sharedServer) {
    await VpsServerModel.findByIdAndUpdate(sharedServer._id, {
      assignedVpsUserId: users[0]._id,
    })
  }

  logger.info('Seeded VPS users')
}

async function main() {
  await connectToDatabase()
  await seedAdmin()
  await seedUsers()
  await seedServerRequests()
  await seedPartnerPayments()
  await seedVpsServers()
  await seedVpsUsers()
  logger.info('Seed completed successfully')
  await mongoose.disconnect()
}

main().catch((err) => {
  logger.error('Seed failed', { err })
  process.exit(1)
})

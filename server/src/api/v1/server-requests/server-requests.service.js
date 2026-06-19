import {
  findAllServerRequests,
  createServerRequestRecord,
  findServerRequestById,
  updateServerRequestById,
  updatePaymentStatusById,
  updateServerStatusById,
  sendServerDetailsById,
  deleteServerRequestById,
} from './server-requests.repo.js'
import { sendServerDeliveryEmail } from '../../../services/email.service.js'

export async function listServerRequests(query) {
  return findAllServerRequests(query)
}

export async function createServerRequest(input) {
  return createServerRequestRecord(input)
}

export async function getServerRequestById(id) {
  return findServerRequestById(id)
}

export async function updateServerRequest(id, input) {
  return updateServerRequestById(id, input)
}

export async function updatePaymentStatus(id, paymentStatus) {
  return updatePaymentStatusById(id, paymentStatus)
}

export async function updateServerStatus(id, serverStatus) {
  return updateServerStatusById(id, serverStatus)
}

export async function sendServerDetails(id, delivery) {
  const existing = await findServerRequestById(id)
  if (!existing) return null

  await sendServerDeliveryEmail({
    toEmail: existing.customerEmail,
    customerName: existing.customerName,
    serverName: existing.serverName,
    serverDetails: existing.serverDetails,
    delivery,
  })

  return sendServerDetailsById(id, delivery)
}

export async function deleteServerRequest(id) {
  return deleteServerRequestById(id)
}

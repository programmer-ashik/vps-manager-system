import {
  findAllPartnerPayments,
  createPartnerPaymentRecord,
  findPartnerPaymentById,
  updatePartnerPaymentById,
  updatePartnerPaymentStatusById,
  deletePartnerPaymentById,
} from './partner-payments.repo.js'

export async function listPartnerPayments(query) {
  return findAllPartnerPayments(query)
}

export async function createPartnerPayment(input) {
  return createPartnerPaymentRecord(input)
}

export async function getPartnerPaymentById(id) {
  return findPartnerPaymentById(id)
}

export async function updatePartnerPayment(id, input) {
  return updatePartnerPaymentById(id, input)
}

export async function updatePartnerPaymentStatus(id, status) {
  return updatePartnerPaymentStatusById(id, status)
}

export async function deletePartnerPayment(id) {
  return deletePartnerPaymentById(id)
}

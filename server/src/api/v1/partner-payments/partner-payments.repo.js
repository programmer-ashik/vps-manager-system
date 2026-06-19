import { PartnerPaymentModel } from './PartnerPayment.model.js'

function buildFilter(query = {}) {
  const filter = {}
  if (query.status) filter.status = query.status
  if (query.search) {
    const regex = new RegExp(query.search, 'i')
    filter.$or = [
      { partnerName: regex },
      { partnerEmail: regex },
      { transactionId: regex },
    ]
  }
  return filter
}

export async function findAllPartnerPayments(query) {
  return PartnerPaymentModel.find(buildFilter(query))
    .sort({ createdAt: -1 })
    .lean()
    .exec()
}

export async function createPartnerPaymentRecord(input) {
  return PartnerPaymentModel.create(input)
}

export async function findPartnerPaymentById(id) {
  return PartnerPaymentModel.findById(id).exec()
}

export async function updatePartnerPaymentById(id, input) {
  return PartnerPaymentModel.findByIdAndUpdate(id, input, { new: true }).exec()
}

export async function updatePartnerPaymentStatusById(id, status) {
  return PartnerPaymentModel.findByIdAndUpdate(id, { status }, { new: true }).exec()
}

export async function deletePartnerPaymentById(id) {
  return PartnerPaymentModel.findByIdAndDelete(id).exec()
}

export async function countPartnerPayments(filter) {
  return PartnerPaymentModel.countDocuments(filter).exec()
}

export async function findRecentPartnerPayments(limit = 5) {
  return PartnerPaymentModel.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .exec()
}

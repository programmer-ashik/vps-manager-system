import { NotFound, UnprocessableEntity } from '../../../core/http/error.types.js'
import {
  listPartnerPayments,
  createPartnerPayment,
  getPartnerPaymentById,
  updatePartnerPayment,
  updatePartnerPaymentStatus,
  deletePartnerPayment,
} from './partner-payments.service.js'
import { mapPartnerPayment, mapPartnerPayments } from './partner-payments.mapper.js'
import { createPartnerPaymentSchema } from './partner-payments.validators.js'

export async function getPartnerPayments(req, res) {
  const items = await listPartnerPayments(req.query ?? {})
  res.ok(mapPartnerPayments(items))
}

export async function postPartnerPayment(req, res) {
  const body = req.body ?? {}
  const parsed = createPartnerPaymentSchema.safeParse({
    partnerName: body.partnerName,
    partnerEmail: body.partnerEmail,
    amount: body.amount,
    paymentType: body.paymentType,
    transactionId: body.transactionId,
    notes: body.notes,
  })
  if (!parsed.success) {
    throw new UnprocessableEntity('Validation failed', parsed.error.issues.map((i) => ({
      path: i.path.join('.'),
      message: i.message,
    })))
  }

  const screenshotUrl = req.file
    ? `/uploads/partner-payments/${req.file.filename}`
    : undefined
  const created = await createPartnerPayment({
    ...parsed.data,
    screenshotUrl,
  })
  res.ok(mapPartnerPayment(created), 201)
}

export async function getPartnerPayment(req, res) {
  const item = await getPartnerPaymentById(req.params.id)
  if (!item) throw new NotFound('Partner payment not found')
  res.ok(mapPartnerPayment(item))
}

export async function putPartnerPayment(req, res) {
  const updated = await updatePartnerPayment(req.params.id, req.body ?? {})
  if (!updated) throw new NotFound('Partner payment not found')
  res.ok(mapPartnerPayment(updated))
}

export async function patchPartnerPaymentStatus(req, res) {
  const updated = await updatePartnerPaymentStatus(
    req.params.id,
    req.body.status
  )
  if (!updated) throw new NotFound('Partner payment not found')
  res.ok(mapPartnerPayment(updated))
}

export async function deletePartnerPaymentById(req, res) {
  const deleted = await deletePartnerPayment(req.params.id)
  if (!deleted) throw new NotFound('Partner payment not found')
  res.ok({ id: String(deleted._id) })
}

export function mapPartnerPayment(doc) {
  return {
    id: String(doc?._id ?? doc?.id),
    partnerName: doc.partnerName,
    partnerEmail: doc.partnerEmail,
    amount: doc.amount,
    paymentType: doc.paymentType,
    transactionId: doc.transactionId,
    notes: doc.notes,
    screenshotUrl: doc.screenshotUrl,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export function mapPartnerPayments(docs) {
  return docs.map(mapPartnerPayment)
}

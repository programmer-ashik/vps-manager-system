export function mapServerRequest(doc) {
  return {
    id: String(doc?._id ?? doc?.id),
    customerName: doc.customerName,
    customerEmail: doc.customerEmail,
    customerPhone: doc.customerPhone,
    serverName: doc.serverName,
    serverDetails: doc.serverDetails,
    description: doc.description,
    transactionType: doc.transactionType,
    transactionId: doc.transactionId,
    amount: doc.amount,
    paymentStatus: doc.paymentStatus,
    serverStatus: doc.serverStatus,
    serverDeliveryDetails: doc.serverDeliveryDetails,
    emailSentAt: doc.emailSentAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export function mapServerRequests(docs) {
  return docs.map(mapServerRequest)
}

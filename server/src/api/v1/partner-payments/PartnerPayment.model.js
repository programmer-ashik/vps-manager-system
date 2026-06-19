import { Schema, model } from 'mongoose'

const partnerPaymentSchema = new Schema(
  {
    partnerName: { type: String, required: true },
    partnerEmail: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    paymentType: {
      type: String,
      enum: ['Payoneer', 'Wise', 'Bank Transfer', 'Other'],
      required: true,
    },
    transactionId: { type: String, required: true, index: true },
    notes: { type: String },
    screenshotUrl: { type: String },
    status: {
      type: String,
      enum: ['pending', 'paid', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
)

export const PartnerPaymentModel = model('PartnerPayment', partnerPaymentSchema)

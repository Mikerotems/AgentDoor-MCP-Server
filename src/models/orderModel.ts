import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },

  amountKobo: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: [
      "pending",
      "paid",
      "refund_requested",
      "refund_approved"
    ],
    default: "pending",
  },
  
  paymentStatus: {
  type: String,
  enum: [
    "unpaid",
    "pending",
    "paid",
    "failed",
    "refunded"
  ],
  default: "unpaid",
},


  note: String,
}, {
  timestamps: true,
});

export const orderModel = mongoose.model("Order", orderSchema);
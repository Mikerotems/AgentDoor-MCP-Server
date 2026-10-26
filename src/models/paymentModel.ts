import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    transactionRef: {
      type: String,
      required: true,
      unique: true,
    },

    amountKobo: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "success",
        "failed",
        "cancelled",
      ],
      default: "pending",
    },

    verifyTransactionPassed: {
      type: Boolean,
      default: false,
    },

    webhookVerified: {
      type: Boolean,
      default: false,
    },

    webhookReceivedAt: {
      type: Date,
    },

    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const paymentModel = mongoose.model("Payment", paymentSchema);
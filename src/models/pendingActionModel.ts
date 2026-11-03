import mongoose from "mongoose";

const pendingActionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["refund_order"],
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    createdBy: {
      type: String,
      required: true, // agent client id
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "expired",
        "executed",
      ],
      default: "pending",
    },

    approvedBy: {
      type: String,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    executedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const pendingActionModel = mongoose.model(
    "PendingAction", pendingActionSchema);
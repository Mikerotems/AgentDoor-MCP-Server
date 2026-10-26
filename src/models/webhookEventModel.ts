import mongoose from "mongoose";

const webhookEventSchema = new mongoose.Schema(
  {
    transactionRef: {
      type: String,
      required: true,
      unique: true,
    },

    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    signatureVerified: {
      type: Boolean,
      default: false,
    },

    processed: {
      type: Boolean,
      default: false,
    },

    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const webhookEvent = mongoose.model(
  "WebhookEvent",
  webhookEventSchema
);
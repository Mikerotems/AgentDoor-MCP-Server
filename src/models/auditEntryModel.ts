import mongoose from "mongoose";

const auditEntrySchema = new mongoose.Schema(
  {
    agent: {
      type: String,
      required: true,
    },

    tool: {
      type: String,
      required: true,
    },

    arguments: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    result: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    success: {
      type: Boolean,
      default: true,
    },

    ipAddress: String,
  },
  {
    timestamps: true,
  }
);

export const AuditEntry = mongoose.model(
  "AuditEntry",
  auditEntrySchema
);
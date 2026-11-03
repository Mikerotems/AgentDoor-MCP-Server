import { AuditEntry } from "../models/auditEntryModel";

export async function logAudit(
  agent: string,
  tool: string,
  argumentsData: any,
  result: any
) {
  await AuditEntry.create({
    agent,
    tool,
    arguments: argumentsData,
    result,
    success: true,
  });
}
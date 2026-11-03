import { Router } from "express";

import { approveRefund }
from "../controllers/approval.controller";

import { rejectRefund }
from "../controllers/rejectRefund.controller";

const approvalRouter = Router();

approvalRouter.post(
  "/approvals/:id/approve",
  approveRefund
);

approvalRouter.post(
  "/approvals/:id/reject",
  rejectRefund
);

export default approvalRouter;
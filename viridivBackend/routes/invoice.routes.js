import express from "express";
import { getInvoicesReqAdmin } from "../controller/invoice.controller.js";
import { verifyAdminToken, verifyToken } from "../middleware/verifyToken.js";
const invoiceRouter = express.Router();

invoiceRouter.get(
  "/get-offer-invoices-admin/:offerlistId",
  verifyAdminToken,
  getInvoicesReqAdmin
);

export default invoiceRouter;

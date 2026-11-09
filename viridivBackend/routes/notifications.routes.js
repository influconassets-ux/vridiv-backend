import express from "express";
import {
  getAdminNotifications,
  markNotificationsAsRead,
  getBuyerNotifications,
  getSellerNotifications,
} from "../controller/notifications.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const notificationRouter = express.Router();

notificationRouter.get("/get-admi-notifications", getAdminNotifications);
notificationRouter.get(
  "/get-buyer-notifications",
  verifyToken,
  getBuyerNotifications
);
notificationRouter.get(
  "/get-seller-notifications",
  verifyToken,
  getSellerNotifications
);
notificationRouter.put("/mark-read", markNotificationsAsRead);

export default notificationRouter;

import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    checkNewNotifications,
    deleteNotification,
    getNotifications,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.get("/check", protectRoute, checkNewNotifications);
router.delete("/:id", protectRoute, deleteNotification);

export default router;

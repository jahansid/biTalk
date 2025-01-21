import express from "express";
import { protectRoute } from "../middleware/protectAuth.js";
import {
  getMessagesBetweenUsers,
  getUsersSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersSidebar);
router.get("/:id", protectRoute, getMessagesBetweenUsers);

router.post("/send/:id", protectRoute, sendMessage);

export default router;

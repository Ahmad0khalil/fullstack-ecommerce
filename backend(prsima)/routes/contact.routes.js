import { createContactMessage } from "../controllers/contact.controller.js";
import express from 'express';
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Contact route is working!" });
});
router.post("/", createContactMessage);

export default router;
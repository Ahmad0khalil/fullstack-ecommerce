import { contactService } from "../services/contact.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createContactMessage = async (req, res, next) => {
  const { name, email, orderNumber, message } = req.body;
    console.log("------------Received contact message:------------");
    console.log({ name, email, orderNumber, message });
  if (!name || !email || !message) {
    return res.status(400).json(
      new ApiResponse(400, null, "Name, email, and message are required")
    );
  }

  try {
    const saved = await contactService.createMessage({
      name,
      email,
      orderNumber,
      message,
    });

    return res.status(201).json(
      new ApiResponse(201, saved, "Message sent")
    );
  } catch (err) {
    next(err);
  }
};
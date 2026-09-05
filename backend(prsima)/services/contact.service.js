import { Resend } from "resend";
import { prisma } from "../config/db.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const contactService = {
  createMessage: async ({ name, email, orderNumber, message }) => {
    const saved = await prisma.contactMessage.create({
      data: {
        name,
        email,
        orderNumber: orderNumber || null,
        message,
      },
      select: { id: true },
    });

    try {
      await resend.emails.send({
        from: "Store <notifications@nextjsecommerce.com>",
        to: "ahmad.khalil22a@gmail.com",
        replyTo: email,
        subject: `New contact message from ${name}`,
        text: `From: ${name} (${email})\nOrder: ${orderNumber || "-"}\n\n${message}`,
      });
    } catch (emailError) {
      console.error("Failed to send contact notification email:", emailError);
    }

    return saved;
  },
};
import { createFileRoute } from "@tanstack/react-router";
import { emailService } from "@/lib/email";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { name, email, subject, message } = body as {
            name: string;
            email: string;
            subject: string;
            message: string;
          };

          if (!name || !email || !subject || !message) {
            return Response.json(
              { error: "All fields are required" },
              { status: 400 }
            );
          }

          logger.info("api/contact", "Received contact form submission", { name, email, subject });

          // Send notification to admin
          const result = await emailService.notifyContactForm({
            name,
            email,
            subject,
            message,
          });

          if (!result.success) {
            logger.error("api/contact", "Failed to send admin notification", result);
          }

          // Send confirmation to user
          const userHtml = `
            <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #1a1a1a; font-family: 'Playfair Display', serif;">Thank you for contacting us!</h1>
              <p style="font-size: 16px; color: #333;">Hi ${name},</p>
              <p style="font-size: 16px; color: #333;">We've received your message and will get back to you within 24 hours.</p>
              <div style="background: #f5f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
              </div>
              <p style="color: #666; font-size: 14px;">Full Solution Team<br/>robbie@fullsolution.vip</p>
            </div>
          `;

          const userResult = await emailService.send({
            to: email,
            subject: "We received your message – Full Solution",
            html: userHtml,
          });

          if (!userResult.success) {
            logger.error("api/contact", "Failed to send user confirmation", userResult);
          }

          logger.info("api/contact", "Contact form processed successfully");

          return Response.json({
            success: true,
            message: "Your message has been sent successfully.",
          });
        } catch (error) {
          logger.error("api/contact", "Contact form error:", error);
          return Response.json(
            { error: "Failed to process your request. Please try again." },
            { status: 500 }
          );
        }
      },
    },
  },
});

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@fullsolution.vip";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "frederick1989@gmail.com";

let resend: Resend | null = null;

if (RESEND_API_KEY && RESEND_API_KEY !== "re_YourResendApiKeyHere") {
  resend = new Resend(RESEND_API_KEY);
}

export interface EmailTemplate {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export const emailService = {
  async send(template: EmailTemplate) {
    if (!resend) {
      console.warn("Resend not configured — email not sent:", template.subject);
      return { success: false, reason: "not_configured" };
    }

    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: template.to,
        subject: template.subject,
        html: template.html,
        replyTo: template.replyTo,
      });

      if (result.error) {
        console.error("Resend error:", result.error);
        return { success: false, error: result.error };
      }

      return { success: true, id: (result.data as { id: string })?.id };
    } catch (error) {
      console.error("Failed to send email:", error);
      return { success: false, error: String(error) };
    }
  },

  // Lead notification to admin
  async notifyLead(data: {
    type: "application" | "sample_request" | "catalogue_download";
    name: string;
    email: string;
    company?: string;
    message?: string;
  }) {
    const typeLabels = {
      application: "Trade Account Application",
      sample_request: "Sample Request",
      catalogue_download: "Catalogue Download",
    };

    const html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a1a1a; font-family: 'Playfair Display', serif;">New ${typeLabels[data.type]}</h1>
        <div style="background: #f5f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ""}
          ${data.message ? `<p><strong>Message:</strong><br/>${data.message}</p>` : ""}
        </div>
        <p style="color: #666; font-size: 14px;">Received at ${new Date().toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })}</p>
      </div>
    `;

    return this.send({
      to: ADMIN_EMAIL,
      subject: `🚀 New ${typeLabels[data.type]}: ${data.name}`,
      html,
      replyTo: data.email,
    });
  },

  // Welcome email after signup
  async sendWelcomeEmail(data: { name: string; email: string }) {
    const html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a1a1a; font-family: 'Playfair Display', serif;">Welcome to Full Solution${data.name ? ", " + data.name : ""}!</h1>
        <p style="font-size: 16px; color: #333;">Thank you for creating an account with us.</p>
        <div style="background: #f5f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>You can now:</p>
          <ul>
            <li>Browse our <a href="${process.env.VITE_APP_URL || "https://full-solution-vip-ui.vercel.app"}/products">product range</a></li>
            <li>Chat with our <a href="${process.env.VITE_APP_URL || "https://full-solution-vip-ui.vercel.app"}/chat">AI assistant</a></li>
            <li>View your <a href="${process.env.VITE_APP_URL || "https://full-solution-vip-ui.vercel.app"}/portal">chat history</a></li>
          </ul>
        </div>
        <p style="color: #666; font-size: 14px;">If you have any questions, just reply to this email.</p>
      </div>
    `;

    return this.send({
      to: data.email,
      subject: "Welcome to Full Solution 🎉",
      html,
    });
  },

  // Contact form notification
  async notifyContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    const html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a1a1a; font-family: 'Playfair Display', serif;">New Contact Form Submission</h1>
        <div style="background: #f5f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong><br/>${data.message.replace(/\n/g, "<br/>")}</p>
        </div>
      </div>
    `;

    return this.send({
      to: ADMIN_EMAIL,
      subject: `📧 Contact Form: ${data.subject}`,
      html,
      replyTo: data.email,
    });
  },
};

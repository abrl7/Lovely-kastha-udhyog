import { Resend } from "resend";

// IMPORTANT: FROM_EMAIL must be either:
//   a) "Lovely Kastha Udhog <onboarding@resend.dev>"  ← works on free plan, no domain needed
//   b) Any address on a domain you have verified in Resend dashboard
// Using an unverified custom domain will cause Resend to reject the send with 403.
const FROM = process.env.FROM_EMAIL || "Lovely Kastha Udhog <onboarding@resend.dev>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lovelykasthaudhog.com";

const STATUS_LABELS = {
  new: "Inquiry Received",
  confirmed: "Order Confirmed",
  measurement_scheduled: "Measurement Visit Scheduled",
  measurement_done: "Measurements Taken",
  in_production: "In Production",
  ready: "Ready for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_MESSAGES = {
  new: "We've received your inquiry and will be in touch shortly.",
  confirmed: "Your order has been confirmed. We'll begin work soon.",
  measurement_scheduled: "We've scheduled a measurement visit. We'll confirm the time with you.",
  measurement_done: "Measurements are complete. We're finalising the design before production.",
  in_production: "Your piece is being crafted in our workshop.",
  ready: "Your furniture is ready! We'll contact you to arrange delivery or pickup.",
  delivered: "Your order has been delivered. Thank you for choosing Lovely Kastha Udhog.",
  cancelled: "This order has been cancelled. Please contact us if you have any questions.",
};

export async function sendStatusUpdateEmail({ customerEmail, customerName, orderCode, status }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("sendStatusUpdateEmail: RESEND_API_KEY not set, skipping.");
    return;
  }
  if (!customerEmail) {
    console.log("sendStatusUpdateEmail: no customerEmail on order, skipping.");
    return;
  }

  // Create the client inside the function so it always picks up the live
  // env var value rather than a module-level snapshot from cold-start.
  const resend = new Resend(apiKey);

  const label = STATUS_LABELS[status] || status;
  const message = STATUS_MESSAGES[status] || "";

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: customerEmail,
      subject: `Your order ${orderCode} — ${label}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Georgia, serif; background:#F7F1E6; margin:0; padding:0;">
          <div style="max-width:520px; margin:40px auto; background:#fff; border-radius:4px; overflow:hidden; border:1px solid #e0d5c5;">
            <div style="background:#2E2017; padding:28px 32px;">
              <p style="color:#A8854F; font-size:11px; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; margin:0 0 6px;">
                Lovely Kastha Udhog
              </p>
              <h1 style="color:#EFE6D8; font-size:22px; font-weight:400; margin:0;">${label}</h1>
            </div>
            <div style="padding:28px 32px;">
              <p style="color:#2B2620; font-size:15px; margin:0 0 16px;">Hi ${customerName},</p>
              <p style="color:#2B2620; font-size:15px; margin:0 0 24px;">${message}</p>
              <div style="background:#F7F1E6; border:1px solid #e0d5c5; border-radius:4px; padding:16px 20px; margin-bottom:24px;">
                <p style="font-size:11px; color:#888; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; margin:0 0 4px;">Your Order Code</p>
                <p style="font-size:22px; color:#2E2017; font-weight:500; margin:0; letter-spacing:0.05em;">${orderCode}</p>
              </div>
              <a href="${SITE_URL}/track"
                style="display:inline-block; background:#B5552B; color:#fff; text-decoration:none;
                       font-size:13px; font-weight:600; padding:10px 20px; border-radius:3px;">
                Track your order →
              </a>
            </div>
            <div style="border-top:1px solid #e0d5c5; padding:16px 32px;">
              <p style="font-size:12px; color:#aaa; margin:0;">
                Questions? Call us at +977-98-16630510 · Sun–Fri, 10am–7pm
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (result.error) {
      console.error("sendStatusUpdateEmail Resend error:", result.error);
    } else {
      console.log("sendStatusUpdateEmail sent, id:", result.data?.id);
    }
  } catch (err) {
    console.error("sendStatusUpdateEmail exception:", err?.message || err);
  }
}

import { Resend } from "resend";

// On Resend's free plan (no verified domain), FROM must stay as onboarding@resend.dev.
// Once you verify a domain, set FROM_EMAIL in Vercel to use it instead.
const FROM = process.env.FROM_EMAIL || "Lovely Kastha Udhog <onboarding@resend.dev>";

// Admin email that receives new-order notifications.
// On the free plan Resend only allows sending TO the account's own email,
// so this must match the email you signed up with on resend.com.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "iamabiral007@gmail.com";
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

export async function sendNewOrderNotification(order) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("sendNewOrderNotification: RESEND_API_KEY not set, skipping.");
    return;
  }

  const resend = new Resend(apiKey);

  const isCustom   = order.orderType === "custom";
  const subject    = isCustom
    ? `New custom inquiry — ${order.customerName} (${order.orderCode})`
    : `New order — ${order.customerName} (${order.orderCode})`;

  const detailRows = isCustom
    ? [
        order.customDetails?.furnitureType && order.customDetails.furnitureType !== "other"
          ? `<tr><td style="padding:6px 0;color:#888;font-size:13px;width:130px;">Type</td><td style="padding:6px 0;font-size:13px;color:#2B2620;">${order.customDetails.furnitureType.replace(/_/g, " ")}</td></tr>`
          : "",
        `<tr><td style="padding:6px 0;color:#888;font-size:13px;">Description</td><td style="padding:6px 0;font-size:13px;color:#2B2620;">${order.customDetails?.description || "—"}</td></tr>`,
        order.customDetails?.dimensions
          ? `<tr><td style="padding:6px 0;color:#888;font-size:13px;">Size estimate</td><td style="padding:6px 0;font-size:13px;color:#2B2620;">${order.customDetails.dimensions}</td></tr>`
          : "",
        order.customDetails?.woodPreference
          ? `<tr><td style="padding:6px 0;color:#888;font-size:13px;">Wood</td><td style="padding:6px 0;font-size:13px;color:#2B2620;">${order.customDetails.woodPreference}</td></tr>`
          : "",
        order.customDetails?.referenceImages?.length
          ? `<tr><td style="padding:6px 0;color:#888;font-size:13px;">Photos</td><td style="padding:6px 0;font-size:13px;color:#2B2620;">${order.customDetails.referenceImages.length} image(s) attached</td></tr>`
          : "",
      ].filter(Boolean).join("")
    : `<tr><td style="padding:6px 0;color:#888;font-size:13px;">Product</td><td style="padding:6px 0;font-size:13px;color:#2B2620;">${order.product?.name || order.product || "—"} × ${order.quantity}</td></tr>`;

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Georgia, serif; background:#F7F1E6; margin:0; padding:0;">
          <div style="max-width:520px; margin:40px auto; background:#fff; border-radius:4px; overflow:hidden; border:1px solid #e0d5c5;">
            <div style="background:#2E2017; padding:24px 32px;">
              <p style="color:#A8854F; font-size:11px; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; margin:0 0 4px;">
                Lovely Kastha Udhog · New ${isCustom ? "Inquiry" : "Order"}
              </p>
              <h1 style="color:#EFE6D8; font-size:20px; font-weight:400; margin:0;">
                ${order.customerName}
              </h1>
            </div>

            <div style="padding:24px 32px;">
              <!-- Order code -->
              <div style="background:#F7F1E6; border:1px solid #e0d5c5; border-radius:4px; padding:12px 16px; margin-bottom:20px;">
                <p style="font-size:11px; color:#888; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; margin:0 0 2px;">Order Code</p>
                <p style="font-size:20px; color:#2E2017; font-weight:500; margin:0; letter-spacing:0.05em;">${order.orderCode}</p>
              </div>

              <!-- Customer info -->
              <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
                <tr>
                  <td style="padding:6px 0;color:#888;font-size:13px;width:130px;">Phone</td>
                  <td style="padding:6px 0;font-size:13px;color:#2B2620;font-weight:600;">
                    <a href="tel:${order.customerPhone}" style="color:#B5552B;">${order.customerPhone}</a>
                  </td>
                </tr>
                ${order.customerEmail ? `
                <tr>
                  <td style="padding:6px 0;color:#888;font-size:13px;">Email</td>
                  <td style="padding:6px 0;font-size:13px;color:#2B2620;">${order.customerEmail}</td>
                </tr>` : ""}
              </table>

              <!-- Order details -->
              <p style="font-size:11px; color:#888; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; margin:0 0 8px; border-top:1px solid #e0d5c5; padding-top:16px;">
                What they want
              </p>
              <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
                ${detailRows}
              </table>

              <a href="${SITE_URL}/admin/dashboard"
                style="display:inline-block; background:#2E2017; color:#EFE6D8; text-decoration:none;
                       font-size:13px; font-weight:600; padding:10px 20px; border-radius:3px;">
                Open in admin →
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (result.error) {
      console.error("sendNewOrderNotification Resend error:", result.error);
    } else {
      console.log("sendNewOrderNotification sent, id:", result.data?.id);
    }
  } catch (err) {
    console.error("sendNewOrderNotification exception:", err?.message || err);
  }
}

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

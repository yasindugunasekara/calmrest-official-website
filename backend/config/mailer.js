const nodemailer = require("nodemailer");
const EmailJob = require("../models/EmailJob");
const Settings = require("../models/Settings");
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function emailHtml(subject, text) {
  const content = escapeHtml(text)
    .replace(
      /https:\/\/[^\s<]+/g,
      (url) =>
        `<a href="${url}" style="color:#8a682e;word-break:break-all">${url}</a>`,
    )
    .replace(/\n/g, "<br>");
  return `<!doctype html><html><body style="margin:0;background:#f5f3ee;font-family:Arial,sans-serif;color:#182331"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:24px 12px"><table role="presentation" width="100%" style="max-width:600px;margin:auto;background:white;border-radius:16px;overflow:hidden"><tr><td style="background:#142b2a;padding:30px;color:#d2b478;font-size:26px;font-weight:bold">CALM REST<br><span style="font-size:12px;letter-spacing:3px;color:#fff">MIDIGAMA · SRI LANKA</span></td></tr><tr><td style="padding:30px"><h1 style="font-size:22px;line-height:1.4">${escapeHtml(subject)}</h1><div style="font-size:15px;line-height:1.9">${content}</div></td></tr><tr><td style="padding:24px;background:#faf7f0;color:#59616c;font-size:13px;line-height:1.8">Your peaceful stay by the coast.<br>Calm Rest, Midigama<br><a href="mailto:calmrestmidigama2017@gmail.com" style="color:#8a682e">Contact our team</a></td></tr></table></td></tr></table></body></html>`;
}
function transporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS)
    throw new Error("SMTP credentials are not configured");
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === "465",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });
}
async function queue(key, to, subject, text, replyTo) {
  await EmailJob.updateOne(
    { key },
    { $setOnInsert: { key, to, subject, text, replyTo } },
    { upsert: true },
  );
}
async function deliverPending() {
  const jobs = await EmailJob.find({
    $or: [
      { status: { $in: ["pending", "failed"] } },
      { status: "sending", updatedAt: { $lt: new Date(Date.now() - 120000) } },
    ],
    attempts: { $lt: 5 },
  })
    .sort({ createdAt: 1 })
    .limit(10);
  await Promise.all(
    jobs.map(async (job) => {
      const claimed = await EmailJob.findOneAndUpdate(
        { _id: job._id, status: job.status, updatedAt: job.updatedAt },
        { $set: { status: "sending" }, $inc: { attempts: 1 } },
        { new: true },
      );
      if (!claimed) return;
      try {
        await transporter().sendMail({
          from: `Calm Rest <${process.env.SMTP_USER}>`,
          to: job.to,
          replyTo: job.replyTo,
          subject: job.subject,
          text: job.text,
          html: emailHtml(job.subject, job.text),
        });
        await EmailJob.updateOne(
          { _id: job._id },
          { $set: { status: "sent", sentAt: new Date(), lastError: "" } },
        );
      } catch {
        await EmailJob.updateOne(
          { _id: job._id },
          {
            $set: {
              status: "failed",
              lastError: "Delivery failed. Check SMTP configuration and retry.",
            },
          },
        );
      }
    }),
  );
}
async function bookingEmails(booking) {
  const settings = await Settings.findById("hotel").lean();
  const details = `Reference: ${booking._id}
Guest: ${booking.firstName} ${booking.lastName}
Email: ${booking.email}
Phone: ${booking.phone || "Not supplied"}
Room: ${booking.roomType}
Check-in: ${booking.checkIn}
Check-out: ${booking.checkOut}
Guests: ${booking.guests}
Total: USD ${booking.totalPrice}
Status: ${booking.status}
Requests: ${booking.specialRequest || "None"}`;
  await queue(
    `booking-owner-${booking._id}`,
    process.env.ADMIN_NOTIFICATION_EMAIL || "calmrestmidigama2017@gmail.com",
    "New booking — Calm Rest",
    details,
    booking.email,
  );
  if (settings?.emailNotifications !== false)
    await queue(
      `booking-guest-${booking._id}`,
      booking.email,
      `Booking ${booking.status === "Confirmed" ? "confirmed" : "request received"} — Calm Rest`,
      details +
        `
Our team will contact you about your stay.`,
    );
}
async function messageEmail(message) {
  await queue(
    `message-${message._id}`,
    process.env.ADMIN_NOTIFICATION_EMAIL || "calmrestmidigama2017@gmail.com",
    "New guest question — Calm Rest",
    `From: ${message.fullName}
Email: ${message.email}
Phone: ${message.phone || ""}

${message.message}`,
    message.email,
  );
}
async function bookingStatusEmail(booking) {
  const settings = await Settings.findById("hotel").lean();
  if (settings?.emailNotifications === false) return;
  await queue(
    `booking-status-${booking._id}-${booking.status}`,
    booking.email,
    `Reservation ${booking.status.toLowerCase()} — Calm Rest`,
    `Hello ${booking.firstName},\n\nYour reservation status is now ${booking.status}.\nReference: ${booking._id}\nRoom: ${booking.roomType}\nCheck-in: ${booking.checkIn}\nCheck-out: ${booking.checkOut}\nTotal stay: USD ${booking.totalPrice}\n\nFor questions or changes, contact calmrestmidigama2017@gmail.com.`,
  );
}
module.exports = {
  bookingStatusEmail,
  emailHtml,
  bookingEmails,
  messageEmail,
  deliverPending,
  queue,
};

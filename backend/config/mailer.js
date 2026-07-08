const nodemailer = require("nodemailer");

// Create the transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends a premium luxury confirmation email to the guest.
 * @param {Object} booking - The booking details document
 */
const sendBookingConfirmation = async (booking) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️ SMTP credentials not set. Booking confirmation email skipped.");
    return;
  }

  const guestName = `${booking.firstName} ${booking.lastName}`;
  const guestEmail = booking.email;
  const bookingId = booking._id ? booking._id.toString().toUpperCase() : "N/A";

  const mailOptions = {
    from: `"Calm Rest Luxury Suites" <${process.env.SMTP_USER}>`,
    to: `${guestEmail}, ${process.env.SMTP_USER}`,
    subject: `Reservation Confirmed - Calm Rest [#${bookingId.slice(-6)}]`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reservation Confirmed</title>
        <style>
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
            background-color: #070b13;
            color: #d1d5db;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper {
            width: 100%;
            background-color: #070b13;
            padding: 40px 20px;
            box-sizing: border-box;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #0f172a;
            border: 1px border #1e293b;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
          }
          .header {
            padding: 40px;
            text-align: center;
            background-image: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border-bottom: 1px solid #1e293b;
          }
          .logo-badge {
            display: inline-block;
            width: 60px;
            height: 60px;
            line-height: 60px;
            background: linear-gradient(135deg, #cca353 0%, #a77c38 100%);
            border-radius: 16px;
            color: #0f172a;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .title {
            color: #ffffff;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.025em;
            margin: 0 0 8px 0;
          }
          .subtitle {
            color: #cca353;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            margin: 0;
          }
          .content {
            padding: 40px;
          }
          .greeting {
            color: #ffffff;
            font-size: 16px;
            font-weight: 700;
            margin: 0 0 16px 0;
          }
          .lead {
            font-size: 14px;
            line-height: 1.6;
            color: #94a3b8;
            margin: 0 0 32px 0;
          }
          .details-card {
            background-color: #070b13;
            border: 1px solid #1e293b;
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 32px;
          }
          .details-title {
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin: 0 0 16px 0;
            border-bottom: 1px solid #1e293b;
            padding-bottom: 8px;
          }
          .details-grid {
            display: table;
            width: 100%;
          }
          .details-row {
            display: table-row;
          }
          .details-cell {
            display: table-cell;
            padding: 8px 0;
            font-size: 13px;
            vertical-align: top;
          }
          .details-label {
            color: #64748b;
            font-weight: 600;
            width: 40%;
          }
          .details-value {
            color: #e2e8f0;
            font-weight: 700;
            text-align: right;
          }
          .note-box {
            background-color: rgba(204, 163, 83, 0.05);
            border: 1px solid rgba(204, 163, 83, 0.2);
            border-radius: 16px;
            padding: 16px;
            font-size: 13px;
            line-height: 1.5;
            color: #cbd5e1;
            font-style: italic;
            margin-top: 16px;
          }
          .instruction-section {
            border-top: 1px solid #1e293b;
            padding-top: 24px;
            margin-top: 16px;
          }
          .instruction-title {
            color: #ffffff;
            font-size: 14px;
            font-weight: 700;
            margin: 0 0 8px 0;
          }
          .instruction-text {
            font-size: 13px;
            line-height: 1.5;
            color: #94a3b8;
            margin: 0 0 16px 0;
          }
          .footer {
            padding: 32px 40px;
            text-align: center;
            border-top: 1px solid #1e293b;
            background-color: #070b13;
          }
          .footer-text {
            font-size: 11px;
            color: #475569;
            line-height: 1.5;
            margin: 0 0 8px 0;
          }
          .footer-link {
            color: #cca353;
            text-decoration: none;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <!-- Header -->
            <div class="header">
              <div class="logo-badge">H</div>
              <h1 class="title">Reservation Confirmed</h1>
              <p class="subtitle">Calm Rest Sanctuary</p>
            </div>
            
            <!-- Content -->
            <div class="content">
              <p class="greeting">Dear ${guestName},</p>
              <p class="lead">
                Thank you for choosing Calm Rest Luxury Suites. We are delighted to confirm your upcoming reservation. Your private sanctuary is prepared and awaiting your arrival.
              </p>
              
              <!-- Details Card -->
              <div class="details-card">
                <h3 class="details-title">Stay Overview</h3>
                <div class="details-grid">
                  <div class="details-row">
                    <div class="details-cell details-label">Reservation ID</div>
                    <div class="details-cell details-value">#${bookingId}</div>
                  </div>
                  <div class="details-row">
                    <div class="details-cell details-label">Room Category</div>
                    <div class="details-cell details-value">${booking.roomType}</div>
                  </div>
                  <div class="details-row">
                    <div class="details-cell details-label">Check-in Date</div>
                    <div class="details-cell details-value">${booking.checkIn}</div>
                  </div>
                  <div class="details-row">
                    <div class="details-cell details-label">Check-out Date</div>
                    <div class="details-cell details-value">${booking.checkOut}</div>
                  </div>
                  <div class="details-row">
                    <div class="details-cell details-label">Total Guests</div>
                    <div class="details-cell details-value">${booking.guests} Guests</div>
                  </div>
                </div>
                
                ${booking.specialRequest ? `
                  <div class="note-box">
                    <strong>Special Requests:</strong> "${booking.specialRequest}"
                  </div>
                ` : ""}
              </div>
              
              <!-- Instructions -->
              <div class="instruction-section">
                <h4 class="instruction-title">Check-in & Guest Services</h4>
                <p class="instruction-text">
                  Standard check-in begins at 2:00 PM. Our 24-hour concierge will be ready to welcome you, assign your access keys, and escort you to your room.
                </p>
                <h4 class="instruction-title">Contact Concierge</h4>
                <p class="instruction-text">
                  Should you require private airport transfers, spa bookings, or custom room preparations, please contact us at <a href="mailto:concierge@calmrest.com" class="footer-link">concierge@calmrest.com</a>.
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <p class="footer-text">© 2026 Calm Rest Luxury Suites & Hotels Group.</p>
              <p class="footer-text">
                This email confirmation is secure. Review our portal at <a href="https://calmrest.com" class="footer-link">calmrest.com</a>
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email successfully transmitted to ${guestEmail}`);
  } catch (error) {
    console.error(`❌ Failed to send confirmation email to ${guestEmail}:`, error);
  }
};

module.exports = {
  sendBookingConfirmation,
};

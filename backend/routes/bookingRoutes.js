const router = require("express").Router();
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Settings = require("../models/Settings");
const auth = require("../middleware/authMiddleware"),
  admin = require("../middleware/adminMiddleware");
const v = require("../lib/validation");
const { reserve } = require("../lib/availability");
const {
  bookingEmails,
  bookingStatusEmail,
  deliverPending,
} = require("../config/mailer");
router.post(
  "/",
  auth,
  async (req, res) => {
    if(!req.account.emailVerified && !req.account.googleUid) return res.status(403).json({error:'Verify your email before booking.',code:'EMAIL_VERIFICATION_REQUIRED'});
    if(v.email(req.body.email)!==req.user.email) v.fail('Use your verified account email for this booking',403);
    const firstName = v.text(req.body.firstName, "First name", 80),
      lastName = v.text(req.body.lastName, "Last name", 80),
      email = v.email(req.body.email),
      specialRequest = v.text(
        req.body.specialRequest,
        "Special requests",
        2000,
        false,
      );
    v.dates(req.body.checkIn, req.body.checkOut);
    const key = req.headers["idempotency-key"]
      ? v.text(req.headers["idempotency-key"], "Request key", 100)
      : require("node:crypto").randomUUID();
    if (!/^[a-zA-Z0-9-]{16,100}$/.test(key)) v.fail("Invalid request key");
    const settings = await Settings.findById("hotel").lean();
    if (settings?.onlineBooking === false)
      v.fail(
        "Online bookings are temporarily closed. Please contact the hotel.",
        503,
      );
    let booking;
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const existing = await Booking.findOne({ idempotencyKey: key }).session(
          session,
        );
        if (existing) {
          if (
            existing.email !== email ||
            (existing.userId?.toString() || "") !== (req.user?.id || "")
          )
            v.fail("Request key already used", 409);
          booking = existing;
          return;
        }
        const stay = await reserve(req.body, session);
        [booking] = await Booking.create(
          [
            {
              ...stay,
              firstName,
              lastName,
              email,
              specialRequest,
              userId: req.user?.id,
              phone: v.text(req.body.phone, "Phone", 30, false),
              idempotencyKey: key,
              status: settings?.autoConfirm ? "Confirmed" : "Pending",
            },
          ],
          { session },
        );
      });
    } finally {
      await session.endSession();
    }
    await bookingEmails(booking);
    await deliverPending();
    res
      .status(201)
      .json({
        success: true,
        bookingId: booking._id,
        booking: {
          _id: booking._id,
          status: booking.status,
          totalPrice: booking.totalPrice,
        },
      });
  },
);
router.get("/mine", auth, async (req, res) => {
  const query =
    req.account.googleUid || req.account.emailVerified
      ? {
          $or: [
            { userId: req.user.id },
            { userId: { $exists: false }, email: req.user.email },
          ],
        }
      : { userId: req.user.id };
  res.json(
    await Booking.find(query)
      .select("-idempotencyKey")
      .sort({ createdAt: -1 })
      .lean(),
  );
});
router.get("/", auth, admin, async (req, res) =>
  res.json(await Booking.find().sort({ createdAt: -1 }).lean()),
);
router.put("/:id", auth, admin, async (req, res) => {
  const id = v.id(req.params.id),
    status = v.text(req.body.status, "Status", 30);
  if (
    ![
      "Pending",
      "Confirmed",
      "Checked In",
      "Checked Out",
      "Cancelled",
    ].includes(status)
  )
    v.fail("Invalid booking status");
  let booking;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      booking = await Booking.findById(id).session(session);
      if (!booking) v.fail("Booking not found", 404);
      if (
        ["Cancelled", "Checked Out"].includes(booking.status) &&
        status !== booking.status
      )
        v.fail(
          "Closed bookings cannot be reopened. Create a new reservation.",
          409,
        );
      if (
        status === "Checked In" &&
        (booking.checkIn > v.today() || booking.checkOut <= v.today())
      )
        v.fail("Check-in is outside the stay dates");
      if (!["Cancelled", "Checked Out"].includes(status))
        await reserve(booking.toObject(), session, id);
      booking.status = status;
      await booking.save({ session });
    });
  } finally {
    await session.endSession();
  }
  await bookingStatusEmail(booking);
  await deliverPending();
  res.json({ success: true, booking });
});
router.delete("/:id", auth, admin, async (req, res) => {
  const booking = await Booking.findByIdAndDelete(v.id(req.params.id));
  if (!booking) v.fail("Booking not found", 404);
  res.json({ success: true });
});
module.exports = router;

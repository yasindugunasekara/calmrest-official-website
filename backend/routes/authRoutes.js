const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const v = require("../lib/validation");
const { session, publicUser } = require("../lib/session");
const auth = require("../middleware/authMiddleware");
router.post("/login", async (req, res) => {
  const email = v.email(req.body.email);
  if (
    typeof req.body.password !== "string" ||
    Buffer.byteLength(req.body.password) > 72
  )
    v.fail("Invalid email or password", 401);
  const user = await User.findOne({ email }).select("+password");
  const valid =
    user?.password && (await bcrypt.compare(req.body.password, user.password));
  if (!valid) v.fail("Invalid email or password", 401);
  res.json(session(user));
});
router.post("/google", async (req, res) => {
  const token = v.text(req.body.idToken, "Google ID token", 10000);
  if (!process.env.FIREBASE_PROJECT_ID)
    v.fail("Google sign-in is not configured", 503);
  let identity;
  try {
    const { jwtVerify, createRemoteJWKSet } = await import("jose");
    router.googleKeys ||= createRemoteJWKSet(
      new URL(
        "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
      ),
    );
    const { payload } = await jwtVerify(token, router.googleKeys, {
      algorithms: ["RS256"],
      issuer: `https://securetoken.google.com/${process.env.FIREBASE_PROJECT_ID}`,
      audience: process.env.FIREBASE_PROJECT_ID,
    });
    if (
      !payload.sub ||
      typeof payload.sub !== "string" ||
      payload.sub.length > 128 ||
      typeof payload.auth_time !== "number" ||
      payload.auth_time > Date.now() / 1000
    )
      throw new Error("Invalid subject");
    identity = { ...payload, uid: payload.sub };
  } catch {
    v.fail("Google identity could not be verified", 401);
  }
  if (
    !identity.email_verified ||
    identity.firebase?.sign_in_provider !== "google.com"
  )
    v.fail("A verified Google account is required", 401);
  const email = v.email(identity.email);
  let user = await User.findOne({ email }).select("+password");
  if (user?.googleUid && user.googleUid !== identity.uid)
    v.fail("Google account does not match the linked account", 409);
  if (user && user.provider === "local" && !user.googleUid) {
    if (!req.body.password)
      return res
        .status(409)
        .json({
          error: "Confirm your existing password once to connect Google.",
          code: "LINK_PASSWORD_REQUIRED",
        });
    if (
      typeof req.body.password !== "string" ||
      Buffer.byteLength(req.body.password) > 72 ||
      !(await bcrypt.compare(req.body.password, user.password))
    )
      v.fail("Incorrect password. Use password recovery if needed.", 401);
    user.googleUid = identity.uid;
    await user.save();
  }
  if (user?.provider === "google" && !user.googleUid) {
    user.googleUid = identity.uid;
    await user.save();
  }
  if (!user) {
    const [firstName, ...rest] = (identity.name || "Guest").split(" ");
    user = await User.create({
      firstName,
      lastName: rest.join(" "),
      email,
      provider: "google",
      googleUid: identity.uid,
      role: "user",
    });
  }
  res.json(session(user));
});

router.post("/forgot-password", async (req, res) => {
  const email = v.email(req.body.email);
  const user = await User.findOne({ email, provider: "local" });
  if (user) {
    const { randomBytes, createHash } = require("node:crypto");
    const token = randomBytes(32).toString("hex");
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordHash: createHash("sha256").update(token).digest("hex"),
          resetPasswordExpires: new Date(Date.now() + 15 * 60000),
        },
      },
    );
    const { queue, deliverPending } = require("../config/mailer");
    const link = `${process.env.FRONTEND_URL || "https://www.calmrestmidigama.com"}/reset-password?token=${token}`;
    await queue(
      `reset-${user._id}-${token.slice(0, 12)}`,
      user.email,
      "Reset your Calm Rest password",
      `A password reset was requested for your Calm Rest account. This link expires in 15 minutes and can be used once.\n\n${link}\n\nIf you did not request this, ignore this email.`,
    );
    await deliverPending();
  }
  res.json({
    success: true,
    message:
      "If that email has a password account, a reset link will be emailed to you.",
  });
});
router.post("/reset-password", async (req, res) => {
  const token = v.text(req.body.token, "Reset token", 64);
  if (!/^[a-f0-9]{64}$/.test(token)) v.fail("Invalid or expired reset link");
  const password = await bcrypt.hash(v.password(req.body.password), 12);
  const resetPasswordHash = require("node:crypto")
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOneAndUpdate(
    {
      resetPasswordHash,
      resetPasswordExpires: { $gt: new Date() },
      provider: "local",
    },
    {
      $set: { password },
      $unset: { resetPasswordHash: 1, resetPasswordExpires: 1 },
      $inc: { tokenVersion: 1 },
    },
    { new: true },
  );
  if (!user) v.fail("Invalid or expired reset link");
  res.json({
    success: true,
    message: "Password updated. Sign in with your new password.",
  });
});
router.post("/verify-email/request", auth, async (req, res) => {
  const { randomInt, createHash } = require("node:crypto");
  const code = String(randomInt(10000000, 100000000));
  await User.updateOne(
    { _id: req.user.id },
    {
      $set: {
        emailCodeAttempts: 0,
        emailCodeHash: createHash("sha256").update(code).digest("hex"),
        emailCodeExpires: new Date(Date.now() + 10 * 60000),
      },
    },
  );
  const { queue, deliverPending } = require("../config/mailer");
  await queue(
    `verify-${req.user.id}-${Date.now()}`,
    req.user.email,
    "Verify your email — Calm Rest",
    `Your verification code is ${code}. It expires in 10 minutes. Enter it in your Calm Rest guest account to see earlier reservations made with this email. Never share this code.`,
  );
  await deliverPending();
  res.json({ success: true });
});
router.post("/verify-email/confirm", auth, async (req, res) => {
  const code = v.text(req.body.code, "Verification code", 8);
  if (!/^[0-9]{8}$/.test(code))
    v.fail("Enter the eight-digit verification code");
  const hash = require("node:crypto")
    .createHash("sha256")
    .update(code)
    .digest("hex");
  const user = await User.findOneAndUpdate(
    {
      _id: req.user.id,
      emailCodeHash: hash,
      emailCodeAttempts: { $lt: 5 },
      emailCodeExpires: { $gt: new Date() },
    },
    {
      $set: { emailVerified: true },
      $unset: { emailCodeHash: 1, emailCodeExpires: 1 },
    },
    { new: true },
  );
  if (!user) {
    await User.updateOne(
      { _id: req.user.id, emailCodeHash: { $exists: true } },
      { $inc: { emailCodeAttempts: 1 } },
    );
    v.fail(
      "Invalid or expired verification code. Request a new code after five attempts.",
    );
  }
  res.json({ user: publicUser(user) });
});
router.patch("/me", auth, async (req, res) => {
  const data = {
    firstName: v.text(req.body.firstName, "First name", 80),
    lastName: v.text(req.body.lastName, "Last name", 80),
    country: v.text(req.body.country, "Country", 100),
    phone: v.text(req.body.phone, "Phone", 30, false),
  };
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: data },
    { new: true, runValidators: true },
  );
  res.json({ user: publicUser(user) });
});
router.get("/me", auth, (req, res) =>
  res.json({ user: publicUser(req.account) }),
);
router.post("/logout", auth, async (req, res) => {
  await User.updateOne({ _id: req.user.id }, { $inc: { tokenVersion: 1 } });
  res.json({ success: true });
});
module.exports = router;

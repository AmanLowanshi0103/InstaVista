const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const Verification = require("../Schemas/VerificationOTP");
const SignJWT = "test123";
const jwt = require("jsonwebtoken");
const user = require("../Schemas/userSchemas");
const fectchUser = require("../Middle/fetchUser");

const router = express.Router();
router.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "amanlowanshi0103@gmail.com",
    pass: "wgpfnfxfkiqcscqh", // Use an app-specific password here
  },
});
transporter.verify((error, sucess) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for message");
    console.log(sucess);
  }
});

router.post("/send-otp", fectchUser, async (req, res) => {
  let success = false;
  try {
    // console.log(req.user)
    const User = await user.findOne({ _id: req.user });
    // console.log(User);

    const otp = await Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: User.Email,
      subject: "verify your Email",
      html: `<p>Enter <b>${otp}</b> in the app to verify</p>`,
    };
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp.toString(), saltRounds);
    const verifaction = new Verification({
      email: User.Email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiredAt: Date.now() + 3600000,
    });
    await verifaction.save();
    await transporter.sendMail(mailOptions);
    res.json({
      success,
      status: "PENDING",
      message: "verifiaction otp email sent",
      data: {
        email: User.Email,
      },
    });
  } catch (error) {
    res.json({ success, status: "FAILED", message: error.message });
  }
});

router.post("/verify-otp", fectchUser, async (req, res) => {
  let success = false;
  try {
    const { otp } = req.body;
    // console.log("verify :"+otp);
    // console.log(req.user)
    const User = await user.findOne({ _id: req.user });
    // console.log(User);

    let verification = await Verification.findOne({ email: User.Email });
    // console.log("fifth "+verification)
    const Otpverify = await bcrypt.compare(otp.toString(), verification.otp);
    if (!Otpverify) {
      return res.status(400).json({ success, error: "Invalid OTP" });
    }
    await verification.deleteOne();
    success = true;
    res.send({ success, Verified: "Verified successfully" });
  } catch (error) {
    return res.status(400).json({ success, error: error.message });
  }
});

router.post("/resend-otp", fectchUser, async (req, res) => {
  let success = false;
  try {
    // Deleting Otp form the database
    const User = await user.findOne({ _id: req.user });
    let verification = await Verification.findOne({ email: User.Email });
    await verification.deleteOne();

    //sending mail agin
    const otp = await Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: User.Email,
      subject: "verify your Email",
      html: `<p>Enter <b>${otp}</b> in the app to verify</p>`,
    };
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp.toString(), saltRounds);
    const verifaction = new Verification({
      email: User.Email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiredAt: Date.now() + 3600000,
    });
    await verifaction.save();
    await transporter.sendMail(mailOptions);
    res.json({
      success,
      status: "PENDING",
      message: "verifiaction otp email sent",
      data: {
        email: User.Email,
      },
    });
  } catch (error) {
    return res.status(400).json({ success, error: error.message });
  }
});

//// sending otp for the forgot password
router.post("/forgotpassword-send-otp", async (req, res) => {
    let success=false;
  const { Email } = req.body;
  try {
    const otp = await Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: Email,
      subject: "verify your Email",
      html: `<p>Enter <b>${otp}</b> in the app to verify</p>`,
    };
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp.toString(), saltRounds);
    const verifaction = new Verification({
      email: Email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiredAt: Date.now() + 3600000,
    });
    await verifaction.save();
    await transporter.sendMail(mailOptions);
    success=true;
    res.json({
      success,
      status: "PENDING",
      message: "verifiaction otp email sent",
      data: {
        email: Email,
      },
    });
  } catch (error) {
    success=false;
    return res.status(400).json({ success, error: error.message });
  }
});


router.post("/fpverify-otp", async (req, res) => {
  let success = false;
  try {
    const { Email,otp } = req.body;
    let verification = await Verification.findOne({ email: Email });
    const Otpverify = await bcrypt.compare(otp.toString(), verification.otp);
    if (!Otpverify) {
      return res.status(400).json({ success, error: "Invalid OTP" });
    }
    await verification.deleteOne();
    success = true;
    res.send({ success, Verified: "Verified successfully" });
  } catch (error) {
    return res.status(400).json({ success, error: error.message });
  }
});

router.post("/fpresend-otp", async (req, res) => {
  let success = false;
  try {
    // Deleting Otp form the database
    const {Email}=req.body;
    let verification = await Verification.findOne({ email:Email });
    await verification.deleteOne();

    //sending mail agin
    const otp = await Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: Email,
      subject: "verify your Email",
      html: `<p>Enter <b>${otp}</b> in the app to verify</p>`,
    };
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp.toString(), saltRounds);
    const verifaction = new Verification({
      email: Email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiredAt: Date.now() + 3600000,
    });
    await verifaction.save();
    await transporter.sendMail(mailOptions);
    success=true;
    res.json({
      success,
      status: "PENDING",
      message: "verifiaction otp email sent",
      data: {
        email: Email,
      },
    });
  } catch (error) {
    return res.status(400).json({ success, error: error.message });
  }
});

module.exports = router;

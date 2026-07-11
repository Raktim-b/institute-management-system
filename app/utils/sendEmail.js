const transporter = require("../config/emailVerify");
const crypto = require("crypto");
const emailVerificationModel = require("../model/verificationModel");

const sendEmail = async (user) => {
  await emailVerificationModel.deleteMany({
    userId: user._id,
  });

  const token = crypto.randomBytes(32).toString("hex");

  await new emailVerificationModel({
    userId: user._id,
    token,
  }).save();

  const verifyLink = `http://localhost:4033/auth/verify/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Verify your account",

    html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px">

      <h2>Email Verification</h2>

      <p>Hello <b>${user.name}</b>,</p>

      <p>
      Click the button below to verify your email.
      </p>

      <div style="text-align:center;margin:30px 0">

        <a href="${verifyLink}"
           style="
            background:#2563eb;
            color:white;
            padding:15px 35px;
            text-decoration:none;
            border-radius:8px;
            font-size:18px;
           ">

            Verify Email

        </a>

      </div>

      <p>
      This verification link is valid for
      <b>15 minutes</b>.
      </p>

      <p>
      If you didn't create this account,
      simply ignore this email.
      </p>

    </div>
    `,
  });

  return token;
};

module.exports = sendEmail;

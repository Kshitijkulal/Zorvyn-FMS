import nodemailer from "nodemailer"
import { env } from "../config/env.js"

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false, // true for 465, false for 587
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS
  }
})

export const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`
  })
}
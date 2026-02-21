import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ EMAIL ENV VARIABLES MISSING");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,            // 🔥 IMPORTANT
    secure: false,        // 🔥 MUST be false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // ✅ APP PASSWORD
    },

    // ⏱️ TIMEOUT FIXES (VERY IMPORTANT ON RENDER)
    connectionTimeout: 20000, // 20 sec
    greetingTimeout: 20000,
    socketTimeout: 20000,

    tls: {
      rejectUnauthorized: false, // 🔥 prevents TLS handshake fail
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Aaroh AI" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📨 Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    throw error;
  }
};

export default sendEmail;

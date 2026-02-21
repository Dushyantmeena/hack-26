import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../helpers/sendEmail.js";

// --- Helper to Generate 4-digit OTP ---
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// --- Helper for Email Template ---
const getEmailTemplate = (otp, title = "Verification Required", message = "Please enter the code below to complete your verification.") => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 1px solid #f3f4f6;">
    <div style="height: 6px; background: linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899); width: 100%;"></div>
    <div style="padding: 40px 30px; text-align: center;">
      <div style="margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #1F2933; letter-spacing: -0.5px;">
          Aaroh <span style="color: #4F46E5;">AI</span> 🎶
        </h1>
      </div>
      <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #374151;">
        ${title}
      </h2>
      <p style="margin: 0 0 24px; font-size: 15px; color: #6B7280; line-height: 1.6;">
        ${message}
      </p>
      <div style="background-color: #F8FAFC; border: 2px dashed #E2E8F0; border-radius: 12px; padding: 24px; margin: 0 auto 24px; display: inline-block;">
        <span style="display: block; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #4F46E5; font-family: monospace; line-height: 1;">
          ${otp}
        </span>
      </div>
      <p style="margin: 0; font-size: 13px; color: #94A3B8;">
        This code will expire in <strong style="color: #64748B;">10 minutes</strong>.
      </p>
    </div>
    <div style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #F3F4F6;">
      <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
        &copy; ${new Date().getFullYear()} Aaroh AI. Let's make music smarter.
      </p>
    </div>
  </div>
`;

// ✅ Register API
export const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 🔒 RESTRICT TO GMAIL ONLY
    if (!email || !email.toLowerCase().endsWith("@gmail.com")) {
      return next(handleError(400, "Only @gmail.com email addresses are allowed."));
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return next(handleError(409, "User already registered"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpires
    });

    await user.save();

    // Send OTP Email
    await sendEmail(
      email,
      "Verify your Email - Aaroh AI",
      getEmailTemplate(otp, "Verification Required", "You successfully created an account. Please verify your email to continue.")
    );

    res.status(201).json({
      success: true,
      message: "User registered! Please check your email for OTP.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Login API (Updated for 7 Days Persistence)
export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(handleError(404, "Invalid login credentials"));
    }

    // 🔒 Check Verification Status
    if (!user.isVerified) {
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await sendEmail(
        email,
        "Verify your Email - Aaroh AI",
        getEmailTemplate(otp, "Verification Required", "You tried to log in, but your email is not verified yet.")
      );

      return res.status(403).json({
        success: false,
        message: "Email not verified. OTP sent to email.",
        redirectToVerify: true
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return next(handleError(404, "Invalid login credentials"));
    }

    // 🕒 CHANGE: Set Token Expiry to 7 Days
    const token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email, avatar: user.avatar },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🕒 CHANGE: Set Cookie MaxAge to 7 Days
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,          // MUST on HTTPS
      sameSite: "None",      // 🔥 MOST IMPORTANT
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });


    res.status(200).json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar },
      message: "Login successful",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Verify Email API
export const VerifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(handleError(404, "User not found"));

    if (user.isVerified) {
      return res.status(200).json({ success: true, message: "Email already verified" });
    }

    if (user.otp !== code || user.otpExpires < Date.now()) {
      return next(handleError(400, "Invalid or expired OTP"));
    }

    // Verify User
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now login.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Resend OTP API
export const ResendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(handleError(404, "User not found"));
    }

    if (user.isVerified) {
      return next(handleError(400, "Email is already verified. Please login."));
    }

    // Generate New OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    // Send Email
    await sendEmail(
      email,
      "New OTP Request - Aaroh AI",
      getEmailTemplate(otp, "New Verification Code", "You requested a new OTP code.")
    );

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email.",
    });

  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Google Login (Updated for 7 Days Persistence)
export const GoogleLogin = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    // 🔒 RESTRICT TO GMAIL
    if (!email || !email.toLowerCase().endsWith("@gmail.com")) {
      return next(handleError(400, "Only @gmail.com email addresses are allowed."));
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(randomPassword, 10);
      const newUser = new User({
        name, email, password: hashedPassword, avatar,
        isVerified: true
      });
      user = await newUser.save();
    }

    // 🕒 CHANGE: Set Token Expiry to 7 Days
    const token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email, avatar: user.avatar },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🕒 CHANGE: Set Cookie MaxAge to 7 Days
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,          // MUST on HTTPS
      sameSite: "None",      // 🔥 MOST IMPORTANT
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });


    res.status(200).json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar },
      message: "Login successful",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Check Auth (NEW: Restore session on page refresh)
export const CheckAuth = async (req, res, next) => {
  try {
    // req.user is populated by your verifyToken middleware
    const user = await User.findById(req.user._id).select("-password -otp -otpExpires");

    if (!user) {
      return next(handleError(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Logout API
export const Logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
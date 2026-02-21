import express from 'express'
import { Login, Register, GoogleLogin, Logout, VerifyEmail, ResendOtp, CheckAuth } from '../controllers/Auth.controller.js'
import { verifyToken } from '../utils/verifyToken.js' // ✅ Import Middleware

const AuthRoute = express.Router()

AuthRoute.post('/register', Register)
AuthRoute.post('/verify-email', VerifyEmail)
AuthRoute.post('/resend-otp', ResendOtp)
AuthRoute.post('/login', Login)
AuthRoute.post('/googlelogin', GoogleLogin)
AuthRoute.post('/logout', Logout)

// ✅ NEW ROUTE: Check Auth (Restores session on refresh)
AuthRoute.get('/check-auth', verifyToken, CheckAuth)

export default AuthRoute
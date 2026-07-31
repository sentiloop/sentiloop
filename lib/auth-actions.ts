"use server";

import { hash } from "bcryptjs";
import {
  findUserByEmail,
  findUserByResetToken,
  findUserByVerifyToken,
  createUser,
  updateUser,
  generateId,
} from "@/lib/db";

// ─── Types ──────────────────────────────────────────────────────────

interface ActionResult {
  success: boolean;
  message: string;
  requiresTwoFactor?: boolean;
}

// ─── Register ───────────────────────────────────────────────────────

export async function register(formData: {
  name: string;
  email: string;
  password: string;
}): Promise<ActionResult> {
  const { name, email, password } = formData;

  if (!name || !email || !password) {
    return { success: false, message: "All fields are required." };
  }
  if (password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters." };
  }

  const existing = findUserByEmail(email);
  if (existing) {
    return { success: false, message: "An account with this email already exists." };
  }

  const passwordHash = await hash(password, 12);
  const verifyToken = `verify_${generateId()}_${Date.now().toString(36)}`;

  createUser({
    email: email.toLowerCase(),
    passwordHash,
    name,
    emailVerified: false,
    twoFactorEnabled: false,
    twoFactorSecret: null,
    otpCode: null,
    otpExpiry: null,
    resetToken: null,
    resetExpiry: null,
    verifyToken,
    provider: "credentials",
  });

  // ⚠️ DEMO: In production, send a real verification email here.
  console.log(`[DEMO] Verification token for ${email}: ${verifyToken}`);

  return { success: true, message: "Account created. Check your email to verify (demo: auto-verified)." };
}

// ─── Forgot Password ────────────────────────────────────────────────

export async function forgotPassword(email: string): Promise<ActionResult> {
  if (!email) {
    return { success: false, message: "Email is required." };
  }

  const user = findUserByEmail(email);
  if (!user) {
    // Don't reveal if user exists
    return { success: true, message: "If an account exists, a reset link has been sent." };
  }

  const resetToken = `reset_${generateId()}_${Date.now().toString(36)}`;
  const resetExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

  updateUser(user.id, { resetToken, resetExpiry });

  // ⚠️ DEMO: In production, send a real reset email here.
  console.log(`[DEMO] Reset token for ${email}: ${resetToken}`);

  return { success: true, message: "If an account exists, a reset link has been sent." };
}

// ─── Verify Email ───────────────────────────────────────────────────

export async function verifyEmail(token: string): Promise<ActionResult> {
  if (!token) {
    return { success: false, message: "Invalid verification token." };
  }

  const user = findUserByVerifyToken(token);
  if (!user) {
    return { success: false, message: "Invalid or expired verification token." };
  }

  updateUser(user.id, { emailVerified: true, verifyToken: null });

  return { success: true, message: "Email verified successfully. You can now sign in." };
}

// ─── Send OTP ───────────────────────────────────────────────────────

export async function sendOtp(email: string): Promise<ActionResult> {
  if (!email) {
    return { success: false, message: "Email is required." };
  }

  const user = findUserByEmail(email);
  if (!user) {
    // Don't reveal if user exists
    return { success: true, message: "If an account exists, an OTP has been sent." };
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  updateUser(user.id, { otpCode, otpExpiry });

  // ⚠️ DEMO: In production, send a real OTP email/SMS here.
  console.log(`[DEMO] OTP for ${email}: ${otpCode}`);

  return { success: true, message: "If an account exists, an OTP has been sent." };
}

// ─── Verify OTP ─────────────────────────────────────────────────────

export async function verifyOtp(email: string, code: string): Promise<ActionResult> {
  if (!email || !code) {
    return { success: false, message: "Email and OTP code are required." };
  }

  const user = findUserByEmail(email);
  if (!user || !user.otpCode || !user.otpExpiry) {
    return { success: false, message: "Invalid OTP." };
  }

  if (Date.now() > user.otpExpiry) {
    updateUser(user.id, { otpCode: null, otpExpiry: null });
    return { success: false, message: "OTP has expired. Request a new one." };
  }

  if (user.otpCode !== code) {
    return { success: false, message: "Invalid OTP code." };
  }

  updateUser(user.id, { otpCode: null, otpExpiry: null });

  return { success: true, message: "OTP verified successfully." };
}

// ─── Enable 2FA ─────────────────────────────────────────────────────

export async function enableTwoFactor(userId: string): Promise<ActionResult> {
  if (!userId) {
    return { success: false, message: "User ID is required." };
  }

  // ⚠️ DEMO: In production, generate a real TOTP secret and QR code.
  const twoFactorSecret = `2fa_secret_${generateId()}`;

  updateUser(userId, { twoFactorEnabled: true, twoFactorSecret });

  console.log(`[DEMO] 2FA secret for user ${userId}: ${twoFactorSecret}`);

  return { success: true, message: "Two-factor authentication enabled." };
}

// ─── Verify 2FA ─────────────────────────────────────────────────────

export async function verifyTwoFactor(userId: string, code: string): Promise<ActionResult> {
  if (!userId || !code) {
    return { success: false, message: "User ID and code are required." };
  }

  // ⚠️ DEMO: In production, verify against the real TOTP algorithm.
  // For demo purposes, accept "123456" or any 6-digit code.
  if (code.length !== 6 || !/^\d{6}$/.test(code)) {
    return { success: false, message: "Invalid 2FA code. Must be 6 digits." };
  }

  return { success: true, message: "Two-factor authentication verified." };
}

// ─── Reset Password (using token) ──────────────────────────────────

export async function resetPassword(token: string, newPassword: string): Promise<ActionResult> {
  if (!token || !newPassword) {
    return { success: false, message: "Token and new password are required." };
  }

  if (newPassword.length < 8) {
    return { success: false, message: "Password must be at least 8 characters." };
  }

  const user = findUserByResetToken(token);
  if (!user) {
    return { success: false, message: "Invalid or expired reset token." };
  }

  const passwordHash = await hash(newPassword, 12);
  updateUser(user.id, { passwordHash, resetToken: null, resetExpiry: null });

  return { success: true, message: "Password reset successfully. You can now sign in." };
}

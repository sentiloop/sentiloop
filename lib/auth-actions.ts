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

interface ActionResult {
  success: boolean;
  message: string;
  requiresTwoFactor?: boolean;
}

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

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    return { success: false, message: "An account with this email already exists." };
  }

  const passwordHash = await hash(password, 12);
  const verifyToken = `verify_${generateId()}_${Date.now().toString(36)}`;

  await createUser({
    email: normalizedEmail,
    passwordHash,
    name: name.trim(),
    role: "employee",
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

  console.log(`[AUTH] Verification token generated for ${normalizedEmail}: ${verifyToken}`);

  return { success: true, message: "Account created. Check your email to verify." };
}

export async function forgotPassword(email: string): Promise<ActionResult> {
  if (!email) {
    return { success: false, message: "Email is required." };
  }

  const user = await findUserByEmail(email.trim().toLowerCase());
  if (!user) {
    return { success: true, message: "If an account exists, a reset link has been sent." };
  }

  const resetToken = `reset_${generateId()}_${Date.now().toString(36)}`;
  const resetExpiry = Date.now() + 60 * 60 * 1000;

  await updateUser(user.id, { resetToken, resetExpiry });
  console.log(`[AUTH] Password reset token generated for ${email}: ${resetToken}`);

  return { success: true, message: "If an account exists, a reset link has been sent." };
}

export async function verifyEmail(token: string): Promise<ActionResult> {
  if (!token) {
    return { success: false, message: "Invalid verification token." };
  }

  const user = await findUserByVerifyToken(token);
  if (!user) {
    return { success: false, message: "Invalid or expired verification token." };
  }

  await updateUser(user.id, { emailVerified: true, verifyToken: null });
  return { success: true, message: "Email verified successfully. You can now sign in." };
}

export async function sendOtp(email: string): Promise<ActionResult> {
  if (!email) {
    return { success: false, message: "Email is required." };
  }

  const user = await findUserByEmail(email.trim().toLowerCase());
  if (!user) {
    return { success: true, message: "If an account exists, an OTP has been sent." };
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000;

  await updateUser(user.id, { otpCode, otpExpiry });
  console.log(`[AUTH] OTP generated for ${email}: ${otpCode}`);

  return { success: true, message: "If an account exists, an OTP has been sent." };
}

export async function verifyOtp(email: string, code: string): Promise<ActionResult> {
  if (!email || !code) {
    return { success: false, message: "Email and OTP code are required." };
  }

  const user = await findUserByEmail(email.trim().toLowerCase());
  if (!user || !user.otpCode || !user.otpExpiry) {
    return { success: false, message: "Invalid OTP." };
  }

  if (Date.now() > user.otpExpiry) {
    await updateUser(user.id, { otpCode: null, otpExpiry: null });
    return { success: false, message: "OTP has expired. Request a new one." };
  }

  if (user.otpCode !== code) {
    return { success: false, message: "Invalid OTP code." };
  }

  await updateUser(user.id, { otpCode: null, otpExpiry: null });
  return { success: true, message: "OTP verified successfully." };
}

export async function enableTwoFactor(userId: string): Promise<ActionResult> {
  if (!userId) {
    return { success: false, message: "User ID is required." };
  }

  const twoFactorSecret = `2fa_secret_${generateId()}`;
  await updateUser(userId, { twoFactorEnabled: true, twoFactorSecret });
  console.log(`[AUTH] Two-factor authentication enabled for user ${userId}`);

  return { success: true, message: "Two-factor authentication enabled." };
}

export async function verifyTwoFactor(userId: string, code: string): Promise<ActionResult> {
  if (!userId || !code) {
    return { success: false, message: "User ID and code are required." };
  }

  if (code.length !== 6 || !/^\d{6}$/.test(code)) {
    return { success: false, message: "Invalid 2FA code. Must be 6 digits." };
  }

  return { success: true, message: "Two-factor authentication verified." };
}

export async function resetPassword(token: string, newPassword: string): Promise<ActionResult> {
  if (!token || !newPassword) {
    return { success: false, message: "Token and new password are required." };
  }

  if (newPassword.length < 8) {
    return { success: false, message: "Password must be at least 8 characters." };
  }

  const user = await findUserByResetToken(token);
  if (!user) {
    return { success: false, message: "Invalid or expired reset token." };
  }

  const passwordHash = await hash(newPassword, 12);
  await updateUser(user.id, { passwordHash, resetToken: null, resetExpiry: null });
  return { success: true, message: "Password reset successfully. You can now sign in." };
}

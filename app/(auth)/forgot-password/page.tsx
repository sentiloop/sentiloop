"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, KeyRound } from "lucide-react";
import { FormEvent, useState } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { forgotPassword } from "@/lib/auth-actions";
import styles from "@/components/login/login-experience.module.css";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const reducedMotion = useReducedMotion() ?? false;
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emailPattern.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await forgotPassword(email.trim().toLowerCase());

    setLoading(false);
    if (result.success) {
      setSent(true);
    } else {
      setError(result.message);
    }
  };

  const disabled = loading || sent;

  return (
    <AuthPanel
      icon={sent ? <Check size={21} /> : <KeyRound size={20} />}
      eyebrow="Password recovery"
      title={sent ? "Check your email" : "Reset your password"}
      description={sent
        ? "If an account exists with that email, a reset link has been sent. (Demo: check server console.)"
        : "Enter your email and we'll send a password reset link."}
      footer={
        <>
          <span><KeyRound size={11} /> Demo reset flow</span>
          <span>Simulated · no email sent</span>
        </>
      }
    >
      {!sent ? (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {error && <p className={styles.error} role="alert">{error}</p>}

          <div className={styles.fieldGroup}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "email-error" : undefined}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="you@company.com"
            />
          </div>

          <motion.button
            type="submit"
            disabled={disabled}
            className={styles.submitButton}
            whileTap={reducedMotion || disabled ? undefined : { scale: 0.985 }}
          >
            <span className={styles.buttonEnergy} aria-hidden="true" />
            <span className={styles.buttonLabel}>
              {loading ? <><span className={styles.spinner} />Sending</> : <>Send reset link<ArrowRight size={16} /></>}
            </span>
          </motion.button>
        </form>
      ) : (
        <div className="mt-5 text-center text-[0.7rem] text-[#8fa1b5]">
          <p>Didn&apos;t receive the email? Check your spam folder or try again.</p>
        </div>
      )}

      <div className="mt-4 text-center text-[0.65rem] text-[#6f8298]">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-[#72cdea] hover:text-[#b4eaff] transition-colors">
          <ArrowLeft size={12} /> Back to sign in
        </Link>
      </div>
    </AuthPanel>
  );
}

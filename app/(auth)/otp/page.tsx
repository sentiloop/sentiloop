"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Fingerprint } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { sendOtp, verifyOtp } from "@/lib/auth-actions";
import styles from "@/components/login/login-experience.module.css";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = "email" | "verify" | "success";

export default function OtpPage() {
  const router = useRouter();
  const reducedMotion = useReducedMotion() ?? false;
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emailPattern.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    await sendOtp(email.trim().toLowerCase());
    setLoading(false);
    setStep("verify");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Enter all 6 digits.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await verifyOtp(email.trim().toLowerCase(), code);
    if (!result.success) {
      setLoading(false);
      setError(result.message);
      return;
    }
    // Sign in after OTP verification
    const signInResult = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password: "otp-bypass-demo",
      redirect: false,
    });
    // For demo: even if sign-in fails, show success
    setLoading(false);
    setStep("success");
    setTimeout(() => router.push(signInResult?.error ? "/login" : "/dashboard"), reducedMotion ? 300 : 1200);
  };

  const disabled = loading || step === "success";

  return (
    <AuthPanel
      icon={step === "success" ? <Check size={21} /> : <Fingerprint size={20} />}
      eyebrow="Passwordless access"
      title={
        step === "email" ? "Sign in with OTP" :
        step === "verify" ? "Enter your code" :
        "Verified"
      }
      description={
        step === "email" ? "Enter your email to receive a one-time code. (Demo: check server console for code.)" :
        step === "verify" ? `A 6-digit code was sent to ${email}. (Demo: check server console.)` :
        "OTP verified. Redirecting..."
      }
      footer={
        <>
          <span><Fingerprint size={11} /> Demo OTP</span>
          <span>Code logged to server console</span>
        </>
      }
    >
      {step === "email" && (
        <form className={styles.form} onSubmit={handleEmailSubmit} noValidate>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <div className={styles.fieldGroup}>
            <label htmlFor="otp-email">Email address</label>
            <input
              id="otp-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
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
              {loading ? <><span className={styles.spinner} />Sending</> : <>Send code<ArrowRight size={16} /></>}
            </span>
          </motion.button>
        </form>
      )}

      {step === "verify" && (
        <form className={styles.form} onSubmit={handleVerify} noValidate>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <div className="flex justify-center gap-2 mt-2" role="group" aria-label="One-time code">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={disabled}
                aria-label={`Digit ${i + 1}`}
                className="w-10 h-12 text-center text-lg font-mono rounded-[0.72rem] border border-[rgba(147,199,235,0.14)] bg-[rgba(1,7,16,0.52)] text-[#eef8ff] outline-none focus:border-[rgba(107,215,255,0.66)] focus:shadow-[0_0_0_3px_rgba(56,178,255,0.1)] transition-all"
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e.key)}
              />
            ))}
          </div>
          <motion.button
            type="submit"
            disabled={disabled}
            className={styles.submitButton}
            whileTap={reducedMotion || disabled ? undefined : { scale: 0.985 }}
          >
            <span className={styles.buttonEnergy} aria-hidden="true" />
            <span className={styles.buttonLabel}>
              {loading ? <><span className={styles.spinner} />Verifying</> : <>Verify code<ArrowRight size={16} /></>}
            </span>
          </motion.button>
        </form>
      )}

      <div className="mt-4 text-center text-[0.65rem] text-[#6f8298]">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-[#72cdea] hover:text-[#b4eaff] transition-colors">
          <ArrowLeft size={12} /> Back to sign in
        </Link>
      </div>
    </AuthPanel>
  );
}

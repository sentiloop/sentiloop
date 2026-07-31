"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { verifyTwoFactor } from "@/lib/auth-actions";
import styles from "@/components/login/login-experience.module.css";

export default function TwoFactorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? "";
  const reducedMotion = useReducedMotion() ?? false;
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Enter all 6 digits.");
      return;
    }
    setLoading(true);
    setError("");

    const result = await verifyTwoFactor(userId, fullCode);
    if (!result.success) {
      setLoading(false);
      setError(result.message);
      return;
    }

    setLoading(false);
    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), reducedMotion ? 300 : 1200);
  };

  const disabled = loading || success;

  return (
    <AuthPanel
      icon={success ? <Check size={21} /> : <ShieldCheck size={20} />}
      eyebrow="Two-factor authentication"
      title={success ? "Verified" : "Enter 2FA code"}
      description={success
        ? "Two-factor verified. Opening workspace."
        : "Enter the 6-digit code from your authenticator app. (Demo: any 6-digit code works.)"}
      footer={
        <>
          <span><ShieldCheck size={11} /> Demo 2FA</span>
          <span>Any 6-digit code accepted</span>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className="flex justify-center gap-2 mt-2" role="group" aria-label="Two-factor code">
          {code.map((digit, i) => (
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
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e.key)}
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
            {loading ? <><span className={styles.spinner} />Verifying</> : success ? <>Verified<Check size={16} /></> : <>Verify<ArrowRight size={16} /></>}
          </span>
        </motion.button>
      </form>

      <div className="mt-4 text-center text-[0.65rem] text-[#6f8298]">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-[#72cdea] hover:text-[#b4eaff] transition-colors">
          <ArrowLeft size={12} /> Back to sign in
        </Link>
      </div>
    </AuthPanel>
  );
}

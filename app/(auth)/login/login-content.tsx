"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, Radio } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import type { LoginPhase, LoginSceneProps } from "@/components/three/login-scene";
import styles from "@/components/login/login-experience.module.css";

const LoginScene = dynamic<LoginSceneProps>(() => import("@/components/three/login-scene"), {
  ssr: false,
  loading: () => (
    <div className={styles.sceneFallback} aria-hidden="true">
      <span className={styles.fallbackHalo} />
      <span className={styles.fallbackCore} />
      <span className={styles.fallbackRing} />
    </div>
  ),
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = { email?: string; password?: string; general?: string };

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const reducedMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<LoginPhase>("intro");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [announcement, setAnnouncement] = useState("Initializing workspace portal.");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const schedule = (callback: () => void, delay: number) => {
    const timer = setTimeout(callback, delay);
    timers.current.push(timer);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("ready");
      setAnnouncement("Workspace portal ready. Enter your credentials.");
    }, reducedMotion ? 80 : 1250);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const validate = () => {
    const nextErrors: Errors = {};
    if (!emailPattern.test(email.trim())) nextErrors.email = "Enter a valid email address.";
    if (password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (phase !== "ready" || !validate()) {
      setAnnouncement("Check the highlighted fields and try again.");
      return;
    }

    setPhase("authenticating");
    setAnnouncement("Verifying credentials.");

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setPhase("ready");
      setErrors({ general: "Invalid email or password. Register first if you don't have an account." });
      setAnnouncement("Authentication failed. Please try again.");
      return;
    }

    setPhase("success");
    setAnnouncement("Authenticated. Opening workspace.");
    schedule(() => router.push(callbackUrl), reducedMotion ? 420 : 1400);
  };

  const disabled = phase === "authenticating" || phase === "success" || phase === "intro";

  return (
    <>
      <div className={styles.scene} aria-hidden="true">
        <LoginScene phase={phase} />
      </div>
      <AnimatePresence mode="wait">
        {phase === "intro" ? (
          <motion.div key="intro" className={styles.introCopy} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }}>
            <span className={styles.introMark}><Radio size={17} /></span>
            <p>Calibrating signal space</p>
          </motion.div>
        ) : (
          <AuthPanel
            key="login-panel"
            icon={phase === "success" ? <Check size={21} /> : <LockKeyhole size={20} />}
            eyebrow="Sentiloop intelligence layer"
            title={phase === "success" ? "Portal aligned" : "Sign in to your workspace"}
            description={phase === "success"
              ? "Authenticated. Opening your dashboard."
              : "Enter your credentials or use a provider below."}
            footer={
              <>
                <span><LockKeyhole size={11} /> Demo auth system</span>
                <span>In-memory · data resets on restart</span>
              </>
            }
          >
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {errors.general && (
                <p className={styles.error} role="alert">{errors.general}</p>
              )}
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
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((c) => ({ ...c, email: undefined }));
                  }}
                  placeholder="you@company.com"
                />
                {errors.email && <p id="email-error" className={styles.error}>{errors.email}</p>}
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="password">Password</label>
                  <Link href="/forgot-password" className={styles.textButton}>
                    Forgot password?
                  </Link>
                </div>
                <div className={styles.passwordField}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    disabled={disabled}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((c) => ({ ...c, password: undefined }));
                    }}
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    className={styles.visibilityButton}
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={disabled}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <p id="password-error" className={styles.error}>{errors.password}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={disabled}
                className={styles.submitButton}
                whileTap={reducedMotion || disabled ? undefined : { scale: 0.985 }}
              >
                <span className={styles.buttonEnergy} aria-hidden="true" />
                <span className={styles.buttonLabel}>
                  {phase === "authenticating" ? <><span className={styles.spinner} />Signing in</> : phase === "success" ? <>Opening workspace<Check size={16} /></> : <>Sign in<ArrowRight size={16} /></>}
                </span>
              </motion.button>
            </form>

            <OAuthButtons disabled={disabled} callbackUrl={callbackUrl} />

            <div className="mt-4 flex flex-col gap-2 text-center text-[0.65rem] text-[#6f8298]">
              <p>
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-[#72cdea] hover:text-[#b4eaff] transition-colors">
                  Create one
                </Link>
              </p>
              <p>
                <Link href="/otp" className="text-[#72cdea] hover:text-[#b4eaff] transition-colors">
                  Sign in with OTP instead
                </Link>
              </p>
            </div>
          </AuthPanel>
        )}
      </AnimatePresence>
      <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
    </>
  );
}

"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LockKeyhole, Radio } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/logo";
import type { LoginPhase, LoginSceneProps } from "@/components/three/login-scene";
import styles from "./login-experience.module.css";

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
const ease = [0.16, 1, 0.3, 1] as const;

type Errors = { email?: string; password?: string };

export function LoginExperience() {
  const router = useRouter();
  const reducedMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<LoginPhase>("intro");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [announcement, setAnnouncement] = useState("Initializing workspace preview.");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const schedule = (callback: () => void, delay: number) => {
    const timer = setTimeout(callback, delay);
    timers.current.push(timer);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("ready");
      setAnnouncement("Workspace preview ready. Enter your demo credentials.");
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (phase !== "ready" || !validate()) {
      setAnnouncement("Check the highlighted fields and try again.");
      return;
    }

    setPhase("authenticating");
    setAnnouncement("Simulating secure workspace verification.");
    schedule(() => {
      setPhase("success");
      setAnnouncement("Preview verified. Opening the dashboard demo.");
    }, reducedMotion ? 180 : 1250);
    schedule(() => router.push("/dashboard"), reducedMotion ? 420 : 2450);
  };

  const disabled = phase === "authenticating" || phase === "success" || phase === "intro";

  return (
    <main className={styles.experience} data-phase={phase}>
      <div className={styles.aurora} aria-hidden="true" />
      <div className={styles.scene} aria-hidden="true"><LoginScene phase={phase} /></div>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.scanner} aria-hidden="true" />

      <header className={styles.header}>
        <Logo href="/" />
        <div className={styles.systemState}>
          <span className={styles.liveDot} />
          <span>Preview environment</span>
          <span className={styles.systemDivider} />
          <span>Encrypted UI shell</span>
        </div>
      </header>

      <div className={styles.hudLeft} aria-hidden="true"><span>SL / ACCESS NODE</span><span>41.9028° N</span></div>
      <div className={styles.hudRight} aria-hidden="true"><span>PORTAL 01</span><span>{phase.toUpperCase()}</span></div>

      <section className={styles.content} aria-labelledby="login-title">
        <AnimatePresence mode="wait">
          {phase === "intro" ? (
            <motion.div key="intro" className={styles.introCopy} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }}>
              <span className={styles.introMark}><Radio size={17} /></span>
              <p>Calibrating signal space</p>
            </motion.div>
          ) : (
            <motion.div
              key="panel"
              className={styles.panelWrap}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.92, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.08, filter: "blur(12px)" }}
              transition={{ duration: reducedMotion ? 0.1 : 0.85, ease }}
            >
              <div className={styles.panelGlow} aria-hidden="true" />
              <div className={styles.panel}>
                <div className={styles.panelChrome} aria-hidden="true"><span /><span>SL-01 / SECURE GATE</span><span /></div>
                <div className={styles.panelBody}>
                  <motion.div animate={phase === "success" ? { scale: [1, 1.08, 1] } : {}} className={styles.iconWell}>
                    {phase === "success" ? <Check size={21} /> : <LockKeyhole size={20} />}
                  </motion.div>
                  <p className={styles.eyebrow}>Sentiloop intelligence layer</p>
                  <h1 id="login-title">{phase === "success" ? "Portal aligned" : "Enter your workspace"}</h1>
                  <p className={styles.description}>
                    {phase === "success"
                      ? "Opening the dashboard preview. No real session has been created."
                      : "Use any valid email and an 8+ character password to explore this secure UI demo shell."}
                  </p>

                  <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <div className={styles.fieldGroup}>
                      <label htmlFor="email">Work email</label>
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
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (errors.email) setErrors((current) => ({ ...current, email: undefined }));
                        }}
                        placeholder="you@company.com"
                      />
                      {errors.email ? <p id="email-error" className={styles.error}>{errors.email}</p> : null}
                    </div>

                    <div className={styles.fieldGroup}>
                      <div className={styles.labelRow}>
                        <label htmlFor="password">Password</label>
                        <button
                          type="button"
                          className={styles.textButton}
                          disabled={disabled}
                          onClick={() => setAnnouncement("Password recovery is not connected in this demo shell.")}
                        >Forgot password?</button>
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
                          aria-describedby={errors.password ? "password-error" : "password-hint"}
                          onChange={(event) => {
                            setPassword(event.target.value);
                            if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
                          }}
                          placeholder="Minimum 8 characters"
                        />
                        <button
                          type="button"
                          className={styles.visibilityButton}
                          onClick={() => setShowPassword((visible) => !visible)}
                          disabled={disabled}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                      </div>
                      {errors.password ? <p id="password-error" className={styles.error}>{errors.password}</p> : <p id="password-hint" className={styles.hint}>Demo validation only — credentials are not sent or stored.</p>}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={disabled}
                      className={styles.submitButton}
                      whileTap={reducedMotion || disabled ? undefined : { scale: 0.985 }}
                    >
                      <span className={styles.buttonEnergy} aria-hidden="true" />
                      <span className={styles.buttonLabel}>
                        {phase === "authenticating" ? <><span className={styles.spinner} />Verifying demo</> : phase === "success" ? <>Opening workspace<Check size={16} /></> : <>Enter workspace<ArrowRight size={16} /></>}
                      </span>
                    </motion.button>
                  </form>

                  <div className={styles.trustRow}>
                    <span><LockKeyhole size={11} /> Interface simulation</span>
                    <span>Auth backend not connected</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className={styles.footer}>
        <Link href="/" className={styles.homeLink}><ArrowLeft size={14} /> Return home</Link>
        <p>Demo shell · No account or session is created</p>
      </footer>
      <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
    </main>
  );
}

"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Radio,
  GitBranch,
  ShieldCheck,
} from "lucide-react";
import type { LoginPhase, LoginSceneProps } from "@/components/three/login-scene";
import styles from "@/components/login/login-experience.module.css";

/* ─── Dynamic Three.js Scene ─── */
const LoginScene = dynamic<LoginSceneProps>(
  () => import("@/components/three/login-scene"),
  {
    ssr: false,
    loading: () => (
      <div className={styles.sceneFallback} aria-hidden="true">
        <span className={styles.fallbackHalo} />
        <span className={styles.fallbackCore} />
        <span className={styles.fallbackRing} />
      </div>
    ),
  }
);

/* ─── Constants ─── */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = { email?: string; password?: string; general?: string };

/* ─── Reduced Motion Hook ─── */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/* ─── Google Icon ─── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* ─── Microsoft Icon ─── */
function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

/* ─── Main Component ─── */
export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const reducedMotion = useReducedMotion();

  /* State Machine */
  const [phase, setPhase] = useState<LoginPhase>("intro");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [announcement, setAnnouncement] = useState("Initializing workspace portal.");

  /* Refs */
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const gsapCtxRef = useRef<gsap.Context | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const magneticTarget = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  const schedule = useCallback((cb: () => void, delay: number) => {
    const t = setTimeout(cb, delay);
    timers.current.push(t);
  }, []);

  /* ─── Intro → Ready Phase Transition ─── */
  useEffect(() => {
    const delay = reducedMotion ? 80 : 1250;
    const t = setTimeout(() => {
      setPhase("ready");
      setAnnouncement("Workspace portal ready. Enter your credentials.");
    }, delay);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  /* ─── Cinematic GSAP Intro Timeline ─── */
  useEffect(() => {
    if (phase !== "ready" || reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Logo / header fades in
      tl.fromTo(
        `.${styles.header}`,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6 },
        0
      );

      // 2. Panel scales in
      tl.fromTo(
        `.${styles.panel}`,
        { opacity: 0, scale: 0.85, filter: "blur(20px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1 },
        0.2
      );

      // 3. Chrome bar reveals
      tl.fromTo(
        `.${styles.panelChrome}`,
        { clipPath: "inset(0 50% 0 50%)" },
        { clipPath: "inset(0 0% 0 0%)", duration: 0.4 },
        0.8
      );

      // 4. Title mask reveal
      tl.fromTo(
        `.${styles.panel} h1`,
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.7 },
        1.0
      );

      // 5. Description fades in
      tl.fromTo(
        `.${styles.description}`,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5 },
        1.4
      );

      // 6. Form fields stagger in
      tl.fromTo(
        `.${styles.fieldGroup}`,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.12 },
        1.7
      );

      // 7. Submit button enters
      tl.fromTo(
        `.${styles.submitButton}`,
        { opacity: 0, y: 16, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5 },
        2.2
      );

      // 8. OAuth section fades in
      tl.fromTo(
        `.${styles.oauthSection}`,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        2.5
      );

      // 9. Footer links appear
      tl.fromTo(
        `.${styles.linkRow}`,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3 },
        2.7
      );
    }, containerRef);

    gsapCtxRef.current = ctx;

    return () => ctx.revert();
  }, [phase, reducedMotion]);

  /* ─── Success Sequence ─── */
  useEffect(() => {
    if (phase !== "success") return;

    if (reducedMotion) {
      schedule(() => router.push(callbackUrl), 420);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Form elements fade out
      tl.to(`.${styles.fieldGroup}, .${styles.submitButton}, .${styles.oauthSection}`, {
        opacity: 0,
        y: -20,
        stagger: 0.08,
        duration: 0.3,
        ease: "power2.in",
      });

      // Panel border glows
      tl.to(`.${styles.panel}`, {
        boxShadow:
          "inset 0 1px rgba(255,255,255,.2), 0 0 80px rgba(98,217,255,0.4), 0 0 120px rgba(141,120,255,0.2)",
        duration: 0.4,
      });

      // Panel scales and fades
      tl.to(`.${styles.panel}`, {
        scale: 1.04,
        duration: 0.3,
      });
      tl.to(`.${styles.panel}`, {
        opacity: 0,
        scale: 1.2,
        filter: "blur(20px)",
        duration: 0.8,
        ease: "power2.in",
      });
    }, containerRef);

    schedule(() => router.push(callbackUrl), 1400);

    return () => ctx.revert();
  }, [phase, reducedMotion, callbackUrl, router, schedule]);

  /* ─── Magnetic Button + Custom Cursor ─── */
  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    let isOverButton = false;
    let isOverInput = false;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Magnetic button behavior
      const btn = submitBtnRef.current;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 80) {
          const strength = (80 - dist) / 80;
          magneticTarget.current = {
            x: dx * strength * 0.1,
            y: dy * strength * 0.1,
          };
          isOverButton = true;
        } else {
          magneticTarget.current = { x: 0, y: 0 };
          isOverButton = false;
        }
      }

      // Cursor morphing
      const target = e.target as HTMLElement;
      isOverInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      const isBtn = target.closest("button") !== null || target.closest("a") !== null;

      if (cursorRef.current && cursorRingRef.current) {
        if (isOverInput) {
          cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(0.5)`;
          cursorRingRef.current.style.opacity = "1";
          cursorRingRef.current.style.width = "24px";
          cursorRingRef.current.style.height = "24px";
        } else if (isBtn || isOverButton) {
          cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(1.5)`;
          cursorRingRef.current.style.opacity = "1";
          cursorRingRef.current.style.width = "36px";
          cursorRingRef.current.style.height = "36px";
        } else {
          cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(1)`;
          cursorRingRef.current.style.opacity = "0";
          cursorRingRef.current.style.width = "6px";
          cursorRingRef.current.style.height = "6px";
        }
      }
    };

    const animate = () => {
      // Lerp cursor position
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`;
      }

      // Apply magnetic effect to button
      const btn = submitBtnRef.current;
      if (btn) {
        const currentX = parseFloat(btn.style.getPropertyValue("--mx") || "0");
        const currentY = parseFloat(btn.style.getPropertyValue("--my") || "0");
        const targetX = magneticTarget.current.x;
        const targetY = magneticTarget.current.y;
        const newX = currentX + (targetX - currentX) * 0.12;
        const newY = currentY + (targetY - currentY) * 0.12;
        btn.style.setProperty("--mx", `${newX}`);
        btn.style.setProperty("--my", `${newY}`);
        btn.style.transform = `translate(${newX}px, ${newY}px)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    container.addEventListener("mousemove", handleMouseMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [reducedMotion]);

  /* ─── Cleanup timers ─── */
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    },
    []
  );

  /* ─── Validation ─── */
  const validate = (): boolean => {
    const nextErrors: Errors = {};
    if (!emailPattern.test(email.trim()))
      nextErrors.email = "Enter a valid email address.";
    if (password.length < 8)
      nextErrors.password = "Password must be at least 8 characters.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  /* ─── Form Shake on Invalid ─── */
  const shakeForm = () => {
    if (formRef.current && !reducedMotion) {
      gsap.to(formRef.current, {
        keyframes: [
          { x: -8, duration: 0.06 },
          { x: 8, duration: 0.06 },
          { x: -5, duration: 0.06 },
          { x: 5, duration: 0.06 },
          { x: 0, duration: 0.1 },
        ],
        ease: "power2.out",
      });
    }
  };

  /* ─── Submit Handler ─── */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (phase !== "ready") return;

    if (!validate()) {
      shakeForm();
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
      setErrors({
        general: "Invalid email or password. Register first if you don't have an account.",
      });
      setAnnouncement("Authentication failed. Please try again.");
      return;
    }

    setPhase("success");
    setAnnouncement("Authenticated. Opening workspace.");
  };

  /* ─── OAuth Handler ─── */
  const handleOAuth = async (provider: string) => {
    await signIn(provider, { callbackUrl });
  };

  const disabled =
    phase === "authenticating" || phase === "success" || phase === "intro";

  return (
    <div
      ref={containerRef}
      className={styles.experience}
      data-phase={phase}
    >
      {/* Three.js Scene */}
      <div className={styles.scene} aria-hidden="true">
        <LoginScene phase={phase} />
      </div>

      {/* Background Layers */}
      <div className={styles.aurora} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.scanner} aria-hidden="true" />
      <div className={styles.noise} aria-hidden="true" />

      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.homeLink}>
          <Radio size={14} />
          <span>Sentiloop</span>
        </Link>
        <div className={styles.systemState}>
          <span className={styles.liveDot} />
          <span>System Online</span>
        </div>
      </header>

      {/* HUD Side Elements */}
      <div className={styles.hudLeft} aria-hidden="true">
        <span>SL-AUTH-01</span>
        <span>SECURE</span>
      </div>
      <div className={styles.hudRight} aria-hidden="true">
        <span>v2.4.1</span>
        <span>NEURAL</span>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {phase === "intro" ? (
          <div className={styles.introCopy}>
            <span className={styles.introMark}>
              <Radio size={17} />
            </span>
            <p>Calibrating signal space</p>
          </div>
        ) : (
          <div ref={panelRef} className={styles.panelWrap}>
            <div className={styles.panelGlow} aria-hidden="true" />
            <div className={styles.panel}>
              <div className={styles.panelChrome} aria-hidden="true">
                <span />
                <span>SL-01 / SECURE GATE</span>
                <span />
              </div>
              <div className={styles.panelBody}>
                {/* Icon + Header */}
                <div className={styles.iconWell}>
                  {phase === "success" ? (
                    <Check size={21} />
                  ) : (
                    <LockKeyhole size={20} />
                  )}
                </div>
                <p className={styles.eyebrow}>Sentiloop intelligence layer</p>
                <h1>
                  {phase === "success"
                    ? "Portal aligned"
                    : "Sign in to your workspace"}
                </h1>
                <p className={styles.description}>
                  {phase === "success"
                    ? "Authenticated. Opening your dashboard."
                    : "Enter your credentials or use a provider below."}
                </p>

                {/* Form */}
                <form
                  ref={formRef}
                  className={styles.form}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {errors.general && (
                    <p className={styles.error} role="alert">
                      {errors.general}
                    </p>
                  )}

                  {/* Email Field */}
                  <div className={styles.fieldGroup}>
                    <label
                      htmlFor="login-email"
                      className={styles.floatingLabel}
                      data-active={email.length > 0 || undefined}
                    >
                      Email address
                    </label>
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      disabled={disabled}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email)
                          setErrors((c) => ({ ...c, email: undefined }));
                      }}
                      placeholder="you@company.com"
                    />
                    {errors.email && (
                      <p id="email-error" className={styles.error} role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className={styles.fieldGroup}>
                    <div className={styles.floatingLabel} data-active={password.length > 0 || undefined}>
                      <label htmlFor="login-password">Password</label>
                      <Link href="/forgot-password" className={styles.hint} tabIndex={-1}>
                        Forgot?
                      </Link>
                    </div>
                    <div className={styles.passwordField}>
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        disabled={disabled}
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={
                          errors.password ? "password-error" : undefined
                        }
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password)
                            setErrors((c) => ({ ...c, password: undefined }));
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
                    {errors.password && (
                      <p id="password-error" className={styles.error} role="alert">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      id="remember-me"
                      className={styles.checkbox}
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={disabled}
                    />
                    <label htmlFor="remember-me" className={styles.checkboxLabel}>
                      Remember me
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    ref={submitBtnRef}
                    type="submit"
                    disabled={disabled}
                    className={styles.submitButton}
                  >
                    <span className={styles.buttonEnergy} aria-hidden="true" />
                    <span className={styles.buttonLabel}>
                      {phase === "authenticating" ? (
                        <>
                          <span className={styles.spinner} />
                          Signing in
                        </>
                      ) : phase === "success" ? (
                        <>
                          Opening workspace
                          <Check size={16} />
                        </>
                      ) : (
                        <>
                          Sign in
                          <ArrowRight size={16} />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* OAuth Section */}
                <div className={styles.oauthSection}>
                  <div className={styles.oauthDivider}>
                    <span />
                    <span>or continue with</span>
                    <span />
                  </div>
                  <div className={styles.oauthGrid}>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => handleOAuth("google")}
                      className={styles.oauthButton}
                      aria-label="Continue with Google"
                    >
                      <GoogleIcon />
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => handleOAuth("microsoft-entra-id")}
                      className={styles.oauthButton}
                      aria-label="Continue with Microsoft"
                    >
                      <MicrosoftIcon />
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => handleOAuth("github")}
                      className={styles.oauthButton}
                      aria-label="Continue with GitHub"
                    >
                      <GitBranch size={18} />
                    </button>
                  </div>
                </div>

                {/* Links */}
                <div className={styles.linkRow}>
                  <p>
                    Don&apos;t have an account?{" "}
                    <Link href="/register">Create one</Link>
                  </p>
                  <p>
                    <Link href="/otp">Sign in with OTP instead</Link>
                  </p>
                </div>

                {/* Trust Row */}
                <div className={styles.trustRow}>
                  <span>
                    <ShieldCheck size={11} /> Encrypted connection
                  </span>
                  <span>In-memory · data resets on restart</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>&copy; Sentiloop 2025</span>
        <span>Neural authentication layer</span>
      </footer>

      {/* Custom Cursor */}
      <div ref={cursorRef} className={styles.cursor} aria-hidden="true" />
      <div ref={cursorRingRef} className={styles.cursorRing} aria-hidden="true" />

      {/* Success Overlay */}
      {phase === "success" && (
        <div className={styles.successOverlay} aria-hidden="true">
          <div className={styles.successCheck}>
            <Check size={32} />
          </div>
        </div>
      )}

      {/* Accessibility */}
      <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}

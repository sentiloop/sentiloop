"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Eye, EyeOff, UserPlus } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { register } from "@/lib/auth-actions";
import styles from "@/components/login/login-experience.module.css";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = { name?: string; email?: string; password?: string; confirmPassword?: string; general?: string };

export default function RegisterPage() {
  const router = useRouter();
  const reducedMotion = useReducedMotion() ?? false;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const nextErrors: Errors = {};
    if (!name.trim()) nextErrors.name = "Name is required.";
    if (!emailPattern.test(email.trim())) nextErrors.email = "Enter a valid email address.";
    if (password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
    if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    const result = await register({ name: name.trim(), email: email.trim().toLowerCase(), password });

    if (!result.success) {
      setLoading(false);
      setErrors({ general: result.message });
      return;
    }

    // Auto sign-in after registration
    const signInResult = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      setLoading(false);
      setSuccess(true);
      // Still successful registration, just redirect to login
      setTimeout(() => router.push("/login"), 1500);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), reducedMotion ? 300 : 1200);
  };

  const disabled = loading || success;

  return (
    <AuthPanel
      icon={success ? <Check size={21} /> : <UserPlus size={20} />}
      eyebrow="Sentiloop intelligence layer"
      title={success ? "Account created" : "Create your account"}
      description={success
        ? "Welcome aboard. Opening your workspace."
        : "Join Sentiloop to access customer intelligence. Demo: in-memory storage."}
      footer={
        <>
          <span><UserPlus size={11} /> Demo registration</span>
          <span>In-memory · resets on restart</span>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {errors.general && (
          <p className={styles.error} role="alert">{errors.general}</p>
        )}

        <div className={styles.fieldGroup}>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            disabled={disabled}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((c) => ({ ...c, name: undefined }));
            }}
            placeholder="Jane Smith"
          />
          {errors.name && <p id="name-error" className={styles.error}>{errors.name}</p>}
        </div>

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
          <label htmlFor="password">Password</label>
          <div className={styles.passwordField}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              disabled={disabled}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : "password-hint"}
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
          {errors.password ? <p id="password-error" className={styles.error}>{errors.password}</p> : <p id="password-hint" className={styles.hint}>Must be at least 8 characters.</p>}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={confirmPassword}
            disabled={disabled}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((c) => ({ ...c, confirmPassword: undefined }));
            }}
            placeholder="Re-enter your password"
          />
          {errors.confirmPassword && <p id="confirm-error" className={styles.error}>{errors.confirmPassword}</p>}
        </div>

        <motion.button
          type="submit"
          disabled={disabled}
          className={styles.submitButton}
          whileTap={reducedMotion || disabled ? undefined : { scale: 0.985 }}
        >
          <span className={styles.buttonEnergy} aria-hidden="true" />
          <span className={styles.buttonLabel}>
            {loading ? <><span className={styles.spinner} />Creating account</> : success ? <>Account created<Check size={16} /></> : <>Create account<ArrowRight size={16} /></>}
          </span>
        </motion.button>
      </form>

      <OAuthButtons disabled={disabled} callbackUrl="/dashboard" />

      <div className="mt-4 text-center text-[0.65rem] text-[#6f8298]">
        <p>
          Already have an account?{" "}
          <Link href="/login" className="text-[#72cdea] hover:text-[#b4eaff] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </AuthPanel>
  );
}

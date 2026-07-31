import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import styles from "@/components/login/login-experience.module.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sentiloop demo authentication portal.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.experience}>
      <div className={styles.aurora} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.scanner} aria-hidden="true" />

      <header className={styles.header}>
        <Logo href="/" />
        <div className={styles.systemState}>
          <span className={styles.liveDot} />
          <span>Demo auth system</span>
          <span className={styles.systemDivider} />
          <span>In-memory storage</span>
        </div>
      </header>

      <div className={styles.hudLeft} aria-hidden="true">
        <span>SL / ACCESS NODE</span>
        <span>41.9028° N</span>
      </div>
      <div className={styles.hudRight} aria-hidden="true">
        <span>PORTAL 01</span>
        <span>AUTH</span>
      </div>

      <section className={styles.content} aria-labelledby="auth-title">
        {children}
      </section>

      <footer className={styles.footer}>
        <Link href="/" className={styles.homeLink}>
          <ArrowLeft size={14} /> Return home
        </Link>
        <p>Demo auth · In-memory storage · Data resets on server restart</p>
      </footer>
    </div>
  );
}

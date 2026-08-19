"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/logo";

const links = [
  { label: "Services", href: "/services", index: "00" },
  { label: "Platform", href: "#platform", index: "01" },
  { label: "How it works", href: "#workflow", index: "02" },
  { label: "Intelligence", href: "#intelligence", index: "03" },
  { label: "Company", href: "#company", index: "04" },
];

const menuVariants: Variants = {
  hidden: { opacity: 0, y: -14, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.055, delayChildren: 0.06 },
  },
  exit: { opacity: 0, y: -10, scale: 0.99, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] } },
};

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let animationFrame = 0;
    lastScrollY.current = window.scrollY;

    const update = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      setScrolled(currentY > 18);
      if (open || currentY < 72) setVisible(true);
      else if (delta > 7) setVisible(false);
      else if (delta < -4) setVisible(true);

      let currentSection = "";
      for (const link of links) {
        if (link.href.startsWith("/")) continue;
        const section = document.querySelector<HTMLElement>(link.href);
        if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.38) currentSection = link.href;
      }
      setActiveSection(currentSection);
      lastScrollY.current = currentY;
      animationFrame = 0;
    };

    const onScroll = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <motion.header
      initial={{ y: -86, opacity: 0 }}
      animate={{ y: visible || open ? 0 : -94, opacity: visible || open ? 1 : 0 }}
      transition={{ y: { type: "spring", stiffness: 360, damping: 38, mass: 0.85 }, opacity: { duration: 0.24 } }}
      style={{ pointerEvents: visible || open ? "auto" : "none" }}
      onFocusCapture={() => setVisible(true)}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4"
    >
      <nav
        aria-label="Main navigation"
        className={`nav-glass-shell relative z-20 mx-auto flex h-[60px] max-w-[1180px] items-center justify-between rounded-full px-4 transition-all duration-500 md:px-5 ${scrolled || open ? "nav-glass-scrolled" : ""}`}
      >
        <Logo className="relative z-10" />

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex" onMouseLeave={() => setHoveredLink(null)}>
          {links.map((link) => {
            const highlighted = hoveredLink === link.href || (!hoveredLink && activeSection === link.href);
            const isRoute = link.href.startsWith("/");
            const sharedProps = {
              onMouseEnter: () => setHoveredLink(link.href),
              onFocus: () => setHoveredLink(link.href),
              onBlur: () => setHoveredLink(null),
              className: `group relative px-3.5 py-3 text-[0.74rem] font-medium transition-colors duration-300 ${highlighted ? "text-white" : "text-[#929b97] hover:text-white"}`,
            };
            const content = (
              <>
                <span className="relative z-10">{link.label}</span>
                {highlighted ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3.5 -bottom-[7px] h-px overflow-visible bg-gradient-to-r from-transparent via-[#9dfcc7] to-transparent"
                    transition={{ type: "spring", stiffness: 440, damping: 34 }}
                  >
                    <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c7ffda] shadow-[0_0_10px_#9dfcc7]" />
                  </motion.span>
                ) : null}
              </>
            );
            return isRoute ? (
              <Link key={link.href} href={link.href} {...sharedProps}>
                {content}
              </Link>
            ) : (
              <a key={link.href} href={link.href} aria-current={activeSection === link.href ? "location" : undefined} {...sharedProps}>
                {content}
              </a>
            );
          })}
        </div>

        <Link href="/login" className="nav-cta group relative hidden min-h-9 items-center gap-2 overflow-hidden rounded-full px-4 text-[0.74rem] font-semibold text-[#07110b] md:inline-flex">
          <span className="relative z-10">Enter workspace</span>
          <ArrowUpRight size={13} className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        <button
          type="button"
          className="nav-menu-button relative grid size-10 place-items-center rounded-full md:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => {
            setOpen((value) => !value);
            setVisible(true);
          }}
        >
          <span className="relative block h-4 w-4">
            <motion.span
              className="absolute left-0 top-[4px] h-px w-4 rounded-full bg-white"
              animate={open ? { y: 3.5, rotate: 45 } : { y: 0, rotate: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.span
              className="absolute bottom-[4px] right-0 h-px w-3 rounded-full bg-white"
              animate={open ? { y: -3.5, rotate: -45, width: 16 } : { y: 0, rotate: 0, width: 12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="nav-mobile-panel relative z-10 mx-auto mt-2 max-w-[1180px] overflow-hidden rounded-[28px] p-3 md:hidden"
          >
            <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-[#9dfcc7]/[0.07] blur-[65px]" />
            <div className="relative flex flex-col">
              {links.map((link) => (
                <motion.div key={link.href} variants={itemVariants}>
                  {link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="group flex items-center gap-4 border-b border-white/[0.07] px-2 py-4.5"
                    >
                      <span className="font-mono text-[9px] tracking-[0.14em] text-[#59625e]">{link.index}</span>
                      <span className="flex-1 text-[1.18rem] font-medium tracking-[-0.035em] text-[#dfe5e2] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">{link.label}</span>
                      <span className="grid size-8 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#7c8581] transition-all duration-300 group-hover:border-[#9dfcc7]/25 group-hover:bg-[#9dfcc7]/[0.07] group-hover:text-[#bfffd6]"><ArrowRight size={13} /></span>
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={closeMenu}
                      aria-current={activeSection === link.href ? "location" : undefined}
                      className="group flex items-center gap-4 border-b border-white/[0.07] px-2 py-4.5"
                    >
                      <span className="font-mono text-[9px] tracking-[0.14em] text-[#59625e]">{link.index}</span>
                      <span className="flex-1 text-[1.18rem] font-medium tracking-[-0.035em] text-[#dfe5e2] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">{link.label}</span>
                      <span className="grid size-8 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#7c8581] transition-all duration-300 group-hover:border-[#9dfcc7]/25 group-hover:bg-[#9dfcc7]/[0.07] group-hover:text-[#bfffd6]"><ArrowRight size={13} /></span>
                    </a>
                  )}
                </motion.div>
              ))}

              <motion.div variants={itemVariants} className="mt-3">
                <Link href="/login" onClick={closeMenu} className="nav-mobile-cta group flex min-h-14 items-center justify-between rounded-2xl px-5 text-sm font-semibold text-[#07110b]">
                  <span>Enter workspace</span>
                  <span className="grid size-8 place-items-center rounded-full bg-black/10 transition-transform duration-300 group-hover:rotate-45"><ArrowUpRight size={15} /></span>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center justify-between px-2 pb-1 pt-5 font-mono text-[8px] uppercase tracking-[0.15em] text-[#535c58]">
                <span className="inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#9dfcc7] shadow-[0_0_8px_#9dfcc7]" />Systems live</span>
                <span>Sentiloop / AI</span>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}

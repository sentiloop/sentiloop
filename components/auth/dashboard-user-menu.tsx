"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useState } from "react";

interface DashboardUserMenuProps {
  initials: string;
  email: string;
  name: string;
}

export function DashboardUserMenu({ initials, email, name }: DashboardUserMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`User menu for ${name}`}
        className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[#4bbfe8] to-[#705de3] text-[10px] font-semibold text-white transition-transform hover:scale-105"
      >
        {initials}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 top-12 z-40 w-56 rounded-xl border border-white/[0.1] bg-[#0c1018]/95 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            <div className="mb-2 border-b border-white/[0.07] pb-2">
              <p className="text-xs font-medium text-[#dce7ed] truncate">{name}</p>
              <p className="text-[10px] text-[#667789] truncate">{email}</p>
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-[#8b9aa7] transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

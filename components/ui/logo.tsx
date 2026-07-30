import Link from "next/link";

export function Logo({ className = "", href = "/#top" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Sentiloop home">
      <span className="relative grid size-7 place-items-center overflow-hidden rounded-full border border-white/20 bg-white/[0.06]">
        <span className="absolute h-4 w-4 rounded-full border-[1.5px] border-[#9dfcc7] transition-transform duration-500 group-hover:scale-75" />
        <span className="absolute h-2 w-2 translate-x-1.5 rounded-full bg-[#9f91ff] shadow-[0_0_12px_#9f91ff] transition-transform duration-500 group-hover:-translate-x-1" />
      </span>
      <span className="text-[1.05rem] font-semibold tracking-[-0.045em] text-white">sentiloop</span>
    </Link>
  );
}

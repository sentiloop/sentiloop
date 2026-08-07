import { ArrowUpRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Logo } from "@/components/ui/logo";

const groups = [
  { title: "Platform", links: ["Intelligence", "Integrations", "Security", "Changelog"] },
  { title: "Company", links: ["About", "Careers", "Journal", "Contact"] },
  { title: "Follow", links: ["LinkedIn", "X / Twitter", "YouTube"] },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] pb-8 pt-14">
      <div className="container-shell">
        <Stagger className="grid gap-12 md:grid-cols-[1.3fr_1fr]" stagger={0.14}>
          <StaggerItem preset="tilt"><Logo /><p className="mt-5 max-w-xs text-sm leading-6 text-[#6f7774]">An intelligent technology and cybersecurity partner for the digital future.</p><div className="mt-5 flex flex-col gap-1"><p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#4f5754]">Co-founders</p><p className="mt-1 text-xs text-[#aeb6b2]">Kaushal Tiwari <span className="text-[#5e6662]">&</span> Namrata Jhade</p></div><a href="mailto:hello@sentiloop.ai" className="mt-5 inline-flex items-center gap-2 text-xs text-[#aeb6b2] hover:text-white">hello@sentiloop.ai <ArrowUpRight size={13} /></a></StaggerItem>
          <StaggerItem preset="fade" className="grid grid-cols-3 gap-4">{groups.map((group) => <div key={group.title}><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#4f5754]">{group.title}</p><div className="mt-4 flex flex-col gap-3">{group.links.map((link) => <a key={link} href={link === "Contact" ? "mailto:hello@sentiloop.ai" : "#top"} className="text-xs text-[#7a827e] transition-colors hover:text-white">{link}</a>)}</div></div>)}</StaggerItem>
        </Stagger>
        <Stagger className="mt-16 flex flex-col gap-4 border-t border-white/[0.07] pt-6 text-[10px] text-[#535b57] sm:flex-row sm:items-center sm:justify-between" stagger={0.08}><StaggerItem><p>© {new Date().getFullYear()} Sentiloop, Inc. All signals reserved.</p></StaggerItem><StaggerItem className="flex gap-5"><a href="#top" className="hover:text-[#8b9490]">Privacy</a><a href="#top" className="hover:text-[#8b9490]">Terms</a><span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#9dfcc7]" />All systems sensing</span></StaggerItem></Stagger>
      </div>
    </footer>
  );
}

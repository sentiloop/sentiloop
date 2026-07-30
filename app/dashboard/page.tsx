import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bot,
  ChartNoAxesCombined,
  CheckCircle2,
  CircleHelp,
  Command,
  FileText,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Radio,
  Search,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "Workspace preview",
  description: "A preview of the Sentiloop customer intelligence workspace.",
  alternates: { canonical: "/dashboard" },
  robots: { index: false, follow: false, nocache: true },
};

const metrics = [
  { label: "Signals processed", value: "14.2M", change: "+18.4%", icon: Radio, color: "text-[#77e9ff]" },
  { label: "Neural clarity", value: "96.8%", change: "+2.1%", icon: Sparkles, color: "text-[#a999ff]" },
  { label: "Active themes", value: "128", change: "+12", icon: MessageSquareText, color: "text-[#9dfcc7]" },
  { label: "Loop actions", value: "1,284", change: "+9.7%", icon: CheckCircle2, color: "text-[#8fc2ff]" },
];

const activity = [
  { title: "Enterprise onboarding friction", source: "Support + Calls", velocity: "+34%", tone: "bg-[#ffb86b]" },
  { title: "Shared workspace intent", source: "Sales + Product", velocity: "+21%", tone: "bg-[#a999ff]" },
  { title: "Mobile response confidence", source: "Reviews + Social", velocity: "+16%", tone: "bg-[#77e9ff]" },
];

const chartBars = [42, 51, 47, 62, 58, 72, 68, 83, 77, 91, 86, 96, 88, 94];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-[#edf4f7]">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_-15%,rgba(61,150,255,.10),transparent_32rem),radial-gradient(circle_at_18%_75%,rgba(132,99,255,.055),transparent_28rem)]" />
      <div className="relative mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[230px_1fr]">
        <aside className="hidden border-r border-white/[0.07] bg-[#070a0f]/80 px-4 py-5 lg:flex lg:flex-col" aria-label="Workspace navigation">
          <Logo href="/" className="px-2" />
          <div className="mt-8 rounded-xl border border-[#6ecfff]/15 bg-[#5bc9ff]/[0.06] px-3 py-3">
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#8edfff]"><span className="size-1.5 rounded-full bg-[#77e9ff] shadow-[0_0_10px_#77e9ff]" />Preview workspace</div>
            <p className="mt-2 text-[10px] leading-4 text-[#667789]">Static demo data · no live session</p>
          </div>
          <nav className="mt-6 space-y-1" aria-label="Primary">
            {[
              [LayoutDashboard, "Overview", true], [Activity, "Live signals", false], [ChartNoAxesCombined, "Intelligence", false],
              [Bot, "Autonomous loops", false], [Users, "Audiences", false], [FileText, "Briefings", false],
            ].map(([Icon, label, active]) => {
              const NavIcon = Icon as typeof LayoutDashboard;
              return <a key={label as string} href={`#${String(label).toLowerCase().replaceAll(" ", "-")}`} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition-colors ${active ? "border border-white/[0.07] bg-white/[0.06] text-white" : "text-[#71808d] hover:bg-white/[0.035] hover:text-[#c8d3db]"}`} aria-current={active ? "page" : undefined}><NavIcon size={15} strokeWidth={1.7} />{label as string}</a>;
            })}
          </nav>
          <div className="mt-auto space-y-1 border-t border-white/[0.06] pt-4">
            <a href="#help" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-[#687784] hover:text-white"><CircleHelp size={15} />Help center</a>
            <a href="#settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-[#687784] hover:text-white"><Settings size={15} />Settings</a>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-white/[0.07] bg-[#05070b]/75 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden"><button type="button" aria-label="Open navigation" className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.035]"><Menu size={16} /></button><Logo href="/" /></div>
            <div className="hidden lg:block"><p className="text-sm font-medium">Intelligence overview</p><p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.13em] text-[#526170]">Last synchronized · preview data</p></div>
            <div className="flex items-center gap-2">
              <button type="button" className="hidden h-9 min-w-52 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-left text-[10px] text-[#627281] sm:flex"><Search size={13} /><span className="flex-1">Search intelligence</span><Command size={11} /> K</button>
              <button type="button" aria-label="Notifications" className="relative grid size-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-[#8b9aa7]"><Bell size={14} /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#77e9ff]" /></button>
              <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[#4bbfe8] to-[#705de3] text-[10px] font-semibold">SL</div>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div><div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-[#6d7b87]"><span className="size-1.5 rounded-full bg-[#9dfcc7] shadow-[0_0_9px_#9dfcc7]" />Signal field stable</div><h1 className="mt-3 text-3xl font-medium tracking-[-0.055em] sm:text-4xl">Good morning, Explorer.</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#748391]">Your preview signal map found three meaningful shifts across customer conversations.</p></div>
              <Link href="/login" className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.05] px-4 text-xs font-medium text-[#c8d6df] transition-colors hover:bg-white/[0.09]">Replay portal <ArrowRight size={14} /></Link>
            </div>

            <section aria-labelledby="metric-heading" className="mt-7">
              <h2 id="metric-heading" className="sr-only">Workspace metrics</h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => <article key={metric.label} className="rounded-2xl border border-white/[0.075] bg-gradient-to-br from-white/[0.045] to-white/[0.015] p-4 shadow-[inset_0_1px_rgba(255,255,255,.04)]"><div className="flex items-center justify-between"><span className={`grid size-8 place-items-center rounded-lg border border-white/[0.07] bg-black/20 ${metric.color}`}><metric.icon size={14} /></span><span className="inline-flex items-center gap-1 rounded-full bg-[#9dfcc7]/[0.07] px-2 py-1 font-mono text-[8px] text-[#9dfcc7]"><ArrowUpRight size={9} />{metric.change}</span></div><p className="mt-5 text-2xl font-medium tracking-[-0.055em]">{metric.value}</p><p className="mt-1 text-[10px] text-[#6d7b87]">{metric.label}</p></article>)}
              </div>
            </section>

            <div className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_.8fr]">
              <section id="intelligence" aria-labelledby="resonance-heading" className="overflow-hidden rounded-3xl border border-white/[0.075] bg-[#080b10]/85">
                <div className="flex items-start justify-between border-b border-white/[0.06] p-5"><div><p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#607080]">Customer resonance</p><h2 id="resonance-heading" className="mt-2 text-lg font-medium tracking-[-0.035em]">Signal momentum</h2></div><button type="button" className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[9px] text-[#8796a3]">Last 14 days</button></div>
                <div className="p-5">
                  <div className="flex items-end gap-3"><span className="text-4xl font-medium tracking-[-0.065em]">84.6</span><span className="mb-1.5 inline-flex items-center gap-1 text-[10px] text-[#9dfcc7]"><ArrowUpRight size={11} />12.4%</span></div>
                  <div className="relative mt-8 flex h-48 items-end gap-2 border-b border-white/[0.08] bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px)] bg-[length:100%_25%] px-1">
                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 700 190" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="dash-line" x1="0" x2="1"><stop stopColor="#7665ff"/><stop offset=".5" stopColor="#62d9ff"/><stop offset="1" stopColor="#9dfcc7"/></linearGradient></defs><path d="M0 154 C55 150 70 124 112 132 S175 105 214 115 S283 72 326 91 S389 64 430 70 S492 38 534 52 S604 27 700 18" fill="none" stroke="url(#dash-line)" strokeWidth="2"/><path d="M0 154 C55 150 70 124 112 132 S175 105 214 115 S283 72 326 91 S389 64 430 70 S492 38 534 52 S604 27 700 18 L700 190 L0 190Z" fill="url(#dash-line)" opacity=".07"/></svg>
                    {chartBars.map((height, index) => <span key={index} className="relative flex-1 rounded-t-sm bg-[#62d9ff]/[0.08]" style={{ height: `${height}%` }}><span className="absolute inset-x-0 bottom-0 rounded-t-sm bg-gradient-to-t from-[#4a6cff]/20 to-[#77e9ff]/45" style={{ height: `${Math.max(12, height - 35)}%` }} /></span>)}
                  </div>
                  <div className="mt-3 flex justify-between font-mono text-[8px] uppercase tracking-[0.12em] text-[#43515e]"><span>May 01</span><span>Today · Live preview</span></div>
                </div>
              </section>

              <section id="live-signals" aria-labelledby="signals-heading" className="rounded-3xl border border-white/[0.075] bg-[#080b10]/85 p-5">
                <div className="flex items-start justify-between"><div><p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#607080]">Emerging now</p><h2 id="signals-heading" className="mt-2 text-lg font-medium tracking-[-0.035em]">Priority signals</h2></div><span className="grid size-8 place-items-center rounded-lg bg-[#a999ff]/10 text-[#b4a6ff]"><Activity size={14} /></span></div>
                <div className="mt-5 divide-y divide-white/[0.06]">
                  {activity.map((item) => <article key={item.title} className="py-4 first:pt-0 last:pb-0"><div className="flex gap-3"><span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${item.tone} shadow-[0_0_10px_currentColor]`} /><div className="min-w-0 flex-1"><h3 className="truncate text-xs font-medium text-[#dce7ed]">{item.title}</h3><p className="mt-1 text-[9px] text-[#596977]">{item.source}</p></div><span className="font-mono text-[9px] text-[#9dfcc7]">{item.velocity}</span></div></article>)}
                </div>
                <button type="button" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] py-2.5 text-[10px] text-[#82919d] hover:bg-white/[0.05]">View all signals <ArrowRight size={12} /></button>
              </section>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <article className="rounded-2xl border border-white/[0.075] bg-[#080b10]/85 p-5"><div className="flex items-center justify-between"><p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#607080]">Loop impact</p><CheckCircle2 size={14} className="text-[#9dfcc7]" /></div><p className="mt-5 text-2xl font-medium tracking-[-0.05em]">1,284 <span className="text-sm text-[#647481]">actions</span></p><p className="mt-2 text-[10px] leading-4 text-[#647481]">Previewed workflows completed across support and product.</p></article>
              <article className="rounded-2xl border border-white/[0.075] bg-[#080b10]/85 p-5"><div className="flex items-center justify-between"><p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#607080]">Risk velocity</p><ArrowDownRight size={14} className="text-[#77e9ff]" /></div><p className="mt-5 text-2xl font-medium tracking-[-0.05em]">−18.2%</p><p className="mt-2 text-[10px] leading-4 text-[#647481]">Modeled decrease in unresolved high-intent conversations.</p></article>
              <article className="relative overflow-hidden rounded-2xl border border-[#70dfff]/15 bg-gradient-to-br from-[#0b1d2b] to-[#111025] p-5"><div className="absolute -right-10 -top-10 size-32 rounded-full bg-[#62d9ff]/10 blur-3xl" /><div className="relative"><div className="flex items-center justify-between"><p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#78b8da]">Ask Sentiloop</p><Sparkles size={14} className="text-[#77e9ff]" /></div><p className="mt-4 text-sm font-medium">What changed since yesterday?</p><button type="button" className="mt-4 inline-flex items-center gap-2 text-[10px] text-[#9adff8]">Open intelligence canvas <ArrowUpRight size={12} /></button></div></article>
            </div>

            <footer className="mt-8 flex flex-col gap-2 border-t border-white/[0.06] pt-5 font-mono text-[8px] uppercase tracking-[0.11em] text-[#45525e] sm:flex-row sm:items-center sm:justify-between"><p>Sentiloop workspace preview · static demonstration data</p><p>No authentication backend or live customer data</p></footer>
          </div>
        </section>
      </div>
    </main>
  );
}

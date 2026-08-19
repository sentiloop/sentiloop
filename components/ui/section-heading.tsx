import { MaskReveal, Reveal } from "@/components/motion/reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
      <Reveal>
        <span className={`eyebrow ${centered ? "justify-center" : ""}`}>{eyebrow}</span>
      </Reveal>
      <MaskReveal delay={0.06} className="-mb-2 pb-2">
        <h2 className={`section-title ${centered ? "mx-auto" : ""}`}>{title}</h2>
      </MaskReveal>
      {description ? (
        <Reveal delay={0.12}>
          <p className={`mt-6 max-w-2xl text-base leading-7 text-[#929b97] md:text-lg ${centered ? "mx-auto" : ""}`}>
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

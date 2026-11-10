import { Frame, Label, Line, Panel, WindowBar, t } from "./primitives";

/* Illustrative compositions — not client work or real results. */

export function WebsiteVisual() {
  return (
    <Frame>
      {/* Desktop browser */}
      <Panel className="left-[6%] top-[9%] h-[66%] w-[72%] overflow-hidden">
        <WindowBar url="your-business.com" />
        <div className="space-y-[2.4cqw] p-[3cqw]">
          <div className="flex items-center justify-between">
            <Line strong className="w-[18%]" />
            <div className="flex gap-[1.5cqw]">
              <Line className="w-[5cqw]" />
              <Line className="w-[5cqw]" />
              <Line className="w-[5cqw]" />
            </div>
          </div>
          <div className="space-y-[1.4cqw] pt-[2cqw]">
            <div className="h-[2.6cqw] w-[62%] rounded-full bg-silver-100/80" />
            <div className="h-[2.6cqw] w-[44%] rounded-full bg-silver-100/80" />
            <Line className="mt-[2cqw] w-[54%]" />
            <Line className="w-[40%]" />
          </div>
          <div className="h-[4.2cqw] w-[20%] rounded-[1cqw] bg-blue-500" />
          <div className="grid grid-cols-3 gap-[1.8cqw] pt-[1.5cqw]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-[1cqw] rounded-[1cqw] border border-white/10 p-[1.6cqw]">
                <div className="size-[3cqw] rounded-[0.8cqw] bg-blue-500/30" />
                <Line strong className="w-[70%]" />
                <Line className="w-full" />
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* Tablet */}
      <Panel className="right-[5%] top-[30%] h-[52%] w-[30%] overflow-hidden">
        <div className="space-y-[1.4cqw] p-[2.2cqw]">
          <Line strong className="w-[40%]" />
          <div className="aspect-[16/9] rounded-[1cqw] bg-linear-to-br from-navy-700 to-navy-800" />
          <div className="h-[2cqw] w-[80%] rounded-full bg-silver-100/70" />
          <Line className="w-full" />
          <Line className="w-[70%]" />
          <div className="h-[3.4cqw] w-[45%] rounded-[0.8cqw] bg-blue-500" />
        </div>
      </Panel>

      {/* Phone */}
      <Panel className="bottom-[6%] left-[52%] h-[46%] w-[17%] overflow-hidden rounded-[2.4cqw]" accent>
        <div className="mx-auto mt-[1.4cqw] h-[0.8cqw] w-[30%] rounded-full bg-white/15" />
        <div className="space-y-[1.2cqw] p-[1.8cqw]">
          <div className="aspect-square rounded-[1cqw] bg-linear-to-br from-blue-600/50 to-navy-800" />
          <div className="h-[1.8cqw] w-[85%] rounded-full bg-silver-100/70" />
          <Line className="w-full" />
          <div className="h-[3cqw] w-full rounded-[0.8cqw] bg-blue-500" />
        </div>
      </Panel>

      <div data-v-el className="absolute bottom-[8%] left-[6%] flex gap-[1.2cqw]">
        {["Desktop", "Tablet", "Mobile"].map((label) => (
          <span key={label} className={`rounded-full border border-white/10 px-[1.6cqw] py-[0.5cqw] text-silver-300 ${t.xs}`}>
            {label}
          </span>
        ))}
      </div>
    </Frame>
  );
}

export function BrandingVisual() {
  const swatches = [
    { name: "Midnight", cls: "bg-black border border-white/15" },
    { name: "Navy", cls: "bg-navy-800" },
    { name: "Electric", cls: "bg-blue-500" },
    { name: "Silver", cls: "bg-silver-300" },
  ];

  return (
    <Frame>
      {/* Type specimen */}
      <Panel className="left-[6%] top-[8%] h-[48%] w-[46%] p-[3cqw]">
        <Label>Typeface</Label>
        <p className="mt-[1cqw] text-[13cqw] font-semibold leading-none tracking-tight text-silver-50">
          Aa
        </p>
        <div className="mt-[2cqw] flex gap-[2cqw] text-silver-400">
          <span className={`font-semibold ${t.sm}`}>Display</span>
          <span className={t.sm}>Regular</span>
          <span className={`font-mono ${t.sm}`}>Mono</span>
        </div>
      </Panel>

      {/* Colour system */}
      <Panel className="right-[6%] top-[8%] h-[48%] w-[38%] p-[2.4cqw]">
        <Label>Colour system</Label>
        <div className="mt-[2cqw] grid h-[72%] grid-cols-4 gap-[1.2cqw]">
          {swatches.map((s) => (
            <div key={s.name} className="flex flex-col gap-[1cqw]">
              <div className={`flex-1 rounded-[1cqw] ${s.cls}`} />
              <span className={`text-silver-400 ${t.xs}`}>{s.name}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Social post */}
      <Panel className="bottom-[7%] left-[6%] h-[34%] w-[46%] overflow-hidden p-[2cqw]">
        <div className="flex h-full gap-[2cqw]">
          <div className="relative aspect-square h-full overflow-hidden rounded-[1cqw] bg-navy-800">
            <div className="absolute -bottom-1/4 -left-1/4 size-full rounded-full border-[1.2cqw] border-blue-500/70" />
            <div className="absolute right-[14%] top-[14%] size-[30%] rounded-full bg-silver-200/80" />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-[1.2cqw]">
            <Label>Social post</Label>
            <Line strong className="w-[90%]" />
            <Line className="w-full" />
            <Line className="w-[60%]" />
          </div>
        </div>
      </Panel>

      {/* Identity marks */}
      <Panel className="bottom-[7%] right-[6%] h-[34%] w-[38%] p-[2cqw]">
        <div className="grid h-full grid-cols-3 place-items-center gap-[1.5cqw]">
          <div className="size-[7cqw] rounded-full border-[0.9cqw] border-silver-200/80" />
          <div className="size-[7cqw] rotate-45 rounded-[1cqw] bg-blue-500" />
          <div className="size-[7cqw] bg-silver-200/80 [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
        </div>
      </Panel>
    </Frame>
  );
}

export function MarketingVisual() {
  const channels = [
    { name: "Search", width: "w-[72%]", accent: true, top: "top-[8%]" },
    { name: "Social", width: "w-[54%]", accent: false, top: "top-[27%]" },
    { name: "Email", width: "w-[38%]", accent: false, top: "top-[46%]" },
  ];

  return (
    <Frame>
      {/* Campaign overview chart */}
      <Panel className="left-[6%] top-[8%] h-[58%] w-[60%] p-[3cqw]">
        <div className="flex items-center justify-between">
          <Label>Campaign overview</Label>
          <span className={`rounded-full bg-blue-500/20 px-[1.4cqw] py-[0.3cqw] text-blue-300 ${t.xs}`}>Live</span>
        </div>
        <svg viewBox="0 0 300 140" className="mt-[2cqw] h-[70%] w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mk-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--xt-blue-500)" stopOpacity="0.35" />
              <stop offset="1" stopColor="var(--xt-blue-500)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[35, 70, 105].map((y) => (
            <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="white" strokeOpacity="0.06" />
          ))}
          <path d="M0 120 C40 112 60 96 95 92 S150 70 185 62 S245 34 300 22 L300 140 L0 140 Z" fill="url(#mk-fill)" />
          <path d="M0 120 C40 112 60 96 95 92 S150 70 185 62 S245 34 300 22" fill="none" stroke="var(--xt-blue-400)" strokeWidth="2.5" />
          <path d="M0 128 C50 124 90 116 130 110 S220 92 300 80" fill="none" stroke="var(--xt-silver-300)" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>
      </Panel>

      {/* Channels */}
      {channels.map((c) => (
        <Panel
          key={c.name}
          accent={c.accent}
          className={`right-[6%] w-[28%] p-[2cqw] ${c.top}`}
        >
          <div className="flex items-center gap-[1.2cqw]">
            <span className={`size-[1.6cqw] rounded-full ${c.accent ? "bg-blue-500" : "bg-silver-400/50"}`} />
            <span className={`text-silver-200 ${t.sm}`}>{c.name}</span>
          </div>
          <div className="mt-[1.4cqw] h-[1.2cqw] w-full rounded-full bg-white/5">
            <div className={`h-full rounded-full ${c.width} ${c.accent ? "bg-blue-500" : "bg-silver-400/50"}`} />
          </div>
        </Panel>
      ))}

      {/* Funnel */}
      <Panel className="bottom-[7%] left-[6%] h-[24%] w-[60%] p-[2.4cqw]">
        <div className="flex h-full flex-col justify-center gap-[1.2cqw]">
          {[
            { label: "Reach", w: "w-full" },
            { label: "Engage", w: "w-[70%]" },
            { label: "Enquire", w: "w-[42%]" },
          ].map((row, i) => (
            <div key={row.label} className="flex items-center gap-[2cqw]">
              <span className={`w-[14cqw] text-silver-400 ${t.xs}`}>{row.label}</span>
              <div className={`h-[2cqw] rounded-[0.6cqw] ${row.w} ${i === 2 ? "bg-blue-500" : "bg-navy-700"}`} />
            </div>
          ))}
        </div>
      </Panel>
    </Frame>
  );
}

export function SeoVisual() {
  return (
    <Frame>
      {/* Search bar */}
      <Panel className="left-[6%] top-[8%] w-[88%] px-[2.6cqw] py-[2cqw]">
        <div className="flex items-center gap-[2cqw]">
          <svg viewBox="0 0 24 24" className="size-[3cqw] text-silver-300" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className={`text-silver-200 ${t.md}`}>services near me</span>
          <span className="ml-auto h-[3cqw] w-px bg-blue-400" />
        </div>
      </Panel>

      {/* Results */}
      <div className="absolute left-[6%] top-[27%] w-[54%] space-y-[2cqw]">
        <Panel accent className="relative! p-[2.2cqw]">
          <div className="flex items-start gap-[1.8cqw]">
            <span className={`grid size-[4cqw] shrink-0 place-items-center rounded-[0.8cqw] bg-blue-500 font-semibold text-white ${t.sm}`}>1</span>
            <div className="flex-1 space-y-[1cqw]">
              <span className={`block text-blue-300 ${t.xs}`}>your-business.com</span>
              <div className="h-[1.8cqw] w-[80%] rounded-full bg-silver-100/80" />
              <Line className="w-full" />
            </div>
          </div>
        </Panel>
        {[0, 1].map((i) => (
          <Panel key={i} className="relative! p-[2.2cqw] opacity-60">
            <div className="flex items-start gap-[1.8cqw]">
              <span className={`grid size-[4cqw] shrink-0 place-items-center rounded-[0.8cqw] border border-white/10 text-silver-400 ${t.sm}`}>
                {i + 2}
              </span>
              <div className="flex-1 space-y-[1cqw]">
                <Line className="w-[40%]" />
                <Line strong className="w-[70%]" />
                <Line className="w-[90%]" />
              </div>
            </div>
          </Panel>
        ))}
      </div>

      {/* Visibility trend */}
      <Panel className="right-[6%] top-[27%] h-[36%] w-[32%] p-[2.2cqw]">
        <Label>Visibility</Label>
        <svg viewBox="0 0 100 60" className="mt-[1.5cqw] h-[70%] w-full" preserveAspectRatio="none">
          <path d="M0 55 H18 V44 H36 V36 H54 V24 H72 V15 H100 V6" fill="none" stroke="var(--xt-blue-400)" strokeWidth="2" />
          {[[18, 44], [36, 36], [54, 24], [72, 15]].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="2.2" fill="var(--xt-silver-100)" />
          ))}
        </svg>
      </Panel>

      {/* Lead captured */}
      <Panel className="bottom-[7%] right-[6%] w-[32%] p-[2.2cqw]" accent>
        <div className="flex items-center gap-[1.4cqw]">
          <span className="grid size-[3.2cqw] place-items-center rounded-full bg-blue-500">
            <svg viewBox="0 0 24 24" className="size-[2cqw]" fill="none" stroke="white" strokeWidth="3">
              <path d="m5 12 5 5 9-10" />
            </svg>
          </span>
          <span className={`text-silver-100 ${t.sm}`}>New enquiry</span>
        </div>
        <div className="mt-[1.6cqw] space-y-[1cqw]">
          <Line className="w-full" />
          <Line className="w-[60%]" />
        </div>
      </Panel>
    </Frame>
  );
}

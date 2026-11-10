import { Frame, Label, Line, Panel, t } from "./primitives";

/* Illustrative compositions — not client work or real results. */

export function ConsultancyVisual() {
  const columns = [
    { name: "Now", blocks: [true, false, false] },
    { name: "Next", blocks: [false, false] },
    { name: "Later", blocks: [false, false] },
  ];

  return (
    <Frame>
      {/* Roadmap board */}
      <Panel className="left-[6%] top-[8%] h-[56%] w-[88%] p-[2.6cqw]">
        <div className="flex items-center justify-between">
          <Label>Roadmap</Label>
          <div className="flex gap-[0.8cqw]">
            <span className="size-[1.2cqw] rounded-full bg-blue-500" />
            <span className="size-[1.2cqw] rounded-full bg-silver-400/40" />
          </div>
        </div>
        <div className="mt-[2cqw] grid h-[80%] grid-cols-3 gap-[2cqw]">
          {columns.map((col) => (
            <div key={col.name} className="flex flex-col gap-[1.4cqw] rounded-[1.2cqw] bg-white/[0.03] p-[1.6cqw]">
              <span className={`font-medium text-silver-200 ${t.sm}`}>{col.name}</span>
              {col.blocks.map((accent, i) => (
                <div
                  key={i}
                  className={`space-y-[0.8cqw] rounded-[0.8cqw] border p-[1.4cqw] ${
                    accent ? "border-blue-500/60 bg-blue-500/10" : "border-white/10 bg-navy-800"
                  }`}
                >
                  <Line strong={accent} className="w-[80%]" />
                  <Line className="w-[55%]" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Panel>

      {/* Priority matrix */}
      <Panel className="bottom-[7%] right-[6%] h-[26%] w-[40%] p-[2cqw]">
        <svg viewBox="0 0 120 70" className="size-full">
          <line x1="14" y1="6" x2="14" y2="58" stroke="white" strokeOpacity="0.2" />
          <line x1="14" y1="58" x2="116" y2="58" stroke="white" strokeOpacity="0.2" />
          <line x1="65" y1="6" x2="65" y2="58" stroke="white" strokeOpacity="0.06" strokeDasharray="2 3" />
          <line x1="14" y1="32" x2="116" y2="32" stroke="white" strokeOpacity="0.06" strokeDasharray="2 3" />
          <text x="2" y="10" fontSize="6" fill="var(--xt-silver-400)">Impact</text>
          <text x="96" y="67" fontSize="6" fill="var(--xt-silver-400)">Effort</text>
          <circle cx="36" cy="18" r="4.5" fill="var(--xt-blue-500)" />
          <circle cx="86" cy="22" r="3" fill="var(--xt-silver-300)" fillOpacity="0.6" />
          <circle cx="44" cy="44" r="3" fill="var(--xt-silver-300)" fillOpacity="0.6" />
          <circle cx="96" cy="48" r="3" fill="var(--xt-silver-300)" fillOpacity="0.4" />
        </svg>
      </Panel>

      {/* Milestones */}
      <Panel className="bottom-[7%] left-[6%] h-[26%] w-[44%] p-[2.4cqw]">
        <Label>Milestones</Label>
        <div className="relative mt-[3cqw] flex items-center justify-between">
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
          <div className="absolute left-0 top-1/2 h-px w-[38%] bg-blue-500" />
          {[true, true, false, false].map((done, i) => (
            <span
              key={i}
              className={`relative size-[2.2cqw] rounded-full border ${
                done ? "border-blue-500 bg-blue-500" : "border-white/30 bg-navy-900"
              }`}
            />
          ))}
        </div>
      </Panel>
    </Frame>
  );
}

export function AutomationVisual() {
  const outputs = [
    { y: 46, label: "Reply drafted" },
    { y: 150, label: "CRM updated" },
    { y: 254, label: "Team notified" },
  ];

  return (
    <Frame>
      <svg viewBox="0 0 400 300" className="absolute inset-[6%] size-[88%]">
        {/* Connectors */}
        <path data-v-el d="M108 150 H156" stroke="var(--xt-blue-400)" strokeWidth="2" fill="none" />
        {outputs.map((o) => (
          <path
            key={o.y}
            data-v-el
            d={`M244 150 C276 150 270 ${o.y} 296 ${o.y}`}
            stroke="var(--xt-silver-300)"
            strokeOpacity="0.45"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
          />
        ))}

        {/* Trigger */}
        <g data-v-el>
          <rect x="4" y="122" width="104" height="56" rx="10" fill="var(--xt-navy-900)" stroke="white" strokeOpacity="0.12" />
          <circle cx="24" cy="150" r="7" fill="none" stroke="var(--xt-silver-300)" strokeWidth="1.5" />
          <text x="38" y="147" fontSize="10" fill="var(--xt-silver-100)">Enquiry</text>
          <text x="38" y="160" fontSize="8" fill="var(--xt-silver-400)">received</text>
        </g>

        {/* AI step */}
        <g data-v-el>
          <rect x="156" y="110" width="88" height="80" rx="14" fill="var(--xt-navy-800)" stroke="var(--xt-blue-500)" strokeWidth="1.5" />
          <circle cx="200" cy="138" r="11" fill="var(--xt-blue-500)" />
          <path d="M194 138 h12 M200 132 v12" stroke="white" strokeWidth="2" />
          <text x="200" y="166" fontSize="10" textAnchor="middle" fill="var(--xt-silver-50)">AI classifies</text>
          <text x="200" y="179" fontSize="8" textAnchor="middle" fill="var(--xt-silver-400)">and routes</text>
        </g>

        {/* Outputs */}
        {outputs.map((o) => (
          <g key={o.label} data-v-el>
            <rect x="296" y={o.y - 22} width="100" height="44" rx="10" fill="var(--xt-navy-900)" stroke="white" strokeOpacity="0.12" />
            <circle cx="312" cy={o.y} r="4" fill="var(--xt-blue-400)" />
            <text x="322" y={o.y + 3.5} fontSize="9.5" fill="var(--xt-silver-100)">{o.label}</text>
          </g>
        ))}
      </svg>

      <div data-v-el className={`absolute bottom-[6%] left-[6%] flex items-center gap-[1.2cqw] text-silver-400 ${t.xs}`}>
        <span className="size-[1.2cqw] rounded-full bg-blue-500" />
        Automated workflow
      </div>
    </Frame>
  );
}

export function CrmVisual() {
  const stages = [
    { name: "Lead", cards: ["A", "D", "G"] },
    { name: "Qualified", cards: ["B", "E"] },
    { name: "Proposal", cards: ["C"] },
    { name: "Won", cards: ["F"] },
  ];

  return (
    <Frame>
      <Panel className="left-[6%] top-[8%] h-[62%] w-[88%] p-[2.4cqw]">
        <div className="flex items-center justify-between">
          <Label>Sales pipeline</Label>
          <Line className="w-[16%]" />
        </div>
        <div className="mt-[2cqw] grid h-[84%] grid-cols-4 gap-[1.6cqw]">
          {stages.map((stage, s) => (
            <div key={stage.name} className="flex flex-col gap-[1.2cqw] rounded-[1cqw] bg-white/[0.03] p-[1.2cqw]">
              <div className="flex items-center gap-[0.8cqw]">
                <span className={`size-[1.2cqw] rounded-full ${s === 3 ? "bg-blue-500" : "bg-silver-400/50"}`} />
                <span className={`text-silver-300 ${t.xs}`}>{stage.name}</span>
              </div>
              {stage.cards.map((initial) => (
                <div
                  key={initial}
                  className={`flex items-center gap-[1cqw] rounded-[0.8cqw] border p-[1cqw] ${
                    s === 3 ? "border-blue-500/60 bg-blue-500/10" : "border-white/10 bg-navy-800"
                  }`}
                >
                  <span className={`grid size-[3cqw] shrink-0 place-items-center rounded-full bg-navy-700 text-silver-200 ${t.xs}`}>
                    {initial}
                  </span>
                  <div className="flex-1 space-y-[0.7cqw]">
                    <Line strong className="w-[80%]" />
                    <Line className="w-[50%]" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Panel>

      {/* Contact record */}
      <Panel accent className="bottom-[6%] right-[8%] w-[42%] p-[2.4cqw]">
        <div className="flex items-center gap-[1.6cqw]">
          <span className={`grid size-[5cqw] place-items-center rounded-full bg-blue-500 font-semibold text-white ${t.sm}`}>F</span>
          <div className="flex-1 space-y-[1cqw]">
            <Line strong className="w-[60%]" />
            <Line className="w-[40%]" />
          </div>
        </div>
        <div className="mt-[2cqw] grid grid-cols-3 gap-[1cqw]">
          {["Calls", "Emails", "Notes"].map((label) => (
            <span key={label} className={`rounded-[0.6cqw] bg-white/5 py-[0.6cqw] text-center text-silver-400 ${t.xs}`}>
              {label}
            </span>
          ))}
        </div>
      </Panel>
    </Frame>
  );
}

export function ErpVisual() {
  const modules = [
    { name: "Finance", x: 18, y: 20 },
    { name: "Inventory", x: 50, y: 12 },
    { name: "Sales", x: 82, y: 20 },
    { name: "Purchasing", x: 18, y: 80 },
    { name: "People", x: 50, y: 88 },
    { name: "Reports", x: 82, y: 80 },
  ];

  return (
    <Frame>
      {/* Connections to the central hub */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        {modules.map((m) => (
          <line
            key={m.name}
            data-v-el
            x1="50"
            y1="50"
            x2={m.x}
            y2={m.y}
            stroke="var(--xt-silver-300)"
            strokeOpacity="0.3"
            strokeWidth="0.3"
            strokeDasharray="1 1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {/* Hub */}
      <div data-v-el className="absolute left-1/2 top-1/2 grid size-[22cqw] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-blue-500/60 bg-navy-800 shadow-[0_0_0_2cqw_rgb(47_107_255/0.06)]">
        <div className="text-center">
          <span className={`block font-semibold text-silver-50 ${t.md}`}>ERP</span>
          <span className={`text-silver-400 ${t.xs}`}>One system</span>
        </div>
      </div>

      {/* Modules */}
      {modules.map((m, i) => (
        <div
          key={m.name}
          data-v-el
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
          className={`absolute w-[24cqw] -translate-x-1/2 -translate-y-1/2 rounded-[1.4cqw] border bg-navy-900 p-[1.6cqw] ${
            i === 1 ? "border-blue-500/60" : "border-white/10"
          }`}
        >
          <span className={`text-silver-200 ${t.sm}`}>{m.name}</span>
          <div className="mt-[1.2cqw] flex h-[4cqw] items-end gap-[0.6cqw]">
            {[40, 70, 55, 85, 60].map((h, j) => (
              <span
                key={j}
                style={{ height: `${h}%` }}
                className={`flex-1 rounded-[0.3cqw] ${i === 1 && j === 3 ? "bg-blue-500" : "bg-silver-400/30"}`}
              />
            ))}
          </div>
        </div>
      ))}
    </Frame>
  );
}

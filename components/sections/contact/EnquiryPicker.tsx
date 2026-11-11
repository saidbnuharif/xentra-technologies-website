"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { Mail } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { buttonClasses } from "@/components/ui/button-styles";

export type EnquiryOption = {
  value: string;
  label: string;
  /** Optgroup label, or null for the general option. */
  group: string | null;
  message: string;
  whatsappHref: string;
  mailtoHref: string | null;
};

/**
 * Contact page enquiry journey: choose a service → see the exact WhatsApp
 * message → open WhatsApp (or email) with it prefilled. All links are built
 * on the server; this component only switches between them. Without JS the
 * general enquiry (first option) still works. `?service=<slug>` preselects.
 */
const noSubscribe = () => () => {};
const readRequestedService = () => new URLSearchParams(window.location.search).get("service");
const noRequestOnServer = () => null;

export function EnquiryPicker({ options }: { options: readonly EnquiryOption[] }) {
  // The visitor's own choice (null until they pick something).
  const [choice, setChoice] = useState<string | null>(null);
  // ?service=… preselects (e.g. links from other pages). useSyncExternalStore
  // reads it safely: the server snapshot (null) is used during hydration, so
  // there is no mismatch, then the client value applies.
  const requested = useSyncExternalStore(noSubscribe, readRequestedService, noRequestOnServer);
  const selectId = useId();
  const messageId = useId();

  const isOption = (v: string | null): v is string => !!v && options.some((o) => o.value === v);
  const value = isOption(choice) ? choice : isOption(requested) ? requested : (options[0]?.value ?? "");
  const setValue = setChoice;

  const selected = options.find((o) => o.value === value) ?? options[0];
  const groups = [...new Set(options.map((o) => o.group).filter(Boolean))] as string[];

  return (
    // Glass panel (redesign P4). Logic above is unchanged.
    <div className="relative rounded-[1.5rem] border border-white/10 bg-[linear-gradient(160deg,rgb(255_255_255/0.07),rgb(255_255_255/0.02)_50%,rgb(47_107_255/0.07))] p-6 shadow-[0_40px_90px_-40px_rgb(47_107_255/0.55),inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-md sm:p-8">
      <label htmlFor={selectId} className="block font-mono text-label uppercase tracking-[0.18em] text-accent">
        Which service are you interested in?
      </label>
      <div className="relative mt-4">
        <select
          id={selectId}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-describedby={messageId}
          className="min-h-13 w-full appearance-none rounded-xl border border-white/15 bg-black/30 px-4 pr-11 text-body text-fg transition-[border-color,box-shadow] hover:border-blue-400/50 focus-visible:border-blue-400 focus-visible:shadow-[0_0_0_4px_rgb(47_107_255/0.18)]"
        >
          {options
            .filter((o) => o.group === null)
            .map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          {groups.map((group) => (
            <optgroup key={group} label={group}>
              {options
                .filter((o) => o.group === group)
                .map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        {/* Custom chevron (the native one is hidden by appearance-none). */}
        <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-fg-muted">
          <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="mt-6">
        <p className="font-mono text-label uppercase tracking-[0.18em] text-fg-muted">Your message</p>
        {/* Shown as an outgoing chat bubble; re-keyed so each change fades in. */}
        <div className="mt-3 flex justify-end">
          <p
            key={selected?.value}
            id={messageId}
            aria-live="polite"
            className="max-w-[34rem] animate-[xt-fade-up_0.35s_ease-out] rounded-2xl rounded-br-md border border-blue-400/30 bg-blue-500/15 px-4 py-3 text-body text-pretty text-fg shadow-[0_10px_30px_-14px_rgb(47_107_255/0.7)]"
          >
            {selected?.message}
          </p>
        </div>
        <p className="mt-2 text-sm text-fg-muted">You can edit it in WhatsApp before sending.</p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={selected?.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("primary", "lg", "sm:flex-1 hover:shadow-[0_0_0_3px_rgb(47_107_255/0.2),0_12px_30px_-8px_rgb(47_107_255/0.8)]")}
        >
          <WhatsAppIcon className="size-5" />
          Continue on WhatsApp
          <span className="sr-only"> (opens WhatsApp in a new tab)</span>
        </a>
        {selected?.mailtoHref ? (
          <a href={selected.mailtoHref} className={buttonClasses("secondary", "lg", "hover:border-blue-400/60")}>
            <Mail aria-hidden size={18} />
            Email instead
          </a>
        ) : null}
      </div>
    </div>
  );
}

import { whatsapp, whatsappHref } from "@/lib/content";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";

/**
 * Floating WhatsApp button, bottom-right on every page. Server component,
 * pure CSS (no JS). Sits below the navbar layer (z-40 vs z-50), respects the
 * iOS safe area, and keeps a 56px touch target. On hover/focus (desktop) a
 * label slides out so the icon's meaning is explicit.
 *
 * While the Contact section (and the footer below it) is on screen, it fades
 * out: those areas already show a full WhatsApp button, and the floating one
 * would duplicate it and cover the footer. MotionRoot sets data-hidden;
 * `invisible` also removes it from tab order and the accessibility tree.
 */
export function WhatsAppFloat() {
  const href = whatsappHref();
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${whatsapp.floatingLabel.text} (opens in a new tab)`}
      data-whatsapp-float
      className="group/wa fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 flex items-center transition-[opacity,translate,visibility] duration-300 ease-out data-[hidden=true]:invisible data-[hidden=true]:translate-y-3 data-[hidden=true]:opacity-0 sm:bottom-8 sm:right-8"
    >
      <span
        aria-hidden
        className="pointer-events-none mr-3 hidden translate-x-2 whitespace-nowrap rounded-md border border-white/10 bg-navy-950/95 px-3 py-2 text-sm font-medium text-silver-50 opacity-0 shadow-lg transition-[opacity,translate] duration-300 group-hover/wa:translate-x-0 group-hover/wa:opacity-100 group-focus-visible/wa:translate-x-0 group-focus-visible/wa:opacity-100 lg:block"
      >
        {whatsapp.ctaNav.text}
      </span>
      <span className="grid size-14 place-items-center rounded-full bg-blue-500 text-white shadow-[0_10px_30px_-8px_rgb(47_107_255/0.7),0_0_0_1px_rgb(255_255_255/0.08)] ring-4 ring-blue-500/15 transition-[background-color,translate,box-shadow] duration-300 group-hover/wa:-translate-y-0.5 group-hover/wa:bg-blue-600 group-active/wa:translate-y-0">
        <WhatsAppIcon className="size-7" />
      </span>
    </a>
  );
}

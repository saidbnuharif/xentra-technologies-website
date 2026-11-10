/*
 * Neutral, branded stand-in for a founder portrait until a genuine
 * photograph is supplied. Deliberately abstract — a line-drawn bust on a
 * navy field — so it can never be mistaken for a real person or identity.
 * Founders remain hidden in production until real profiles are approved.
 */
export function PortraitPlaceholder() {
  return (
    <div className="absolute inset-0 bg-linear-to-b from-navy-800 to-navy-950">
      {/* Fine grid, fading downward. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-size-[32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />
      <svg
        aria-hidden
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 size-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      >
        {/* Orbit rings */}
        <circle cx="200" cy="195" r="150" fill="none" stroke="var(--xt-silver-300)" strokeOpacity="0.12" strokeDasharray="3 6" />
        <path d="M95 110 A150 150 0 0 1 305 110" fill="none" stroke="var(--xt-blue-400)" strokeOpacity="0.7" strokeWidth="1.5" />
        {/* Abstract bust */}
        <circle cx="200" cy="195" r="62" fill="var(--xt-navy-700)" fillOpacity="0.55" stroke="var(--xt-silver-300)" strokeOpacity="0.35" strokeWidth="1.5" />
        <path
          d="M64 500 C70 380 130 312 200 312 C270 312 330 380 336 500"
          fill="var(--xt-navy-700)"
          fillOpacity="0.45"
          stroke="var(--xt-silver-300)"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <circle cx="305" cy="110" r="4" fill="var(--xt-blue-400)" />
      </svg>
      <p className="absolute bottom-5 left-5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-silver-300">
        Portrait to follow
      </p>
    </div>
  );
}

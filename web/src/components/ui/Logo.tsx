type LogoProps = {
  dark?: boolean;
  compact?: boolean;
};

export default function Logo({ dark = false, compact = false }: LogoProps) {
  const textColor = dark ? "#FFFFFF" : "var(--navy)";
  const subColor = dark ? "#aac4e0" : "var(--text-muted)";

  return (
    <div className="flex items-center gap-2.5">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <circle cx="22" cy="22" r="22" fill={dark ? "rgba(255,255,255,0.08)" : "var(--soft-blue)"} />
        <path
          d="M8 20 Q10 14 16 18 Q14 22 10 24 Q7 23 8 20Z"
          fill="var(--navy)"
          opacity="0.7"
        />
        <path
          d="M36 20 Q34 14 28 18 Q30 22 34 24 Q37 23 36 20Z"
          fill="var(--navy)"
          opacity="0.7"
        />
        <path
          d="M22 30 C22 30 12 23 12 17.5 C12 14.4 14.4 12 17.5 12 C19.2 12 20.8 12.9 22 14.2 C23.2 12.9 24.8 12 27.5 12 C30.6 12 33 14.4 33 17.5 C33 23 22 30 22 30Z"
          fill="var(--red)"
        />
      </svg>
      {!compact && (
        <div>
          <div className="leading-tight">
            <span
              className="serif text-base font-bold"
              style={{ color: textColor }}
            >
              Caring Angels
            </span>
          </div>
          <div className="leading-tight">
            <span
              className="text-xs font-medium tracking-wide"
              style={{ color: dark ? "#aac4e0" : "var(--navy)" }}
            >
              HOMECARE
            </span>
          </div>
          <div
            className="text-[0.55rem] tracking-wide"
            style={{ color: subColor, marginTop: "1px" }}
          >
            The Skill To Comfort · The Spirit To Care
          </div>
        </div>
      )}
    </div>
  );
}

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  accent?: boolean;
}

export default function SectionTitle({
  title,
  subtitle,
  accent = true,
}: SectionTitleProps) {
  return (
    <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
      {accent && (
        <div className="w-1 h-8 bg-gradient-to-b from-[var(--accent)] to-[var(--accent-dark)] rounded-full" />
      )}
      <div>
        <h2 className="text-xl md:text-2xl font-bold font-serif">{title}</h2>
        {subtitle && (
          <p className="text-sm text-[var(--muted)] mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

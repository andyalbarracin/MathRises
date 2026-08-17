export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-8">
      <h1 className="font-display text-2xl tracking-tight text-ink md:text-3xl">{title}</h1>
      {subtitle ? <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p> : null}
    </header>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center">
      {Icon ? <Icon className="mb-4 h-8 w-8 text-ink-muted" strokeWidth={1.6} /> : null}
      <p className="font-medium text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>
    </div>
  );
}

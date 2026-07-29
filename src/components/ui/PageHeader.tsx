import Link from "next/link";

export default function PageHeader({
  title,
  description,
  crumbs = [],
}: {
  title: string;
  description?: string;
  crumbs?: Array<{ name: string; path: string }>;
}) {
  return (
    <div className="border-b border-cream-200 bg-white/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="text-xs text-ink-400">
            <ol className="flex flex-wrap items-center gap-1.5">
              {crumbs.map((crumb, index) => (
                <li key={crumb.path} className="flex items-center gap-1.5">
                  {index > 0 ? <span aria-hidden="true">/</span> : null}
                  {index === crumbs.length - 1 ? (
                    <span className="text-ink-600">{crumb.name}</span>
                  ) : (
                    <Link
                      href={crumb.path}
                      className="transition hover:text-chilli-600"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <h1 className="mt-3 font-display text-3xl font-bold text-ink-900 sm:text-5xl">
          {title}
        </h1>

        {description ? (
          <p className="mt-3 max-w-2xl text-ink-500">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

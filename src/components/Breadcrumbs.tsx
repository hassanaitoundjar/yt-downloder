"use client";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs({
  items,
}: {
  items: BreadcrumbItem[];
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-xs text-slate-500 mb-4 px-4 sm:px-6 lg:px-8"
    >
      <ol className="flex flex-wrap items-center gap-2 text-slate-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.href}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <svg
                  className="w-3 h-3 text-slate-400 shrink-0"
                  width="12"
                  height="12"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {isLast ? (
                <span className="text-slate-900 font-medium">{item.label}</span>
              ) : (
                <a
                  href={item.href}
                  className="hover:text-slate-900 transition-colors"
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

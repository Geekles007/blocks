import { Separator } from '@/components/separator';
import type * as React from 'react';

/** Minimal className joiner so the block carries no extra dependency. */
function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface FooterLink {
  label: React.ReactNode;
  href: string;
}

export interface FooterColumn {
  /** Stable key; falls back to the index when omitted. */
  id?: string;
  /** Column heading (uppercase label). */
  title: string;
  links: FooterLink[];
}

export interface FooterSocial {
  /** Accessible name for the icon-only link. */
  label: string;
  href: string;
  /** Decorative glyph, rendered aria-hidden. */
  icon: React.ReactNode;
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Brand lockup / logo shown top-left (e.g. your wordmark). */
  brand: React.ReactNode;
  /** Short blurb under the brand. */
  description?: React.ReactNode;
  /** Link columns. */
  columns: FooterColumn[];
  /** Optional icon links (social). */
  social?: FooterSocial[];
  /** Bottom-bar copyright line. */
  copyright?: React.ReactNode;
  /** Optional legal / policy links in the bottom bar. */
  legal?: FooterLink[];
}

/**
 * A multi-column site footer: a brand block with a blurb and optional social
 * links, a set of labelled link columns, and a bottom bar with a copyright line
 * and optional legal links.
 *
 *   <Footer
 *     brand={<Logo />}
 *     description="Blocks you own, built on ibirdui."
 *     columns={[{ title: 'Product', links: [{ label: 'Catalogue', href: '/catalogue' }] }]}
 *     copyright="© 2025 ibirdui"
 *   />
 *
 * Renders a `footer` (contentinfo) landmark; each column is a labelled `nav` so
 * screen-reader users can jump between link groups, and icon-only social links
 * carry an accessible name. Built on the ibirdui `separator` primitive. Fully
 * responsive: the brand stacks above the columns on mobile and sits beside them
 * from `md` up.
 */
export function Footer({
  brand,
  description,
  columns,
  social,
  copyright,
  legal,
  className,
  ...rest
}: FooterProps) {
  const hasBottom = Boolean(copyright || (legal && legal.length > 0));

  return (
    <footer className={cn(className)} {...rest}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* brand */}
          <div className="max-w-xs">
            <div className="flex items-center">{brand}</div>
            {description ? (
              <p className="mt-4 text-pretty text-[14px] text-muted-foreground leading-relaxed">
                {description}
              </p>
            ) : null}
            {social && social.length > 0 ? (
              <ul className="mt-5 flex items-center gap-2">
                {social.map((s, i) => (
                  <li key={s.href ?? `social-${i}`}>
                    <a
                      href={s.href}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span aria-hidden="true">{s.icon}</span>
                      <span className="sr-only">{s.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col, i) => (
              <nav key={col.id ?? `col-${i}`} aria-label={col.title}>
                <div className="font-medium text-[12px] text-foreground uppercase tracking-wide">
                  {col.title}
                </div>
                <ul className="mt-3.5 space-y-2.5">
                  {col.links.map((l, j) => (
                    <li key={l.href ?? `link-${j}`}>
                      <a
                        href={l.href}
                        className="text-[14px] text-muted-foreground no-underline outline-none transition-colors hover:text-foreground focus-visible:underline"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {hasBottom ? (
          <>
            <Separator className="mt-10 mb-6" />
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              {copyright ? (
                <p className="text-[13px] text-muted-foreground">{copyright}</p>
              ) : (
                <span />
              )}
              {legal && legal.length > 0 ? (
                <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {legal.map((l, i) => (
                    <a
                      key={l.href ?? `legal-${i}`}
                      href={l.href}
                      className="text-[13px] text-muted-foreground no-underline outline-none transition-colors hover:text-foreground focus-visible:underline"
                    >
                      {l.label}
                    </a>
                  ))}
                </nav>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </footer>
  );
}

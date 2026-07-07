import { Cta } from '@/components/blocks/cta';
import { Faq } from '@/components/blocks/faq';
import { Features } from '@/components/blocks/features';
import { Footer } from '@/components/blocks/footer';
import { Hero } from '@/components/blocks/hero';
import { Navbar } from '@/components/blocks/navbar';
import { PricingToggle } from '@/components/blocks/pricing-toggle';
import { Testimonials } from '@/components/blocks/testimonials';
import type * as React from 'react';

/* -------------------------------------------------------------------- brand */

/** The 2×2 blocks mark — three neutral tiles + one accent tile. Self-contained. */
function BrandMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 512 512" aria-hidden="true" className="flex-none">
      <rect
        x="81.92"
        y="81.92"
        width="162.47"
        height="162.47"
        rx="43.55"
        className="fill-foreground"
      />
      <rect
        x="267.61"
        y="81.92"
        width="162.47"
        height="162.47"
        rx="43.55"
        className="fill-foreground"
      />
      <rect
        x="81.92"
        y="267.61"
        width="162.47"
        height="162.47"
        rx="43.55"
        className="fill-foreground"
      />
      <rect
        x="267.61"
        y="267.61"
        width="162.47"
        height="162.47"
        rx="43.55"
        className="fill-primary"
      />
    </svg>
  );
}

function Brand() {
  return (
    <span className="flex items-center gap-2">
      <BrandMark />
      <span className="font-semibold text-[15px] tracking-tight text-foreground">
        ibirdui <span className="text-primary">blocks</span>
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------- icons */

const glyph = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

const BoltIcon = () => (
  <svg {...glyph} aria-hidden="true" className="h-[22px] w-[22px]">
    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
  </svg>
);
const ShieldIcon = () => (
  <svg {...glyph} aria-hidden="true" className="h-[22px] w-[22px]">
    <path d="M12 3l7 3v5c0 4.4-3 7.3-7 8-4-.7-7-3.6-7-8V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const SwatchIcon = () => (
  <svg {...glyph} aria-hidden="true" className="h-[22px] w-[22px]">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4" />
  </svg>
);
const ArrowIcon = () => (
  <svg {...glyph} aria-hidden="true" className="h-[15px] w-[15px]">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[17px] w-[17px]">
    <path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.71 1.03 1.62 1.03 2.74 0 3.92-2.34 4.79-4.57 5.04.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.48A10.2 10.2 0 0 0 22 12.2C22 6.58 17.52 2 12 2z" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[17px] w-[17px]">
    <path d="M18.9 2H22l-7.5 8.57L23 22h-6.8l-5.32-6.96L4.8 22H1.66l8.03-9.17L1 2h6.98l4.8 6.36L18.9 2zm-1.2 18h1.9L7.4 4H5.4l12.3 16z" />
  </svg>
);

/* ------------------------------------------------------------------ content */

const NAV_LINKS = [
  { id: 'catalogue', label: 'Catalogue', href: '#catalogue' },
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'pricing', label: 'Pricing', href: '#pricing' },
  { id: 'faq', label: 'FAQ', href: '#faq' },
];

const FEATURES = [
  {
    id: 'install',
    icon: <BoltIcon />,
    title: 'One-command install',
    description:
      '“ibirdui add” copies the block and every primitive it composes straight into your repo.',
  },
  {
    id: 'a11y',
    icon: <ShieldIcon />,
    title: 'Accessible by default',
    description:
      'Real landmarks, keyboard support and reduced-motion — tested to WCAG AA on every block.',
  },
  {
    id: 'theme',
    icon: <SwatchIcon />,
    title: 'Themed with your tokens',
    description:
      'Blocks read semantic HSL tokens, so they wear your brand in light or dark with zero edits.',
  },
];

const TESTIMONIALS = [
  {
    id: 't1',
    rating: 5,
    quote:
      '“The hero, pricing and FAQ blocks dropped straight into our app — I had a launch page live before lunch, motion and all.”',
    author: { name: 'Mara Voss', role: 'Design Engineer · Cadence' },
  },
  {
    id: 't2',
    rating: 5,
    quote:
      '“One command and the source is mine. No black-box components, no upgrade dread — I read it, tweak it, ship it.”',
    author: { name: 'Diego Herrera', role: 'Founder · Fathom' },
  },
  {
    id: 't3',
    rating: 5,
    quote:
      '“Accessibility used to eat a whole sprint. With ibirdui the landmarks, focus and reduced-motion are already there.”',
    author: { name: 'Priya Nair', role: 'Frontend Lead · Northwind' },
  },
];

const PLANS = [
  {
    name: 'Personal',
    monthlyPrice: '$9',
    annualPrice: '$7',
    description: 'For solo builders.',
    features: ['Every block, forever', 'Light & dark themes', 'MIT licensed'],
    action: { label: 'Get Personal', href: '#' },
  },
  {
    name: 'Pro',
    monthlyPrice: '$19',
    annualPrice: '$15',
    featured: true,
    description: 'The team favourite.',
    features: ['Everything in Personal', 'Priority updates', 'Private Figma kit', 'Email support'],
    action: { label: 'Get Pro', href: '#' },
  },
  {
    name: 'Team',
    monthlyPrice: '$49',
    annualPrice: '$39',
    description: 'For growing teams.',
    features: ['Everything in Pro', 'Seat management', 'Design review calls', 'SLA'],
    action: { label: 'Get Team', href: '#' },
  },
];

const FAQ_ITEMS = [
  {
    id: 'own',
    question: 'Do I own the code?',
    answer:
      'Yes. One command copies the block and every primitive it composes into your repo — you keep and edit the source, with no runtime dependency.',
  },
  {
    id: 'a11y',
    question: 'Is it accessible out of the box?',
    answer:
      'Every block is AA-tested: real landmarks and headings, keyboard support, and prefers-reduced-motion respected.',
  },
  {
    id: 'theme',
    question: 'Can I use my own theme?',
    answer:
      'Blocks read semantic HSL tokens, so they wear your brand in light or dark by changing a few CSS variables — no block edits needed.',
  },
  {
    id: 'updates',
    question: 'How do updates work?',
    answer:
      'Blocks are versioned individually in the registry; re-run the add command to pull a newer version whenever you want.',
  },
];

const FOOTER_COLUMNS = [
  {
    id: 'product',
    title: 'Product',
    links: [
      { label: 'Catalogue', href: '#' },
      { label: 'Morphing', href: '#' },
      { label: 'Templates', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    id: 'resources',
    title: 'Resources',
    links: [
      { label: 'Guide', href: '#' },
      { label: 'Themes', href: '#' },
      { label: 'block-motion', href: '#' },
    ],
  },
  {
    id: 'company',
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  },
];

/* ------------------------------------------------------------------- layout */

/**
 * A complete SaaS landing page, composed entirely from ibirdui blocks: a sticky
 * Navbar, a Hero, a Features grid, Testimonials, a Pricing toggle, an FAQ, a CTA
 * band and a Footer. Every section is a real, accessible, themable block — this
 * page is just their arrangement, so a single `h1` (the hero) leads a clean
 * heading outline and the banner/contentinfo landmarks bracket the page.
 *
 * Swap the content constants above for your own; the blocks and their motion,
 * a11y and theming come along for free.
 */
export function SaasLanding(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <Navbar
        brand={<Brand />}
        brandHref="#"
        links={NAV_LINKS}
        secondaryAction={{ label: 'Sign in', href: '#' }}
        primaryAction={{ label: 'Get started', href: '#' }}
      />

      <main>
        {/* Hero, set in a pool of light: a soft accent glow behind the headline and
            a grid that fades out at the edges, so the fold reads as one focal point. */}
        <div className="relative isolate overflow-hidden">
          <div aria-hidden="true" className="-z-10 pointer-events-none absolute inset-0">
            <div
              className="absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
                maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)',
              }}
            />
            <div className="-translate-x-1/2 absolute top-[-16%] left-1/2 h-[420px] w-[min(880px,110%)] rounded-full bg-primary/20 blur-[130px]" />
          </div>
          <Hero
            className="px-6 py-24 sm:py-32"
            eyebrow="New · block-motion v1"
            title={
              <>
                Blocks that <span className="text-primary">move</span> just right.
              </>
            }
            subtitle="Accessible, morph-animated sections you paste and own — built on the ibirdui primitives, orchestrated by one motion grammar."
            primaryAction={{ label: 'Browse blocks', href: '#', icon: <ArrowIcon /> }}
            secondaryAction={{ label: 'Copy the code', href: '#' }}
            socialProof={{
              people: [{ name: 'Ada Reyes' }, { name: 'Tom Iverson' }, { name: 'Lou Park' }],
              caption: 'Trusted by 2,000+ product teams',
            }}
          />
        </div>

        <Features
          id="features"
          className="scroll-mt-16 border-border border-t bg-muted/30 px-6 py-20 sm:py-28"
          eyebrow="Why teams switch"
          title="Everything you need to ship."
          subtitle="Real, composable sections built on the ibirdui primitives — install one, keep the source."
          features={FEATURES}
          columns={3}
        />

        <Testimonials
          className="px-6 py-20 sm:py-28"
          eyebrow="Social proof"
          title="Loved by product teams."
          subtitle="Designers and engineers ship their marketing and app UI faster with ibirdui blocks."
          testimonials={TESTIMONIALS}
          columns={3}
        />

        <PricingToggle
          id="pricing"
          className="scroll-mt-16 border-border border-t bg-muted/30 px-6 py-20 sm:py-28"
          title="Simple, honest pricing."
          subtitle="Every block, forever. Switch to annual for two months free."
          annualHint="−20%"
          plans={PLANS}
        />

        <Faq
          id="faq"
          className="scroll-mt-16 px-6 py-20 sm:py-28"
          eyebrow="Support"
          title="Frequently asked questions"
          subtitle="Everything you might want to know before you copy your first block."
          items={FAQ_ITEMS}
        />

        <Cta
          className="px-6 py-16 sm:py-20"
          eyebrow="Start today"
          title="Ready to ship faster?"
          subtitle="Copy your first block in under a minute — accessible, animated, and yours to keep."
          primaryAction={{ label: 'Get started', href: '#', icon: <ArrowIcon /> }}
          secondaryAction={{ label: 'Browse blocks', href: '#' }}
        />
      </main>

      <Footer
        className="border-border border-t px-6 py-14"
        brand={<Brand />}
        description="Blocks you own, built on the ibirdui primitives. Copy one command, keep the code."
        columns={FOOTER_COLUMNS}
        social={[
          { label: 'GitHub', href: '#', icon: <GithubIcon /> },
          { label: 'X', href: '#', icon: <XIcon /> },
        ]}
        copyright="© 2025 ibirdui — MIT licensed"
        legal={[
          { label: 'Privacy', href: '#' },
          { label: 'Terms', href: '#' },
        ]}
      />
    </div>
  );
}

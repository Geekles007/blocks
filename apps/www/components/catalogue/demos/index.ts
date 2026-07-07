'use client';

// Registry hub for the catalogue block demos + full-page template previews.
// One file per block lives alongside this index; adding a demo means creating
// its file and registering it here. Each entry mounts the REAL ibirdui block
// synced into registry-preview — there are no design mockups.
import { SaasLanding } from '@/components/blocks/saas-landing';
import type * as React from 'react';
import { h } from '~/lib/h';
import type { PreviewProps } from './_shared';
import { CtaReal } from './cta';
import { FaqReal } from './faq';
import { FeaturesReal } from './features';
import { FooterReal } from './footer';
import { HeroReal } from './hero';
import { HeroAgencyReal } from './hero-agency';
import { HeroFintechReal } from './hero-fintech';
import { HeroTerminalReal } from './hero-terminal';
import { NavbarReal } from './navbar';
import { PricingReal } from './pricing';
import { PricingCompareReal } from './pricing-compare';
import { PricingSingleReal } from './pricing-single';
import { PricingToggleReal } from './pricing-toggle';
import { TestimonialsReal } from './testimonials';

export type { PreviewProps } from './_shared';

const PREVIEWS: Record<string, (p: PreviewProps) => React.ReactElement> = {
  hero: HeroReal,
  'hero-terminal': HeroTerminalReal,
  'hero-fintech': HeroFintechReal,
  'hero-agency': HeroAgencyReal,
  features: FeaturesReal,
  testimonials: TestimonialsReal,
  cta: CtaReal,
  faq: FaqReal,
  navbar: NavbarReal,
  footer: FooterReal,
  pricing: PricingReal,
  'pricing-toggle': PricingToggleReal,
  'pricing-single': PricingSingleReal,
  'pricing-compare': PricingCompareReal,
};

/** Render the live preview for a block key, or `null` if none is registered. */
export function renderPreview(key: string, props: PreviewProps): React.ReactElement | null {
  const Cmp = PREVIEWS[key];
  return Cmp ? h(Cmp, props) : null;
}

// Full-page templates render the real composed block (self-contained content),
// keyed by the template's registryKey.
const TEMPLATE_PREVIEWS: Record<string, () => React.ReactElement> = {
  'saas-landing': () => h(SaasLanding, null),
};

/** Render the live full-page preview for a template key, or `null`. */
export function renderTemplatePreview(key: string): React.ReactElement | null {
  const Cmp = TEMPLATE_PREVIEWS[key];
  return Cmp ? h(Cmp) : null;
}

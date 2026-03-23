/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';
import { token, alpha } from '../lib/tokens.js';

const Industry: FC<LayoutProps> = (props) => {
  const { content, themeSettings } = props;
  const fields = content.fields;

  return (
    <Base {...props}>
      {/* Hero */}
      <section class="relative overflow-hidden py-28 text-white" style={{ backgroundColor: token.navy }}>
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 70%, ${alpha(token.primary, 6)} 0%, transparent 50%)` }} />
        <div class="relative mx-auto max-w-4xl px-6">
          <p class="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Industries We Staff</p>
          <h1 class="text-4xl font-extrabold tracking-[-0.03em] leading-[1.1] sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>
          {fields.short_description && (
            <p class="mt-8 max-w-2xl text-lg leading-relaxed text-gray-300/90">
              {fields.short_description}
            </p>
          )}
        </div>
      </section>

      {/* Challenges */}
      {fields.challenges && Array.isArray(fields.challenges) && fields.challenges.length > 0 && (
        <section class="py-24">
          <div class="mx-auto max-w-5xl px-6">
            <h2 class="mb-4 text-3xl font-bold tracking-[-0.02em] text-slate-900">Workforce Challenges</h2>
            <p class="mb-12 text-lg text-slate-500">The hiring problems keeping leaders in this space up at night</p>
            <div class="grid gap-6 sm:grid-cols-2">
              {fields.challenges.map((challenge: string) => (
                <div class="group rounded-2xl border border-gray-100 bg-white p-8 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50">
                  <div class="mb-4 h-1 w-8 rounded transition-all duration-300 group-hover:w-12" style={{ backgroundColor: token.primary }} />
                  <p class="leading-relaxed text-slate-600">{challenge}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Solutions */}
      {fields.solutions && Array.isArray(fields.solutions) && fields.solutions.length > 0 && (
        <section class="border-t border-gray-100 bg-slate-50 py-24">
          <div class="mx-auto max-w-5xl px-6">
            <h2 class="mb-4 text-3xl font-bold tracking-[-0.02em] text-slate-900">Our Staffing Solutions</h2>
            <p class="mb-16 text-lg text-slate-500">Proven hiring approaches tailored to your sector</p>
            <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {fields.solutions.map((solution: { title: string; description?: string; url?: string }) => (
                <div class="group rounded-2xl border border-gray-100 bg-white p-8 transition-all duration-300 hover:border-amber-200 hover:shadow-lg hover:shadow-slate-200/50">
                  <h3 class="mb-3 text-lg font-semibold tracking-[-0.01em] text-slate-900">{solution.title}</h3>
                  {solution.description && (
                    <p class="text-sm leading-relaxed text-slate-500">{solution.description}</p>
                  )}
                  {solution.url && (
                    <a href={solution.url} class="mt-4 inline-flex items-center gap-1 text-sm font-medium transition-colors hover:no-underline" style={{ color: token.primary }}>
                      Learn more
                      <span class="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Compliance */}
      {fields.compliance && Array.isArray(fields.compliance) && fields.compliance.length > 0 && (
        <section class="py-24">
          <div class="mx-auto max-w-5xl px-6">
            <h2 class="mb-12 text-3xl font-bold tracking-[-0.02em] text-slate-900">Compliance & Accreditations</h2>
            <div class="flex flex-wrap gap-4">
              {fields.compliance.map((badge: string) => (
                <span class="rounded-xl border-2 px-6 py-3 text-sm font-semibold transition-all duration-200 hover:shadow-md" style={{ borderColor: token.primary, color: token.primary }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Body */}
      {content.bodyHtml && (
        <section class="border-t border-gray-100 py-20">
          <div class="mx-auto max-w-3xl px-6">
            <div class="prose prose-lg prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: content.bodyHtml }} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section class="relative overflow-hidden py-24 text-white" style={{ backgroundColor: token.navy }}>
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${alpha(token.primary, 7)} 0%, transparent 60%)` }} />
        <div class="relative mx-auto max-w-3xl px-6 text-center">
          <h2 class="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Partner with staffing experts</h2>
          <p class="mt-6 text-lg text-gray-300/90">We understand the unique workforce challenges of your sector. Let's solve them together.</p>
          <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="/contact" class="inline-block rounded-lg px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:no-underline" style={{ backgroundColor: token.primary }}>
              Discuss Your Workforce Needs
            </a>
            <a href="/case-studies" class="inline-block rounded-lg border border-white/20 px-8 py-3.5 text-sm font-semibold text-white/90 transition-all duration-200 hover:border-white/50 hover:text-white hover:no-underline">
              See Success Stories
            </a>
          </div>
        </div>
      </section>

      {props.children}
    </Base>
  );
};

export default Industry;

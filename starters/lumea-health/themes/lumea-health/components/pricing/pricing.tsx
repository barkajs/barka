/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';
import { token } from '../../lib/tokens.js';

const spacingMap: Record<string, string> = {
  none: 'py-0', small: 'py-8', medium: 'py-16', large: 'py-24', xlarge: 'py-32',
};
const widthMap: Record<string, string> = {
  contained: 'max-w-6xl mx-auto px-6', wide: 'max-w-7xl mx-auto px-6', full: 'w-full px-6',
};

const Pricing: FC<SectionProps> = ({ data, settings }) => {
  if (settings.hidden) return null;

  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const width = widthMap[settings.width] ?? widthMap.contained;
  const plans: Array<{
    name: string; price: string; period?: string; description?: string;
    features?: string; cta_text?: string; cta_url?: string; highlighted?: boolean;
  }> = data.plans ?? [];

  const cols = plans.length <= 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section class={`${spacing} ${settings.css_class ?? ''}`} id={settings.anchor_id}>
      <div class={width}>
        {data.heading && (
          <h2 class="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            {data.heading}
          </h2>
        )}
        {data.subheading && (
          <p class="mx-auto mb-12 max-w-2xl text-center text-lg" style={{ color: 'var(--color-muted)' }}>{data.subheading}</p>
        )}

        <div class={`grid gap-8 items-stretch ${cols}`}>
          {plans.map((plan) => {
            const featureList = (plan.features ?? '').split('\n').map(f => f.trim()).filter(Boolean);
            const isHighlighted = plan.highlighted;

            return (
              <div
                class="relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  borderRadius: '20px',
                  border: isHighlighted ? `2px solid var(--color-primary)` : '1px solid var(--color-border)',
                  backgroundColor: isHighlighted ? '#fff' : 'var(--color-cream)',
                  boxShadow: isHighlighted
                    ? '0 20px 60px -15px rgba(74,124,89,0.25)'
                    : '0 4px 20px -5px rgba(0,0,0,0.06)',
                  transform: isHighlighted ? 'scale(1.03)' : undefined,
                }}
              >
                {isHighlighted && (
                  <div
                    class="absolute top-0 left-0 right-0 py-2 text-center text-xs font-bold uppercase tracking-widest text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Most Popular
                  </div>
                )}

                <div class={`flex flex-col flex-1 p-8 ${isHighlighted ? 'pt-14' : ''}`}>
                  <h3 class="text-xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                    {plan.name}
                  </h3>

                  <div class="mt-4 flex items-baseline gap-1">
                    <span class="text-5xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span class="text-base font-medium" style={{ color: 'var(--color-muted)' }}>
                        {plan.period}
                      </span>
                    )}
                  </div>

                  {plan.description && (
                    <p class="mt-3 text-sm" style={{ color: 'var(--color-muted)' }}>{plan.description}</p>
                  )}

                  <div class="my-6 h-px" style={{ backgroundColor: 'var(--color-border)' }} />

                  {featureList.length > 0 && (
                    <ul class="flex-1 space-y-3">
                      {featureList.map((feature) => (
                        <li class="flex items-start gap-3 text-sm" style={{ color: 'var(--color-text)' }}>
                          <svg class="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {plan.cta_text && (
                    <a
                      href={plan.cta_url ?? '#'}
                      class="mt-8 block py-3.5 text-center text-sm font-semibold transition-all duration-200 hover:no-underline"
                      style={{
                        borderRadius: '14px',
                        backgroundColor: isHighlighted ? 'var(--color-primary)' : 'transparent',
                        color: isHighlighted ? '#fff' : 'var(--color-primary)',
                        border: isHighlighted ? 'none' : '2px solid var(--color-primary)',
                        ...(isHighlighted ? { boxShadow: '0 8px 24px -8px rgba(74,124,89,0.4)' } : {}),
                      }}
                    >
                      {plan.cta_text}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

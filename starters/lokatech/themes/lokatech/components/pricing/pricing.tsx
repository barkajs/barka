/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';

const spacingMap: Record<string, string> = {
  none: 'py-0',
  small: 'py-8',
  medium: 'py-16',
  large: 'py-24',
  xlarge: 'py-32',
};

const widthMap: Record<string, string> = {
  contained: 'max-w-6xl mx-auto px-6',
  wide: 'max-w-7xl mx-auto px-6',
  full: 'w-full px-6',
};

const bgMap: Record<string, string> = {
  light: 'bg-slate-50 text-slate-900',
  dark: 'text-white',
  primary: 'text-white',
  custom: '',
};

const Pricing: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  if (settings.hidden) return null;

  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const width = widthMap[settings.width] ?? widthMap.contained;
  const bg = bgMap[settings.background] ?? bgMap.light;
  const primaryColor = themeSettings.primary_color ?? '#10B981';
  const navColor = themeSettings.nav_color ?? '#0B1222';
  const plans: Array<{
    name: string;
    price: string;
    period?: string;
    description?: string;
    features?: string;
    cta_text?: string;
    cta_url?: string;
    highlighted?: boolean;
  }> = data.plans ?? [];

  const bgStyle: Record<string, string> = {};
  if (settings.background === 'dark') {
    bgStyle.backgroundColor = navColor;
  } else if (settings.background === 'primary') {
    bgStyle.backgroundColor = primaryColor;
  } else if (settings.background === 'custom' && settings.background_color) {
    bgStyle.backgroundColor = settings.background_color;
  }

  const isDark = settings.background === 'dark' || settings.background === 'primary';
  const cols = plans.length <= 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section
      class={`${spacing} ${bg} ${settings.css_class ?? ''}`}
      id={settings.anchor_id}
      style={Object.keys(bgStyle).length > 0 ? bgStyle : undefined}
    >
      <div class={width}>
        {data.heading && (
          <h2 class="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            {data.heading}
          </h2>
        )}
        {data.subheading && (
          <p class={`mx-auto mb-12 max-w-2xl text-center text-lg ${isDark ? 'text-gray-300' : 'text-slate-500'}`}>
            {data.subheading}
          </p>
        )}

        <div class={`grid gap-8 ${cols}`}>
          {plans.map((plan) => {
            const featureList = (plan.features ?? '')
              .split('\n')
              .map((f) => f.trim())
              .filter(Boolean);
            const isHighlighted = plan.highlighted;

            return (
              <div
                class={`relative flex flex-col rounded-2xl border p-8 shadow-sm transition-shadow hover:shadow-md ${
                  isHighlighted
                    ? 'border-2 scale-105'
                    : isDark
                      ? 'border-gray-700 bg-white/5'
                      : 'border-gray-200 bg-white'
                }`}
                style={isHighlighted ? { borderColor: primaryColor, backgroundColor: isDark ? 'rgba(16,185,129,0.08)' : '#fff' } : undefined}
              >
                {isHighlighted && (
                  <div
                    class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {data.highlighted_label ?? 'Popular'}
                  </div>
                )}

                <h3 class={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>

                <div class="mt-4 flex items-baseline">
                  <span class={`text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span class={`ml-1 text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      /{plan.period}
                    </span>
                  )}
                </div>

                {plan.description && (
                  <p class={`mt-3 text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    {plan.description}
                  </p>
                )}

                {featureList.length > 0 && (
                  <ul class="mt-6 flex-1 space-y-3">
                    {featureList.map((feature) => (
                      <li class={`flex items-start gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                        <svg class="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {plan.cta_text && (
                  <a
                    href={plan.cta_url ?? '#'}
                    class={`mt-8 block rounded-lg py-3 text-center text-sm font-semibold transition-all hover:no-underline ${
                      isHighlighted
                        ? 'text-white shadow-lg hover:brightness-110'
                        : isDark
                          ? 'border border-gray-600 text-white hover:border-gray-400'
                          : 'border border-gray-300 text-slate-900 hover:border-gray-400'
                    }`}
                    style={isHighlighted ? { backgroundColor: primaryColor } : undefined}
                  >
                    {plan.cta_text}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

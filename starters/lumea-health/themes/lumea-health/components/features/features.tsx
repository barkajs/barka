/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';
import { token } from '../../lib/tokens.js';

const spacingMap: Record<string, string> = {
  none: 'py-0', small: 'py-12', medium: 'py-16', large: 'py-20', xlarge: 'py-28',
};

const iconMap: Record<string, string> = {
  heart: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  activity: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  eye: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  baby: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  bone: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 10c.7-.7 1.7-1 2.5-1a3.5 3.5 0 0 1 0 7c-.8 0-1.8-.3-2.5-1"/><path d="M7 10c-.7-.7-1.7-1-2.5-1a3.5 3.5 0 0 0 0 7c.8 0 1.8-.3 2.5-1"/><path d="M7 10h10v5H7z"/></svg>',
  brain: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 1 4 4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2a4 4 0 0 1 4-4z"/><path d="M8 8v2c0 2.2 1.8 4 4 4s4-1.8 4-4V8"/><path d="M6 14c-1.7 1-3 3-3 5v1h18v-1c0-2-1.3-4-3-5"/></svg>',
  shield: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  stethoscope: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6h.7"/><path d="M19 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>',
  users: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  zap: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  thermometer: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>',
  clipboard: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
};

const Features: FC<SectionProps> = ({ data, settings }) => {
  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const cols = data.columns ?? '3';
  const gridCols = cols === '4' ? 'lg:grid-cols-4' : cols === '2' ? 'lg:grid-cols-2' : 'lg:grid-cols-3';
  const items: any[] = data.items ?? [];
  const bg = settings.background === 'dark' ? { backgroundColor: token.navy, color: 'white' }
    : settings.background === 'primary' ? { backgroundColor: token.primary, color: 'white' }
    : { backgroundColor: token.cream };

  return (
    <section class={`${spacing} ${settings.css_class ?? ''}`} id={settings.anchor_id} style={bg}>
      <div class="mx-auto max-w-6xl px-6">
        {data.heading && (
          <div class="text-center mb-12">
            <h2 class="text-3xl sm:text-4xl" style={{ fontFamily: token.fontHeading }}>{data.heading}</h2>
            {data.subheading && <p class="mt-3 mx-auto max-w-2xl text-base" style={{ color: token.muted }}>{data.subheading}</p>}
          </div>
        )}
        <div class={`grid gap-6 sm:grid-cols-2 ${gridCols}`}>
          {items.map((item: any) => (
            <div class="mv-card p-8 text-center">
              {item.icon && iconMap[item.icon] && (
                <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: token.primaryLight, color: token.primary }}>
                  <span dangerouslySetInnerHTML={{ __html: iconMap[item.icon] }} />
                </div>
              )}
              <h3 class="text-xl mb-2" style={{ fontFamily: token.fontHeading }}>{item.title}</h3>
              <p class="text-sm leading-relaxed" style={{ color: token.muted }} dangerouslySetInnerHTML={{ __html: item.description }} />
              {item.href && (
                <a href={item.href} class="mt-3 inline-block text-sm font-medium hover:no-underline" style={{ color: token.accent }}>
                  Learn more &rarr;
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

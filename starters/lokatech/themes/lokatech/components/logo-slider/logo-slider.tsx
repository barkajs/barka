/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';

const spacingMap: Record<string, string> = {
  none: 'py-0',
  small: 'py-10',
  medium: 'py-16',
  large: 'py-24',
  xlarge: 'py-32',
};

const bgMap: Record<string, string> = {
  light: 'bg-white text-slate-900',
  dark: 'text-white',
  primary: 'text-white',
  custom: '',
};

const LogoSlider: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  if (settings.hidden) return null;

  const spacing = spacingMap[settings.spacing] ?? spacingMap.medium;
  const bg = bgMap[settings.background] ?? bgMap.light;
  const primaryColor = themeSettings.primary_color ?? '#10B981';
  const navColor = themeSettings.nav_color ?? '#0B1222';
  const items: Array<{ image?: string; src?: string; alt?: string; url?: string }> =
    data.items ?? [];

  const bgStyle: Record<string, string> = {};
  if (settings.background === 'dark') {
    bgStyle.backgroundColor = navColor;
  } else if (settings.background === 'primary') {
    bgStyle.backgroundColor = primaryColor;
  } else if (settings.background === 'custom' && settings.background_color) {
    bgStyle.backgroundColor = settings.background_color;
  }

  const renderLogo = (item: typeof items[0], idx: number) => {
    const imgSrc = item.image ?? item.src;
    const img = imgSrc ? (
      <img
        src={imgSrc}
        alt={item.alt ?? ''}
        class="h-10 max-w-[140px] object-contain opacity-40 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
        loading="lazy"
      />
    ) : (
      <span class="text-sm font-medium text-slate-300">{item.alt ?? ''}</span>
    );

    return item.url ? (
      <a href={item.url} target="_blank" rel="noopener noreferrer" class="mx-8 shrink-0 hover:no-underline">
        {img}
      </a>
    ) : (
      <div class="mx-8 shrink-0">{img}</div>
    );
  };

  return (
    <section
      class={`${spacing} ${bg} ${settings.css_class ?? ''}`}
      id={settings.anchor_id}
      style={Object.keys(bgStyle).length > 0 ? bgStyle : undefined}
    >
      {data.heading && (
        <p class="mb-10 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {data.heading}
        </p>
      )}

      <div class="logo-marquee-wrap">
        <div class="logo-marquee">
          {items.map(renderLogo)}
          {items.map(renderLogo)}
        </div>
      </div>
    </section>
  );
};

export default LogoSlider;

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
  contained: 'max-w-4xl mx-auto px-6',
  wide: 'max-w-6xl mx-auto px-6',
  full: 'w-full px-6',
};

const bgMap: Record<string, string> = {
  light: 'bg-white text-slate-900',
  dark: 'text-white',
  primary: 'text-white',
  custom: '',
};

function toEmbedUrl(url: string): string | null {
  if (!url) return null;

  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  if (url.includes('/embed/') || url.includes('player.vimeo.com')) return url;

  return null;
}

const Video: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  if (settings.hidden) return null;

  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const width = widthMap[settings.width] ?? widthMap.contained;
  const bg = bgMap[settings.background] ?? bgMap.light;
  const primaryColor = themeSettings.primary_color ?? '#10B981';
  const navColor = themeSettings.nav_color ?? '#0B1222';

  const bgStyle: Record<string, string> = {};
  if (settings.background === 'dark') {
    bgStyle.backgroundColor = navColor;
  } else if (settings.background === 'primary') {
    bgStyle.backgroundColor = primaryColor;
  } else if (settings.background === 'custom' && settings.background_color) {
    bgStyle.backgroundColor = settings.background_color;
  }

  const isDark = settings.background === 'dark' || settings.background === 'primary';
  const embedUrl = toEmbedUrl(data.video_url ?? '');

  return (
    <section
      class={`${spacing} ${bg} ${settings.css_class ?? ''}`}
      id={settings.anchor_id}
      style={Object.keys(bgStyle).length > 0 ? bgStyle : undefined}
    >
      <div class={width}>
        {data.heading && (
          <h2 class="mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            {data.heading}
          </h2>
        )}

        {embedUrl ? (
          <div class="relative overflow-hidden rounded-xl shadow-lg" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={embedUrl}
              title={data.heading ?? 'Video'}
              class="absolute inset-0 h-full w-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
        ) : (
          <p class={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-slate-400'}`}>
            No video URL provided.
          </p>
        )}

        {data.caption && (
          <p class={`mt-4 text-center text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            {data.caption}
          </p>
        )}
      </div>
    </section>
  );
};

export default Video;

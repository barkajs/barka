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
  contained: 'max-w-2xl mx-auto px-6',
  wide: 'max-w-4xl mx-auto px-6',
  full: 'w-full px-6',
};

const bgMap: Record<string, string> = {
  light: 'bg-white text-slate-900',
  dark: 'text-white',
  primary: 'text-white',
  custom: '',
};

const Form: FC<SectionProps> = ({ data, settings, themeSettings }) => {
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
  const inputClasses = isDark
    ? 'w-full rounded-lg border border-gray-600 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400'
    : 'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-slate-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500';

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
        {data.description && (
          <p class={`mb-10 text-center text-lg ${isDark ? 'text-gray-300' : 'text-slate-500'}`}>
            {data.description}
          </p>
        )}

        <form
          action={data.action_url ?? '#'}
          method="post"
          class="space-y-6"
        >
          <div class="grid gap-6 sm:grid-cols-2">
            <div>
              <label for="form-name" class="mb-1 block text-sm font-medium">Name</label>
              <input
                id="form-name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                class={inputClasses}
              />
            </div>
            <div>
              <label for="form-email" class="mb-1 block text-sm font-medium">Email</label>
              <input
                id="form-email"
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                class={inputClasses}
              />
            </div>
          </div>

          <div>
            <label for="form-company" class="mb-1 block text-sm font-medium">Company</label>
            <input
              id="form-company"
              name="company"
              type="text"
              placeholder="Your company"
              class={inputClasses}
            />
          </div>

          <div>
            <label for="form-message" class="mb-1 block text-sm font-medium">Message</label>
            <textarea
              id="form-message"
              name="message"
              rows={5}
              required
              placeholder="How can we help?"
              class={inputClasses}
            />
          </div>

          <div class="text-center">
            <button
              type="submit"
              class="inline-block rounded-lg px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110"
              style={{ backgroundColor: primaryColor }}
            >
              {data.button_text ?? 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Form;

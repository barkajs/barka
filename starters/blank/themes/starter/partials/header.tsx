/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SiteConfig, ThemeConfig } from '../_types.js';
import { token } from '../lib/tokens.js';

interface HeaderProps {
  site: SiteConfig;
  theme: ThemeConfig;
  themeSettings: Record<string, any>;
}

const Header: FC<HeaderProps> = ({ site, themeSettings }) => {
  return (
    <header class="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" class="text-xl font-bold tracking-tight" style={{ color: token.primary }}>
          {themeSettings.logo
            ? <img src={themeSettings.logo} alt={site.site_name} class="h-8" />
            : site.site_name}
        </a>
        <ul class="flex items-center gap-8 text-sm font-medium text-gray-600">
          <li><a href="/" class="hover:text-gray-900 transition-colors">Home</a></li>
          <li><a href="/articles" class="hover:text-gray-900 transition-colors">Articles</a></li>
          <li><a href="/pages" class="hover:text-gray-900 transition-colors">Pages</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SiteConfig, ThemeConfig } from '../_types.js';

interface FooterProps {
  site: SiteConfig;
  theme: ThemeConfig;
  themeSettings: Record<string, any>;
}

const Footer: FC<FooterProps> = ({ site, themeSettings }) => {
  return (
    <footer class="border-t border-gray-100 bg-gray-50">
      <div class="mx-auto max-w-6xl px-6 py-10 text-center text-sm text-gray-500">
        <p>{themeSettings.footer_text ?? 'Powered by Barka CMS'}</p>
        <p class="mt-1">&copy; {new Date().getFullYear()} {site.site_name}</p>
      </div>
    </footer>
  );
};

export default Footer;

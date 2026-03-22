/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SiteConfig, ThemeConfig } from '../_types.js';

interface HeaderProps {
  site: SiteConfig;
  theme: ThemeConfig;
  themeSettings: Record<string, any>;
}

const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Industries', href: '/industries' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Insights', href: '/articles' },
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '/careers' },
];

const Header: FC<HeaderProps> = ({ site, themeSettings }) => {
  const primaryColor = themeSettings.primary_color ?? '#F59E0B';
  const navColor = themeSettings.nav_color ?? '#14101E';

  return (
    <header class="sticky top-0 z-50" style={{ backgroundColor: navColor }}>
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" class="flex items-center gap-2">
          {themeSettings.logo
            ? <img src={themeSettings.logo} alt={site.site_name} class="h-8" />
            : <span class="text-xl font-bold tracking-tight text-white">{site.site_name}</span>}
        </a>
        <ul class="hidden items-center gap-8 text-sm font-medium text-gray-300 md:flex">
          {navLinks.map((link) => (
            <li>
              <a href={link.href} class="transition-colors hover:text-white hover:no-underline">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="/contact"
          class="hidden rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 hover:no-underline md:inline-block"
          style={{ backgroundColor: primaryColor }}
        >
          Contact Us
        </a>
      </nav>
    </header>
  );
};

export default Header;

/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SiteConfig, ThemeConfig } from '../_types.js';
import { token } from '../lib/tokens.js';

interface FooterProps {
  site: SiteConfig;
  theme: ThemeConfig;
  themeSettings: Record<string, any>;
}

const footerServices = [
  { label: 'Cloud Infrastructure', href: '/services/cloud-infrastructure' },
  { label: 'Data Engineering', href: '/services/data-engineering' },
  { label: 'Custom Software', href: '/services/custom-software' },
  { label: 'DevOps & SRE', href: '/services/devops-sre' },
  { label: 'AI & Machine Learning', href: '/services/ai-ml' },
];

const footerCompany = [
  { label: 'About Us', href: '/about' },
  { label: 'Leadership', href: '/about/leadership' },
  { label: 'Careers', href: '/careers' },
  { label: 'Partners', href: '/partners' },
  { label: 'Contact', href: '/contact' },
];

const footerResources = [
  { label: 'Blog', href: '/articles' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Whitepapers', href: '/resources/whitepapers' },
  { label: 'Documentation', href: '/docs' },
  { label: 'Status Page', href: '/status' },
];

const Footer: FC<FooterProps> = ({ site, themeSettings }) => {
  return (
    <footer style={{ backgroundColor: token.navy }}>
      <div class="h-1" style={{ backgroundColor: token.primary }} />
      <div class="mx-auto max-w-7xl px-6 py-16">
        <div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company info */}
          <div>
            <div class="mb-4 text-lg font-bold text-white">{site.site_name}</div>
            <p class="mb-6 text-sm leading-relaxed text-gray-400">
              {themeSettings.footer_text ?? 'Engineering technology that moves enterprises forward.'}
            </p>
            <div class="flex gap-4 text-sm text-gray-400">
              <a href="#" class="transition-colors hover:text-white hover:no-underline">LinkedIn</a>
              <a href="#" class="transition-colors hover:text-white hover:no-underline">X</a>
              <a href="#" class="transition-colors hover:text-white hover:no-underline">GitHub</a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 class="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Services</h4>
            <ul class="space-y-3">
              {footerServices.map((link) => (
                <li>
                  <a href={link.href} class="text-sm text-gray-400 transition-colors hover:text-white hover:no-underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 class="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Company</h4>
            <ul class="space-y-3">
              {footerCompany.map((link) => (
                <li>
                  <a href={link.href} class="text-sm text-gray-400 transition-colors hover:text-white hover:no-underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 class="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Resources</h4>
            <ul class="space-y-3">
              {footerResources.map((link) => (
                <li>
                  <a href={link.href} class="text-sm text-gray-400 transition-colors hover:text-white hover:no-underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div class="mt-12 border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {site.site_name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

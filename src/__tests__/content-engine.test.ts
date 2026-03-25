import { describe, it, expect } from 'vitest';
import { buildListingRoutes } from '../content-engine.js';
import type { ContentType } from '../lib/types.js';

function ct(overrides: Partial<ContentType> & { name: string }): ContentType {
  return { label: overrides.name, fields: {}, ...overrides };
}

describe('buildListingRoutes', () => {
  it('returns empty when no content types', () => {
    expect(buildListingRoutes([])).toEqual({});
  });

  it('skips types without listing_path and listing_title (opt-in)', () => {
    const types = [
      ct({ name: 'page', path_pattern: '/{slug}' }),
      ct({ name: 'person', path_pattern: '/team/{slug}' }),
      ct({ name: 'location', path_pattern: '/locations/{slug}' }),
    ];
    expect(buildListingRoutes(types)).toEqual({});
  });

  it('uses explicit listing_path when set', () => {
    const types = [
      ct({ name: 'article', path_pattern: '/articles/{slug}', listing_path: '/blog', listing_title: 'Blog' }),
    ];
    const routes = buildListingRoutes(types);
    expect(routes).toEqual({
      '/blog': { type: 'article', title: 'Blog', subtitle: undefined },
    });
  });

  it('derives listing_path from path_pattern when listing_title is set', () => {
    const types = [
      ct({ name: 'article', path_pattern: '/articles/{slug}', listing_title: 'Insights' }),
    ];
    const routes = buildListingRoutes(types);
    expect(routes).toEqual({
      '/articles': { type: 'article', title: 'Insights', subtitle: undefined },
    });
  });

  it('falls back to label when listing_title not set but listing_path is', () => {
    const types = [
      ct({ name: 'service', label: 'Service', path_pattern: '/services/{slug}', listing_path: '/services' }),
    ];
    const routes = buildListingRoutes(types);
    expect(routes['/services'].title).toBe('Service');
  });

  it('includes subtitle when set', () => {
    const types = [
      ct({
        name: 'article',
        path_pattern: '/articles/{slug}',
        listing_title: 'Insights',
        listing_subtitle: 'Deep dives',
      }),
    ];
    const routes = buildListingRoutes(types);
    expect(routes['/articles'].subtitle).toBe('Deep dives');
  });

  it('skips types with /{slug} pattern even if listing_title set', () => {
    const types = [
      ct({ name: 'page', path_pattern: '/{slug}', listing_title: 'Pages' }),
    ];
    // path_pattern derives to "/" which is skipped, and no explicit listing_path
    expect(buildListingRoutes(types)).toEqual({});
  });

  it('handles multiple types correctly', () => {
    const types = [
      ct({ name: 'article', path_pattern: '/articles/{slug}', listing_title: 'Insights' }),
      ct({ name: 'service', path_pattern: '/services/{slug}', listing_title: 'Our Services' }),
      ct({ name: 'page', path_pattern: '/{slug}' }),
      ct({ name: 'person', path_pattern: '/team/{slug}' }),
    ];
    const routes = buildListingRoutes(types);
    expect(Object.keys(routes)).toEqual(['/articles', '/services']);
    expect(routes['/articles'].type).toBe('article');
    expect(routes['/services'].type).toBe('service');
  });
});

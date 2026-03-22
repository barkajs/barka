<p align="center">
  <img src="https://img.shields.io/badge/barka-0.1.0-000000?style=for-the-badge&labelColor=000" alt="Barka 0.1.0" />
</p>

<h1 align="center">Barka<br/>AI-Native Progressive Content-as-Code CMS</h1>

<p align="center">
  <strong>The first CMS designed for AI coding agents.</strong><br/>
  Write in Markdown. Configure in YAML. Let AI build features.<br/>
  Start as a static site generator — grow into a full CMS when you need it.
</p>

<p align="center">
  <a href="https://github.com/barkajs/barka/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
  <a href="https://github.com/barkajs/barka/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" /></a>
  <a href="https://github.com/barkajs/barka"><img src="https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://hono.dev"><img src="https://img.shields.io/badge/Hono-4.7-E36002?logo=hono&logoColor=white" alt="Hono" /></a>
</p>

<p align="center">
  <a href="#quickstart">Quickstart</a> · <a href="#why-barka">Why Barka</a> · <a href="#features">Features</a> · <a href="#starters">Starters</a> · <a href="#comparison">Comparison</a> · <a href="#testing-smoke">Smoke tests</a> · <a href="https://github.com/barkajs/barka">GitHub</a>
</p>

> **Early Access — v0.1.0**
>
> Barka is in early development. The core engine, CLI, theme system, i18n, multi-site, and static build are functional and tested (151 unit tests). The admin UI and database layer work but are less polished. Some features (workflow approvals, scheduled publishing, role-based permissions) are planned but not yet implemented.
>
> We welcome testers, feedback, and contributions. If you hit a bug or have an idea — [open an issue](https://github.com/barkajs/barka/issues). If you build a site with Barka, we'd love to hear about it.

---

# What is Barka?

Barka is the first **progressive CMS built for AI agents**. It bridges the gap between static site generators and traditional content management systems — combining the simplicity of Astro/Hugo (Markdown files, free hosting) with the power of Drupal/WordPress (structured content, page builder, multi-language, admin UI).

**Born from real frustration.** Barka was created after extensive work with AI coding agents (Claude Code, Cursor, Codex, Copilot) on existing CMS platforms — Payload, Astro, Drupal, WordPress, Strapi. The problems hit hardest in the scenarios that matter most for marketing teams: multi-language sites across multiple domains, rapid creation of custom landing pages, and high-volume content publishing (blog posts, case studies, service pages). Every existing CMS made these tasks painful with AI — complex configs, binary formats, database-dependent workflows, and opaque abstractions meant that building a simple landing page with AI required fighting the framework instead of creating content.

**Barka is designed to be the #1 CMS for marketing-driven companies** that need rich, multi-language websites across multiple domains — and need to publish a lot, fast. With AI agents, you can generate a complete landing page with 10 sections in minutes, translate it to 3 languages instantly, and deploy to a new domain without touching the admin panel. Barka was built to eliminate every barrier between "I need a page" and "it's live."

**Designed from the ground up for AI-assisted development.** Content in Markdown, config in YAML, themes in JSX — all plain text formats that AI coding agents can read, modify, and extend without APIs or authentication. The repo ships with `CLAUDE.md` and `INVARIANTS.json` — built-in guardrails that keep AI agents aligned with project rules across tasks. An AI agent can create an entire website — content, theme, config — in a single session.

**No database required to start.** Content lives in Markdown files and YAML configs — version-controlled with Git, deployable to Cloudflare Pages for $0. When editors need a UI, add SQLite with one command and unlock a full admin panel.

## Why Barka?

- **Built for AI Agents** — Every file is plain text (Markdown, YAML, JSX). AI tools can create content, add features, modify themes, and extend the CMS — no API calls, no auth tokens, no binary formats. Ships with agent guardrails (`CLAUDE.md`, `INVARIANTS.json`) to prevent drift across tasks.
- **Progressive Complexity** — Start with files only, add a database when you actually need one. No upfront infrastructure decisions.
- **Zero JavaScript on Frontend** — Public pages ship 0 bytes of JS. Pure server-rendered HTML with perfect Lighthouse scores.
- **Full Code Ownership** — No vendor lock-in, no SaaS fees. Your content lives in Git. Self-host anywhere or deploy static for free.
- **Drupal-Grade Features** — Page builder with 15 section types, multi-language, multi-site, taxonomy, revisions — without the Drupal complexity.

---

# Features

**Content as Code**
Write content in Markdown with YAML frontmatter. Define content types, taxonomies, and section types in simple YAML config files. Everything is a file — version-controlled, diffable, AI-friendly.

**Page Builder — 15 Section Types**
Compose landing pages from reusable sections: Hero, Features, CTA, Testimonials, FAQ, Pricing, Gallery, Counters, Logo Slider, Text with Image, Blog Listing, Columns, Video, Form, and Text — inspired by [Droopler](https://droopler.dev). Each section supports per-instance settings (background, spacing, width, CSS class).

**Single Directory Components (SDC)**
Each section component lives in its own directory with co-located template (`.tsx`), scoped styles (`.css`), and schema definition (`schema.yaml`). CSS is automatically collected and served via a dynamic `/static/components.css` route — no build step needed.

```
themes/lokatech/components/
├── hero/
│   ├── hero.tsx          # Hono JSX template
│   ├── hero.css          # Scoped styles (animations, gradients)
│   └── schema.yaml       # Field definitions
├── features/
│   ├── features.tsx
│   ├── features.css
│   └── schema.yaml
└── ... (15 components)
```

**Starter Profiles (Distributions)**
Self-contained starter profiles — like Drupal distributions (Droopler, OpenIntranet). Each starter bundles themes, config, and demo content. After `barka init`, everything in `content/`, `config/`, and `themes/` is yours — framework updates never touch these directories.

**Admin UI with HTMX**
A full content management interface at `/admin` — content CRUD with revisions, section builder, media library, taxonomy management, user accounts, settings. Built with server-rendered HTML + HTMX for instant interactivity. No React, no JS build step.

**Multi-Language**
Built-in i18n via filename suffixes (`about.pl.md`, `about.de.md`). Language negotiation (URL prefix → cookie → Accept-Language). Hreflang tags auto-generated. A scalable **language switcher** (dropdown: code + label, active checkmark) lives in the header and matches mobile drawer styling. On the **default language**, URLs have no prefix (`/`); prefixed routes (`/pl/...`, `/de/...`) serve the matching translation. If two files share the same slug (e.g. `page.md` and `page.pl.md`), the unprefixed URL always resolves to the **site default language** — not “first file on disk.” Listings (`/articles`, `/case-studies`, `/services`) filter by language so you never mix EN and PL on the same index. Config in one YAML file:

```yaml
# config/languages.yaml
default: en
languages:
  en:
    label: "English"
    direction: ltr
  pl:
    label: "Polski"
    direction: ltr
```

**UI strings (theme / admin copy)**
Navigation labels, mega-menu copy, footer headings, and other **non-content** strings are not stored in Markdown. They live in `config/translations/<lang>.yaml` (dot keys, e.g. `nav.services: "Services"`). At render time the active theme receives a Drupal-style **`t()`** helper via theme settings (`themeSettings._t`) with fallback to the site default language. Add or edit keys there — same idea as Drupal’s string translations.

**Base path & internal URLs**
Templates get **`_basePath`** (empty for the default language, or `/<lang>` when prefixed) and **`_url('/path')`** so links stay correct when the user is on `/pl/...` (logo, nav, footer, CTAs). You don’t hardcode `/pl` in JSX.

**Multi-Site / Multi-Domain**
Serve multiple sites from a single Barka instance. Each site can have its own domain, language set, and theme settings — while sharing the same components and content engine. Content **without** optional `siteId` in frontmatter is **shared** across sites; content **with** `siteId` is scoped to that site. `barka dev` prints a table mapping each site’s production domain to its `.localhost` alias and languages. Local development uses RFC 6761 `.localhost` subdomains (zero config, no `/etc/hosts` editing):

```yaml
# config/sites.yaml
sites:
  main:
    label: "Barka"
    domain: "barka.dev"
    localhost: "barka.localhost"        # http://barka.localhost:3000
    default_lang: en
    languages: [en, pl, de]

  blog:
    label: "Blog"
    domain: "blog.barka.dev"
    localhost: "blog.localhost"         # http://blog.localhost:3000
    default_lang: en
    languages: [en]
```

**Themes**
Drupal-style theme system with inheritance and a resolution chain: `active theme → base theme → built-in fallback`. Themes include layouts, SDC components, partials, and static assets. Slug-specific templates (`page--contact.tsx`), collection listings (`index--articles.tsx`). Shipped inside starters so they're fully customizable.

**Bidirectional Sync**
Edit in files, edit in admin UI — it all stays in sync. `barka sync` merges changes from both directions with conflict detection. Export from DB to files for Git versioning anytime.

**SEO-First**
Zero JS on public pages. Auto-generated meta tags (Open Graph, Twitter), JSON-LD structured data, sitemap.xml, robots.txt, RSS feed, clean URLs, hreflang tags. Sitemap and RSS are **site-scoped** when multi-site is enabled. Static HTML output scores 100/100 on Lighthouse.

**Themed 404**
Unknown routes render through your active theme (navigation, language switcher, translated UI) — not a bare HTML error page.

**Mobile-First Navigation**
Responsive design with a hamburger menu that opens a slide-in drawer with full accordion sub-navigation (Services, Industries, Insights sub-items), app-style bottom navigation bar, and a prominent Contact CTA.

---

# Progressive Complexity

Barka grows with your project. Start simple, scale up only when needed.

```
Level 1: Files Only          Level 2: Dev Server          Level 3: + Database          Level 4: Full CMS
┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
│  content/*.md   │          │  barka dev      │          │  + SQLite       │          │  + Multi-lang   │
│  config/*.yaml  │   →      │  Hot reload     │   →      │  + Admin UI     │   →      │  + Multi-site   │
│  barka build    │          │  Live preview   │          │  + Auth         │          │  + Workflows    │
│  Deploy: $0     │          │  Local only     │          │  Deploy: $0-5   │          │  Deploy: $5-20  │
└─────────────────┘          └─────────────────┘          └─────────────────┘          └─────────────────┘
      No DB                        No DB                      SQLite                   SQLite or PG
```

---

# Quickstart

**Step 1:** Create a new Barka project:

```bash
npx @barkajs/barka create my-site
```

**Step 2:** Install dependencies and start:

```bash
cd my-site
npm install
npm run dev
```

**Step 4:** Open your site at `http://localhost:3000`

**Step 5 (optional):** Add a database and admin UI:

```bash
npx barka db:init
```

Access the admin panel at `http://localhost:3000/admin`
Default credentials: `admin@example.com` / `Admin123!SecurePass`

## Prerequisites

- Node.js v20+
- npm, pnpm, or bun

That's it. No Docker, no PostgreSQL, no Redis — unless you want them later.

---

<h2 id="starters">Starter Profiles</h2>

Starters are self-contained distributions — like Drupal installation profiles (Droopler, OpenIntranet). Each starter bundles a premium theme, full configuration, demo content, and translations. After `barka init`, everything becomes yours to customize. More starters are coming.

```bash
barka starters                       # list available starters
barka init --starter lokatech        # enterprise IT company
barka init --starter kadoservices    # staffing & HR company
barka init --starter blank           # clean starting point
```

### LokaTech — Enterprise IT Demo (default)

A complete website for a fictional enterprise IT services company. Dark navy + emerald green theme with premium animations (floating blobs, grid patterns, glow lines, stagger reveals).

- **Content**: 62 files — 6 services, 6 industries, 8 case studies, 22 articles, 5 team members, 5 locations, homepage with 10 sections
- **Theme**: 14 layouts, 15 SDC section components, CSS-only mega menu, mobile drawer nav, frosted glass header
- **Languages**: EN + PL translations, language switcher, hreflang tags
- **Use case**: IT outsourcing, software house, digital agency, consulting firm

### KadoServices — Staffing & HR Demo

A complete website for a fictional staffing and HR services company. Warm amber + deep plum theme with a completely different visual language (numbered rows, split hero, dual CTA, slim dropdowns).

- **Content**: 42 files — 6 services (recruitment, temp staffing, RPO, consulting, branding, payroll), 6 industries, 3 case studies, 4 articles, 5 team members, 4 locations, homepage with 10 sections
- **Theme**: 14 layouts, 15 SDC components, DM Sans + Source Sans 3 typography, pre-footer dual audience strip
- **Languages**: EN + PL translations
- **Use case**: Staffing agency, HR consulting, recruitment firm, outsourcing company

### Blank — Clean Starting Point

Minimal setup for starting from scratch. Just a homepage, about page, and the base Starter theme.

- **Content**: 2 files — homepage + about page
- **Config**: 3 content types (article, page, landing_page)
- **Theme**: Starter base theme (clean, unstyled)
- **Use case**: Custom project where you build your own theme and content

### How to use a starter for a new site

```bash
# Create a new project
npx @barkajs/barka create my-company
cd my-company && npm install

# Pick a starter that matches your industry
barka init --starter kadoservices --force

# Customize: edit content, change colors, add your logo
# Then start the dev server
barka dev
```

After init, you own everything:
- `content/` — your content, edit freely (or let AI agents generate it)
- `config/` — your content types, taxonomies, languages, sites
- `themes/` — your theme layouts, components, styles

Framework updates (`npm update @barkajs/barka`) never touch these directories.

---

## For AI Coding Agents

Copy the prompt below into **Claude Code**, **Cursor**, **Codex**, **Aider**, or any AI coding tool to start building a new Barka site. The agent will gather requirements, scan your existing website, create a plan, and build a customized site.

````markdown
# Build a new website with Barka CMS

**IMPORTANT: Start by switching to plan mode** (e.g. `/plan` in Claude Code, or ask the
user to confirm planning before execution). Do NOT write code until the plan is approved.

## Phase 1 — Gather requirements

Ask me (the human) these questions one by one. Wait for all answers before proceeding.

1. **Company / website name** — What is the company called? What should the site title be?
2. **Existing website URL** — Do you have a current website? Paste the URL so I can:
   - Scan the site structure (pages, services, blog, about, contact)
   - Extract color palette and typography from the design
   - Identify content that should be migrated (service descriptions, team, case studies)
   - Detect languages currently in use
3. **Logo** — Paste a link to your logo file, or describe the brand colors if no logo yet.
4. **Main goal** — What is the primary goal of the website?
   (lead generation, brand awareness, recruitment, e-commerce, portfolio, etc.)
5. **Services / products** — What does the company offer? List the main services or product
   categories. (If I already scanned your website, I'll suggest what I found — confirm or correct.)
6. **Target audience** — Who are the ideal customers? Which industries?
7. **Languages** — How many languages are needed and which ones? (e.g. EN + PL, EN only)
8. **Content plan** — What content do you want to publish regularly?
   (blog posts, case studies, landing pages for campaigns, job offers, etc.)

## Phase 2 — Analyze existing site (if URL provided)

If the user provided a website URL:

1. Use web fetch / browser tools to scan the site
2. List all pages found (nav structure, footer links, sitemap if available)
3. Extract the color palette (primary, secondary, accent, background colors)
4. Note the typography (heading font, body font)
5. Identify content types present (services, blog, case studies, team, locations, etc.)
6. Report findings to the user: "I found X pages, Y services, Z blog posts. Colors: #xxx, #yyy.
   Here's what I suggest migrating..."
7. Ask the user to confirm or adjust

## Phase 3 — Create the plan

Based on all answers, create a file called `BARKA_PLAN.md` in the project root with:

```markdown
# Barka Site Plan — [Company Name]

## Requirements
- Company: [name]
- Goal: [goal]
- Languages: [list]
- Existing site: [URL or "none"]
- Brand colors: primary [#xxx], secondary [#yyy], accent [#zzz]

## Starter selection
- Chosen: [lokatech / kadoservices / blank]
- Reason: [why this starter fits]

## Checklist

### Setup
- [ ] Create project: `npx create-barka-app [name]`
- [ ] Init starter: `barka init --starter [name] --force`
- [ ] Configure settings.yaml (site name, URL, colors)
- [ ] Configure languages.yaml
- [ ] Configure sites.yaml (domain, localhost)

### Content migration
- [ ] Homepage — hero, features, CTA sections
- [ ] About page — company story, mission, values
- [ ] Services — [list each service page]
- [ ] Blog posts — [number] articles to create/migrate
- [ ] Case studies — [list if applicable]
- [ ] Team page — [list members if applicable]
- [ ] Contact page — address, form, map
- [ ] [Other pages found on existing site]

### Translations (per language)
- [ ] [lang] — homepage.yaml
- [ ] [lang] — navigation labels (config/translations/[lang].yaml)
- [ ] [lang] — service pages
- [ ] [lang] — about, contact pages

### Theme customization
- [ ] Update brand colors in theme CSS/settings
- [ ] Replace logo
- [ ] Adjust typography if needed
- [ ] Update footer links and social media

### Verification
- [ ] `barka dev` — all pages render correctly
- [ ] Check all languages and language switcher
- [ ] Check mobile responsiveness
- [ ] Verify all navigation links work
- [ ] `barka build` — static build succeeds
```

**Show this plan to the user and wait for approval before executing.**

## Phase 4 — Execute the plan

After plan approval:

1. Set up the project:
   ```bash
   npx create-barka-app [name]
   cd [name]
   ```

2. Read `CLAUDE.md` and `INVARIANTS.json` — follow these rules strictly.

3. Choose the best starter:

   | Starter | Best for | Theme style |
   |---------|----------|-------------|
   | `lokatech` | IT, software, consulting, digital agencies | Dark navy + emerald |
   | `kadoservices` | HR, staffing, recruitment, business services | Warm amber + deep plum |
   | `blank` | Custom design, e-commerce, portfolio | Minimal base theme |

   > More starters coming. Pick the closest match and customize.

   ```bash
   barka init --starter <recommended> --force
   ```

4. Customize `config/settings.yaml` — site name, URL, brand colors from scan.
5. Configure `config/languages.yaml` and `config/translations/*.yaml`.
6. Replace demo content in `content/` with real pages.
   - For each page migrated from the old site, create the content file
   - For each non-default language, create translated files (`.pl.md`, `.pl.yaml`)
7. Update `BARKA_PLAN.md` — check off each completed item as `[x]`.

## Phase 5 — Verify

```bash
barka dev
# Open http://localhost:3000
```

Check every page, every language, navigation, footer, mobile view.
Mark verification items as done in `BARKA_PLAN.md`.

## Rules

- NEVER delete content/, config/, or themes/ directories
- NEVER hardcode language prefixes (/pl/, /de/) — use `_url()` and `_t()`
- Content files use YAML frontmatter; landing pages are pure YAML with sections
- UI strings in `config/translations/<lang>.yaml` — not hardcoded in JSX
- Update `BARKA_PLAN.md` checklist as you complete each step
````

---

# CLI

```bash
barka create <name>           # Scaffold a new project
barka init -s <starter>       # Initialize from a starter profile (lokatech, blank)
barka starters                # List available starter profiles
barka dev                     # Dev server with hot reload
barka build                   # Static HTML output to dist/
barka build --site X          # Build for a specific site
barka db:init                 # Initialize SQLite + seed data
barka import                  # Files → Database
barka export                  # Database → Files
barka sync                    # Bidirectional sync with conflict detection
```

---

# Content

Content lives in `content/` as Markdown with YAML frontmatter:

```markdown
---
title: "Getting Started with Barka"
type: article
status: published
date: 2026-03-21
fields:
  category: technology
  author: "Jane Doe"
  featured_image: "/static/images/article-hero.jpg"
---

Your markdown content here. Supports **bold**, *italic*, [links](https://example.com),
code blocks, images, and everything else Markdown offers.
```

Landing pages use pure YAML with sections:

```yaml
title: "Homepage"
type: landing_page
status: published
sections:
  - type: hero
    heading: "Build websites the simple way"
    subheading: "Content in files. Deploy anywhere."
    cta_text: "Get Started"
    cta_url: "/docs"
    settings:
      background: dark
      spacing: large
  - type: features
    heading: "Why Barka?"
    items:
      - title: "Files First"
        description: "No database needed to start"
        icon: "file-text"
```

## Multi-Language Content

Add a translation by creating a file with a language suffix:

```
content/
├── articles/
│   ├── platform-engineering.md       # English (default)
│   └── platform-engineering.pl.md    # Polish translation
├── pages/
│   ├── contact.md                    # English
│   └── contact.pl.md                # Polish
└── landing-pages/
    ├── homepage.yaml                 # English
    └── homepage.pl.yaml             # Polish
```

The system automatically detects the language from the filename, associates translations with the same slug, and serves them at prefixed URLs (`/pl/articles/platform-engineering`).

**Missing translation:** If there is no content file for a language (e.g. no German homepage), that URL may show a **404** — UI chrome still uses `config/translations/de.yaml` for nav/footer. Add `homepage.de.yaml` (or the relevant `.de.md`) when you want a full page.

---

# Configuration

All configuration in `config/` — simple YAML files:

| File | Purpose |
|------|---------|
| `settings.yaml` | Site name, URL, theme, SEO defaults |
| `content-types.yaml` | Content type definitions with fields |
| `section-types.yaml` | Section types for the page builder |
| `languages.yaml` | i18n language definitions |
| `taxonomies.yaml` | Vocabularies and terms |
| `sites.yaml` | Multi-site domains, per-site languages, `.localhost` aliases |
| `translations/*.yaml` | UI strings per language (`en.yaml`, `pl.yaml`, …) — keys consumed by `t()` in themes |

---

<h2 id="testing-smoke">Smoke tests (manual / Playwright)</h2>

After changes to routing, i18n, `sites.yaml`, or theme navigation, verify at least:

| Area | Checks |
|------|--------|
| **EN** | `/` — logo → `/`, nav without `/pl`, English body copy |
| **PL** | `/pl` — logo → `/pl`, nav/footer links prefixed `/pl/`, Polish copy where translated |
| **Same slug, two langs** | `/services/...` = default lang; `/pl/services/...` = Polish — no cross-leak |
| **Listings** | `/articles` vs `/pl/articles` — only items for that language |
| **404** | `/missing` vs `/pl/missing` — themed page + matching nav language |
| **Switcher** | Dropdown lists all configured languages; links use correct prefix |

The Barka wrapper documents a fuller checklist in `.claude/skills/role-qa-testing/SKILL.md` (section **Frontend Smoke Tests — Barka v2**).

---

# Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Web framework | **Hono** | Ultrafast, runs on Cloudflare Workers, Bun, Deno, Node.js |
| Database | **SQLite** (optional) | Zero-config, embedded, no server process |
| ORM | **Drizzle** | Type-safe, SQL-like API, lazy-loaded |
| Admin UI | **HTMX** | Server-rendered interactivity, no JS build step |
| Templates | **Hono JSX** | Fast server-side rendering |
| Styling | **Tailwind CSS** | Utility-first, CDN-friendly |
| CLI | **Commander.js** | Standard Node.js CLI framework |
| Content | **gray-matter** + **marked** | Frontmatter parsing + Markdown rendering |

---

<h2 id="comparison">Comparison vs Other Tools</h2>

| Feature | Astro | Hugo | Drupal | WordPress | Payload CMS | Keystatic | **Barka** |
|---------|:-----:|:----:|:------:|:---------:|:-----------:|:---------:|:---------:|
| Content in files | :white_check_mark: | :white_check_mark: | :x: | :x: | :x: | :white_check_mark: | :white_check_mark: |
| Admin UI for editors | :x: | :x: | :white_check_mark: | :white_check_mark: | :white_check_mark: | Partial | :white_check_mark: |
| Page builder / sections | :x: | :x: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x: | :white_check_mark: |
| Starter distributions | :x: | :x: | :white_check_mark: | :x: | :x: | :x: | :white_check_mark: |
| Database optional | :white_check_mark: | :white_check_mark: | :x: | :x: | :x: | :white_check_mark: | :white_check_mark: |
| Multi-language | Plugin | Built-in | Built-in | Plugin | Plugin | :x: | Built-in |
| Multi-site | :x: | :x: | :white_check_mark: | :white_check_mark: | :x: | :x: | :white_check_mark: |
| Content revisions | Git | Git | DB | DB | DB | Git | Git + DB |
| 0 JS on frontend | :x: | :white_check_mark: | Depends | :x: | Depends | :white_check_mark: | :white_check_mark: |
| AI-friendly content | :white_check_mark: | :white_check_mark: | :x: | :x: | Partial | Partial | :white_check_mark: |
| Free static hosting | :white_check_mark: | :white_check_mark: | :x: | :x: | :x: | :white_check_mark: | :white_check_mark: |
| Self-contained | :x: | :white_check_mark: | :x: | :x: | :x: | Partial | :white_check_mark: |
| SDC / co-located styles | :white_check_mark: | :x: | :white_check_mark: | :x: | :x: | :x: | :white_check_mark: |
| Setup complexity | `npm create` | `brew install` | Docker + server | PHP + MySQL | Node + DB | `npm create` | **`npx barka create`** |
| Hosting cost | $0 | $0 | $10-50/mo | $5-30/mo | $10-30/mo | $0 | **$0-5/mo** |

---

# Project Structure

```
my-site/
├── content/                  # Your content (Markdown + YAML) — user-owned
│   ├── articles/             # 22 articles (+ .pl.md translations)
│   ├── pages/                # Static pages (about, contact + PL)
│   ├── services/             # 7 service pages (+ PL)
│   ├── case-studies/         # 9 case studies (+ PL)
│   ├── industries/           # Industry pages
│   ├── landing-pages/        # Homepage and landing pages (YAML + PL)
│   ├── team/                 # Team member profiles
│   └── locations/            # Office locations
├── config/                   # Configuration (YAML) — user-owned
│   ├── settings.yaml         # Site name, theme, SEO
│   ├── content-types.yaml    # 8 content types with fields
│   ├── section-types.yaml    # Section type definitions
│   ├── languages.yaml        # en, pl, de
│   ├── taxonomies.yaml       # Vocabularies and terms
│   ├── sites.yaml            # Multi-site domains
│   └── translations/         # UI strings per locale (en.yaml, pl.yaml, …)
├── themes/                   # Themes (Hono JSX + SDC) — user-owned
│   ├── lokatech/             # Premium theme
│   │   ├── theme.yaml        # Theme config and settings
│   │   ├── layouts/          # 14 layout templates
│   │   ├── components/       # 15 SDC section components
│   │   │   ├── hero/         # hero.tsx + hero.css + schema.yaml
│   │   │   ├── features/     # features.tsx + features.css + schema.yaml
│   │   │   └── ...
│   │   └── static/           # CSS, images, fonts
│   └── starter/              # Base theme (fallback)
├── starters/                 # Starter profiles (framework-managed)
│   ├── lokatech/             # Enterprise demo distribution
│   └── blank/                # Clean starting point
├── src/                      # Framework source code
│   ├── lib/                  # Content engine, i18n, themes, SEO
│   ├── built-in-theme/       # Minimal fallback theme
│   └── cli/                  # CLI commands
├── public/                   # Static assets
└── dist/                     # Build output (generated)
```

---

# Contributing

Barka is an open source project and we welcome contributions. If you're interested in contributing, please read our contributing guide.

Found a bug or have a feature idea? [Create an issue](https://github.com/barkajs/barka/issues).

---

# Resources

- [GitHub Repository](https://github.com/barkajs/barka)
- [Issue Tracker](https://github.com/barkajs/barka/issues)

---

# License

[MIT](LICENSE)

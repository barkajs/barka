---
uuid: b2c3d4e5-f6a7-8901-bcde-f12345678901
title: Getting Started with Barka
status: draft
langcode: en
date: '2026-03-20'
slug: getting-started
fields:
  summary: A step-by-step guide to building your first Barka site.
  category: technology
seo:
  description: Step-by-step guide to getting started with Barka CMS.
updated: '2026-03-21T16:11:33.000Z'
---

# Getting Started with Barka

This guide walks you through setting up a Barka project from scratch.

## Prerequisites

- Node.js 20 or later
- A text editor (VS Code recommended)

## Installation

Create a new project using the CLI:

```bash
npx create-barka-app my-site
cd my-site
```

## Project Structure

A fresh Barka project looks like this:

```
my-site/
├── config/
│   ├── settings.yaml
│   ├── content-types.yaml
│   └── section-types.yaml
├── content/
│   ├── articles/
│   └── pages/
├── themes/
│   └── starter/
└── package.json
```

## Creating Content

Add a new Markdown file to `content/articles/`:

```markdown
---
title: "My First Post"
status: published
---

Hello from Barka!
```

## Running the Dev Server

Start the development server:

```bash
barka dev
```

Open `http://localhost:3000` and see your content rendered live.

## Building for Production

When you're ready to deploy:

```bash
barka build
```

This generates a static `dist/` folder you can deploy to any hosting provider.

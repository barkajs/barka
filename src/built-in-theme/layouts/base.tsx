/** @jsxImportSource hono/jsx */

export default function BaseLayout({
  children,
  title,
  siteName,
}: {
  children: unknown;
  title: string;
  siteName: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title} | {siteName}</title>
        <meta name="generator" content="BarkaCMS (https://www.barka.dev)" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { font-family: system-ui, -apple-system, sans-serif; color: #1a1a1a; line-height: 1.6; }
          body { max-width: 48rem; margin: 0 auto; padding: 2rem 1rem; }
          header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #e5e7eb; margin-bottom: 2rem; }
          header a { color: inherit; text-decoration: none; font-weight: 600; }
          nav { display: flex; gap: 1.5rem; }
          nav a { color: #6b7280; font-size: 0.9rem; }
          nav a:hover { color: #2563eb; }
          main { min-height: 60vh; }
          footer { margin-top: 4rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 0.85rem; }
          h1 { font-size: 2rem; margin-bottom: 1rem; }
          h2 { font-size: 1.5rem; margin: 1.5rem 0 0.75rem; }
          p { margin-bottom: 1rem; }
          a { color: #2563eb; }
        `}</style>
      </head>
      <body>
        <header>
          <a href="/">{siteName}</a>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <p>&copy; {new Date().getFullYear()} {siteName}. Powered by Barka.</p>
        </footer>
      </body>
    </html>
  );
}

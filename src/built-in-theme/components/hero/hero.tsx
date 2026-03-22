/** @jsxImportSource hono/jsx */

export default function HeroSection({ data }: { data: any }) {
  return (
    <section style="text-align: center; padding: 4rem 1rem; background: #f9fafb; border-radius: 8px; margin-bottom: 2rem;">
      {data.heading && <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">{data.heading}</h1>}
      {data.subheading && <p style="font-size: 1.1rem; color: #6b7280; max-width: 36rem; margin: 0 auto 1.5rem;">{data.subheading}</p>}
      {data.cta_text && data.cta_url && (
        <a
          href={data.cta_url}
          style="display: inline-block; padding: 0.75rem 2rem; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;"
        >
          {data.cta_text}
        </a>
      )}
    </section>
  );
}

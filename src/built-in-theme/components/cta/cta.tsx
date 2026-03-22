/** @jsxImportSource hono/jsx */

export default function CtaSection({ data }: { data: any }) {
  return (
    <section style="text-align: center; padding: 3rem 1rem; background: #2563eb; color: white; border-radius: 8px; margin: 2rem 0;">
      {data.heading && <h2 style="color: white; margin-bottom: 0.75rem;">{data.heading}</h2>}
      {data.body && <p style="opacity: 0.9; margin-bottom: 1.5rem;">{data.body}</p>}
      {data.button_text && data.button_url && (
        <a
          href={data.button_url}
          style="display: inline-block; padding: 0.75rem 2rem; background: white; color: #2563eb; text-decoration: none; border-radius: 6px; font-weight: 600;"
        >
          {data.button_text}
        </a>
      )}
    </section>
  );
}

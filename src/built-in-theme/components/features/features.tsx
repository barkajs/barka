/** @jsxImportSource hono/jsx */

export default function FeaturesSection({ data }: { data: any }) {
  const items = data.items ?? [];
  return (
    <section style="padding: 2rem 0;">
      {data.heading && <h2 style="margin-bottom: 1.5rem;">{data.heading}</h2>}
      <div style={`display: grid; grid-template-columns: repeat(${data.columns ?? 3}, 1fr); gap: 2rem;`}>
        {items.map((item: any) => (
          <div style="padding: 1.5rem; background: #f9fafb; border-radius: 8px;">
            {item.title && <h3 style="margin-bottom: 0.5rem;">{item.title}</h3>}
            {item.description && <div style="color: #6b7280; font-size: 0.9rem;" dangerouslySetInnerHTML={{ __html: item.description }} />}
          </div>
        ))}
      </div>
    </section>
  );
}

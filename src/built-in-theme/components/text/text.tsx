/** @jsxImportSource hono/jsx */
import { raw } from 'hono/html';

export default function TextSection({ data }: { data: any }) {
  return (
    <section style="padding: 2rem 0;">
      {data.heading && <h2>{data.heading}</h2>}
      {data.body && <div>{raw(data.body)}</div>}
    </section>
  );
}

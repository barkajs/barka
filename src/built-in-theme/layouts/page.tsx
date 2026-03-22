/** @jsxImportSource hono/jsx */
import { raw } from 'hono/html';

export default function PageLayout({ content }: { content: any }) {
  return (
    <article>
      <h1>{content.title}</h1>
      {content.html && <div>{raw(content.html)}</div>}
    </article>
  );
}

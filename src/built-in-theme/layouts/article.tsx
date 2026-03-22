/** @jsxImportSource hono/jsx */
import { raw } from 'hono/html';

export default function ArticleLayout({ content }: { content: any }) {
  return (
    <article>
      <h1>{content.title}</h1>
      {content.date && (
        <p style="color: #6b7280; font-size: 0.9rem; margin-bottom: 1.5rem;">
          {new Date(content.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      )}
      {content.html && <div>{raw(content.html)}</div>}
    </article>
  );
}

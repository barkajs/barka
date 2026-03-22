/** @jsxImportSource hono/jsx */

export default function LandingPageLayout({
  content,
  renderedSections,
}: {
  content: any;
  renderedSections: string;
}) {
  return (
    <div>
      {renderedSections}
    </div>
  );
}

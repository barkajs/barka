/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';
import { token } from '../../lib/tokens.js';

const spacingMap: Record<string, string> = {
  none: 'py-0', small: 'py-12', medium: 'py-16', large: 'py-20', xlarge: 'py-28',
};

const inputStyle = {
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  padding: '0.75rem 1rem',
  fontSize: '0.9375rem',
  width: '100%',
  fontFamily: 'var(--font-sans)',
  backgroundColor: 'white',
};

const Form: FC<SectionProps> = ({ data, settings }) => {
  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;

  return (
    <section class={`${spacing} ${settings.css_class ?? ''}`} id={settings.anchor_id} style={{ backgroundColor: token.cream }}>
      <div class="mx-auto max-w-2xl px-6">
        {data.heading && <h2 class="text-3xl sm:text-4xl mb-4 text-center" style={{ fontFamily: token.fontHeading }}>{data.heading}</h2>}
        {data.description && <p class="text-center mb-8" style={{ color: token.muted }}>{data.description}</p>}
        <form action={data.action_url ?? '#'} method="POST" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <input type="text" name="name" placeholder="Full Name" required style={inputStyle} />
            <input type="email" name="email" placeholder="Email" required style={inputStyle} />
          </div>
          <input type="tel" name="phone" placeholder="Phone Number" style={inputStyle} />
          <select name="specialty" style={inputStyle}>
            <option value="">Select a Specialty</option>
            <option>Cardiology</option>
            <option>Dermatology</option>
            <option>Orthopedics</option>
            <option>Gynecology</option>
            <option>Pediatrics</option>
            <option>Other</option>
          </select>
          <textarea name="message" rows={4} placeholder="How can we help?" style={inputStyle} />
          <button type="submit" class="mv-btn-primary w-full text-center">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Form;

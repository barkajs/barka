/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';

const spacingMap: Record<string, string> = {
  none: 'py-0', small: 'py-8', medium: 'py-16', large: 'py-24', xlarge: 'py-32',
};

const clinics = [
  { id: 'warsaw-centrum', name: 'Warsaw Centrum', address: 'ul. Marszałkowska 84' },
  { id: 'warsaw-ursynow', name: 'Warsaw Ursynów', address: 'ul. Puławska 457' },
  { id: 'krakow', name: 'Kraków', address: 'ul. Dietla 50' },
  { id: 'wroclaw', name: 'Wrocław', address: 'ul. Świdnicka 38' },
  { id: 'gdansk', name: 'Gdańsk', address: 'ul. Grunwaldzka 82' },
  { id: 'poznan', name: 'Poznań', address: 'ul. Święty Marcin 29' },
];

const specialties = [
  { id: 'cardiology', name: 'Cardiology', icon: '❤️' },
  { id: 'dermatology', name: 'Dermatology', icon: '🔬' },
  { id: 'orthopedics', name: 'Orthopedics', icon: '🦴' },
  { id: 'gynecology', name: 'Gynecology', icon: '👶' },
  { id: 'pediatrics', name: 'Pediatrics', icon: '🧒' },
  { id: 'ophthalmology', name: 'Ophthalmology', icon: '👁️' },
  { id: 'neurology', name: 'Neurology', icon: '🧠' },
  { id: 'endocrinology', name: 'Endocrinology', icon: '⚕️' },
  { id: 'primary-care', name: 'Primary Care (GP)', icon: '🩺' },
  { id: 'diagnostics', name: 'Diagnostics', icon: '🔍' },
];

const doctors = [
  { name: 'Dr. Anna Kowalska', specialty: 'Cardiology', clinic: 'warsaw-centrum', available: ['09:00', '10:30', '14:00'] },
  { name: 'Dr. Piotr Nowak', specialty: 'Orthopedics', clinic: 'krakow', available: ['08:00', '11:00', '15:30'] },
  { name: 'Dr. Marta Wiśniewski', specialty: 'Dermatology', clinic: 'wroclaw', available: ['09:30', '13:00', '16:00'] },
  { name: 'Dr. Jan Zieliński', specialty: 'Neurology', clinic: 'gdansk', available: ['10:00', '12:00', '14:30'] },
  { name: 'Dr. Katarzyna Kamińska', specialty: 'Pediatrics', clinic: 'warsaw-ursynow', available: ['08:30', '11:30', '15:00'] },
  { name: 'Dr. Tomasz Lewandowski', specialty: 'Endocrinology', clinic: 'poznan', available: ['09:00', '12:30', '16:30'] },
];

// Generate next 7 days
function getNextDays(): { label: string; value: string; day: string }[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const result = [];
  const now = new Date();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now.getTime() + i * 86400000);
    if (d.getDay() === 0) continue; // skip Sunday
    result.push({
      label: `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`,
      value: d.toISOString().split('T')[0],
      day: days[d.getDay()],
    });
  }
  return result.slice(0, 5);
}

const AppointmentForm: FC<SectionProps> = ({ data, settings }) => {
  if (settings.hidden) return null;
  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const nextDays = getNextDays();

  return (
    <section class={`${spacing} ${settings.css_class ?? ''}`} id={settings.anchor_id}>
      <div class="mx-auto max-w-4xl px-6">
        {data.heading && (
          <div class="text-center mb-10">
            <h1 class="text-3xl sm:text-4xl mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{data.heading}</h1>
            {data.subheading && <p class="text-lg" style={{ color: 'var(--color-muted)' }}>{data.subheading}</p>}
          </div>
        )}

        {/* Steps indicator */}
        <div class="mb-10 flex items-center justify-center gap-0">
          {['Clinic', 'Specialty', 'Doctor & Time', 'Your Details'].map((step, i) => (
            <div class="flex items-center">
              <div class="flex items-center gap-2">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: i === 0 ? 'var(--color-primary)' : 'var(--color-primary-light)',
                    color: i === 0 ? '#fff' : 'var(--color-primary)',
                  }}
                >
                  {i + 1}
                </div>
                <span class="hidden text-sm font-medium sm:inline" style={{ color: i === 0 ? 'var(--color-text)' : 'var(--color-muted)' }}>{step}</span>
              </div>
              {i < 3 && <div class="mx-3 h-px w-8 sm:w-12" style={{ backgroundColor: 'var(--color-border)' }} />}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div style={{ borderRadius: '24px', backgroundColor: '#fff', border: '1px solid var(--color-border)', boxShadow: '0 8px 40px -12px rgba(0,0,0,0.08)' }}>

          {/* Step 1: Choose Clinic */}
          <div class="p-8 border-b" style={{ borderColor: 'var(--color-border)' }} id="mv-step-clinic">
            <h2 class="text-xl mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
              <span class="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white mr-2" style={{ backgroundColor: 'var(--color-primary)' }}>1</span>
              Choose your clinic
            </h2>
            <p class="text-sm mb-5" style={{ color: 'var(--color-muted)' }}>Select the location most convenient for you</p>
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {clinics.map((c, i) => (
                <label
                  class="mv-booking-option group flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-all duration-200"
                  style={{
                    borderColor: i === 0 ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: i === 0 ? 'var(--color-primary-light)' : '#fff',
                  }}
                >
                  <input type="radio" name="clinic" value={c.id} checked={i === 0} class="mt-1 accent-[#4A7C59]" />
                  <div>
                    <div class="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{c.name}</div>
                    <div class="text-xs" style={{ color: 'var(--color-muted)' }}>{c.address}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Step 2: Choose Specialty */}
          <div class="p-8 border-b" style={{ borderColor: 'var(--color-border)' }} id="mv-step-specialty">
            <h2 class="text-xl mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
              <span class="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white mr-2" style={{ backgroundColor: 'var(--color-primary)' }}>2</span>
              Choose specialty
            </h2>
            <p class="text-sm mb-5" style={{ color: 'var(--color-muted)' }}>What type of consultation do you need?</p>
            <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {specialties.map((s, i) => (
                <label
                  class="flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all duration-200"
                  style={{
                    borderColor: i === 0 ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: i === 0 ? 'var(--color-primary-light)' : '#fff',
                  }}
                >
                  <input type="radio" name="specialty" value={s.id} checked={i === 0} class="accent-[#4A7C59]" />
                  <span class="text-lg">{s.icon}</span>
                  <span class="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{s.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Step 3: Doctor & Time */}
          <div class="p-8 border-b" style={{ borderColor: 'var(--color-border)' }} id="mv-step-doctor">
            <h2 class="text-xl mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
              <span class="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white mr-2" style={{ backgroundColor: 'var(--color-primary)' }}>3</span>
              Choose doctor & time
            </h2>
            <p class="text-sm mb-5" style={{ color: 'var(--color-muted)' }}>Available doctors for your selected specialty and clinic</p>

            {/* Date selector */}
            <div class="mb-6 flex flex-wrap gap-2">
              {nextDays.map((d, i) => (
                <button
                  class="rounded-xl border-2 px-4 py-2.5 text-center transition-all duration-200"
                  style={{
                    borderColor: i === 0 ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: i === 0 ? 'var(--color-primary)' : '#fff',
                    color: i === 0 ? '#fff' : 'var(--color-text)',
                    minWidth: '90px',
                  }}
                >
                  <div class="text-[11px] font-bold uppercase tracking-wider" style={{ opacity: 0.7 }}>{d.day}</div>
                  <div class="text-sm font-semibold">{d.label.split(' ').slice(1).join(' ')}</div>
                </button>
              ))}
            </div>

            {/* Doctor cards with time slots */}
            <div class="space-y-4">
              {doctors.map((doc, i) => (
                <div
                  class="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border p-5 transition-all duration-200"
                  style={{
                    borderColor: i === 0 ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: i === 0 ? 'var(--color-primary-light)' : '#fff',
                  }}
                >
                  <div class="flex items-center gap-3 sm:w-56">
                    <div
                      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
                    >
                      {doc.name.split(' ').filter(w => w !== 'Dr.').map(w => w[0]).join('')}
                    </div>
                    <div>
                      <div class="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{doc.name}</div>
                      <div class="text-xs" style={{ color: 'var(--color-primary)' }}>{doc.specialty}</div>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2 flex-1">
                    {doc.available.map((time, ti) => (
                      <button
                        class="rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200"
                        style={{
                          borderColor: i === 0 && ti === 0 ? 'var(--color-primary)' : 'var(--color-border)',
                          backgroundColor: i === 0 && ti === 0 ? 'var(--color-primary)' : '#fff',
                          color: i === 0 && ti === 0 ? '#fff' : 'var(--color-text)',
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Patient Details */}
          <div class="p-8" id="mv-step-details">
            <h2 class="text-xl mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
              <span class="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white mr-2" style={{ backgroundColor: 'var(--color-primary)' }}>4</span>
              Your details
            </h2>
            <p class="text-sm mb-5" style={{ color: 'var(--color-muted)' }}>We'll send a confirmation to your email and phone</p>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-text)' }}>First Name *</label>
                <input
                  type="text"
                  placeholder="Jan"
                  class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#4A7C59]"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff' }}
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-text)' }}>Last Name *</label>
                <input
                  type="text"
                  placeholder="Kowalski"
                  class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#4A7C59]"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff' }}
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-text)' }}>Email *</label>
                <input
                  type="email"
                  placeholder="jan@example.com"
                  class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#4A7C59]"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff' }}
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-text)' }}>Phone *</label>
                <input
                  type="tel"
                  placeholder="+48 600 123 456"
                  class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#4A7C59]"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff' }}
                />
              </div>
              <div class="sm:col-span-2">
                <label class="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-text)' }}>PESEL (optional)</label>
                <input
                  type="text"
                  placeholder="00000000000"
                  class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#4A7C59]"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff' }}
                />
              </div>
              <div class="sm:col-span-2">
                <label class="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-text)' }}>Notes for the doctor (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Describe your symptoms or reason for visit..."
                  class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#4A7C59] resize-none"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff' }}
                />
              </div>
            </div>

            {/* Insurance */}
            <div class="mt-5">
              <label class="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-text)' }}>Payment method</label>
              <div class="flex flex-wrap gap-2">
                {['Private (self-pay)', 'Medicover', 'Luxmed', 'Enel-Med', 'PZU Zdrowie', 'NFZ'].map((opt, i) => (
                  <label
                    class="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all"
                    style={{
                      borderColor: i === 0 ? 'var(--color-primary)' : 'var(--color-border)',
                      backgroundColor: i === 0 ? 'var(--color-primary-light)' : '#fff',
                    }}
                  >
                    <input type="radio" name="payment" value={opt} checked={i === 0} class="accent-[#4A7C59]" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            {/* Consent */}
            <div class="mt-5 space-y-2">
              <label class="flex items-start gap-2 text-xs" style={{ color: 'var(--color-muted)' }}>
                <input type="checkbox" checked class="mt-0.5 accent-[#4A7C59]" />
                <span>I agree to the processing of my personal data for appointment booking purposes. <a href="/faq" style={{ color: 'var(--color-primary)' }}>Privacy Policy</a></span>
              </label>
              <label class="flex items-start gap-2 text-xs" style={{ color: 'var(--color-muted)' }}>
                <input type="checkbox" class="mt-0.5 accent-[#4A7C59]" />
                <span>I'd like to receive appointment reminders via SMS</span>
              </label>
            </div>

            {/* Summary & Submit */}
            <div class="mt-8 rounded-2xl p-5" style={{ backgroundColor: 'var(--color-primary-light)' }}>
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div class="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>Appointment Summary</div>
                  <div class="mt-1 text-sm" style={{ color: 'var(--color-text)' }}>
                    <strong>Dr. Anna Kowalska</strong> · Cardiology · Warsaw Centrum
                  </div>
                  <div class="text-sm" style={{ color: 'var(--color-text)' }}>
                    {nextDays[0]?.label ?? 'Tomorrow'} at <strong>09:00</strong> · Private (self-pay) · <strong>350 PLN</strong>
                  </div>
                </div>
                <button
                  class="shrink-0 rounded-2xl px-8 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:shadow-lg"
                  style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 8px 24px -8px rgba(74,124,89,0.4)' }}
                >
                  Confirm Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;

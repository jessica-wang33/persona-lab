import { useState } from 'react';

const FIELDS = [
  { key: 'cultural_background', label: 'Background' },
  { key: 'professional_persona', label: 'Professional' },
  { key: 'sports_persona', label: 'Sports' },
  { key: 'arts_persona', label: 'Arts' },
  { key: 'travel_persona', label: 'Travel' },
  { key: 'culinary_persona', label: 'Culinary' },
  { key: 'hobbies_and_interests', label: 'Hobbies' },
  { key: 'career_goals_and_ambitions', label: 'Career Goals' },
  { key: 'skills_and_expertise', label: 'Skills' },
];

export default function ProfileDrawer({ persona }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderTop: '1px solid #1e1e2e' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium transition-colors"
        style={{ color: '#6366f1', background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <span>{open ? 'Hide' : 'View'} full profile</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: '240px' }}>
          <div className="grid grid-cols-2 gap-2">
            <Chip label="Age" value={persona.age} />
            <Chip label="Sex" value={persona.sex} />
            <Chip label="Education" value={fmt(persona.education_level)} />
            <Chip label="Marital" value={fmt(persona.marital_status)} />
            <Chip label="City" value={`${persona.city}, ${persona.state}`} />
            <Chip label="Zipcode" value={persona.zipcode} />
          </div>
          {FIELDS.map(({ key, label }) =>
            persona[key] ? (
              <div key={key}>
                <div className="text-xs font-medium mb-0.5" style={{ color: '#6366f1' }}>{label}</div>
                <div className="text-xs leading-relaxed" style={{ color: '#888' }}>{persona[key]}</div>
              </div>
            ) : null
          )}
          {persona.hobbies_and_interests_list?.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: '#6366f1' }}>Hobbies list</div>
              <div className="flex flex-wrap gap-1">
                {persona.hobbies_and_interests_list.map((h) => (
                  <span key={h} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#1a1a2e', color: '#aaa', border: '1px solid #2a2a3e' }}>{h}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Chip({ label, value }) {
  return (
    <div className="rounded-lg px-2 py-1.5" style={{ background: '#0f0f18', border: '1px solid #1e1e2e' }}>
      <div className="text-xs" style={{ color: '#555' }}>{label}</div>
      <div className="text-xs font-medium" style={{ color: '#ccc' }}>{value}</div>
    </div>
  );
}

function fmt(str) {
  if (!str) return '';
  return str.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function PersonaCard({ persona, selected, onClick }) {
  const loading = !persona.avatarUrl && !persona.avatarError;
  const name = persona.name || 'Unknown';
  const occupation = formatOccupation(persona.occupation);

  return (
    <div
      onClick={onClick}
      className="rounded-xl cursor-pointer transition-all duration-150 overflow-hidden flex flex-col"
      style={{
        background: selected ? '#1e1e32' : '#16161f',
        border: selected ? '1px solid #6366f1' : '1px solid #2a2a35',
        boxShadow: selected ? '0 0 0 2px rgba(99,102,241,0.25)' : 'none',
      }}
    >
      {/* Avatar area */}
      <div className="relative w-full" style={{ paddingBottom: '100%' }}>
        <div className="absolute inset-0">
          {persona.avatarUrl ? (
            <img
              src={persona.avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : persona.avatarError ? (
            <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: '#1a1a28' }}>
              {getInitialsAvatar(persona)}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: '#1a1a28' }}>
              <div className="w-8 h-8 rounded-full" style={{ background: '#2a2a3e' }} />
              <div className="w-full px-3">
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ background: '#2a2a3e' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: '#6366f1',
                      width: `${persona.avatarProgress || 0}%`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-0.5">
        <div className="font-medium text-sm leading-tight" style={{ color: '#e8e8ec' }}>{name}</div>
        <div className="text-xs" style={{ color: '#888' }}>{persona.age} · {persona.city}, {persona.state}</div>
        <div className="text-xs mt-0.5 leading-tight line-clamp-1" style={{ color: '#666' }}>{occupation}</div>
        <div
          className="text-xs mt-1.5 leading-relaxed line-clamp-2"
          style={{ color: '#5a5a6e' }}
        >
          {persona.persona?.split('.')[0]}
        </div>
      </div>
    </div>
  );
}


function getInitialsAvatar(persona) {
  const emojis = ['👤', '🧑', '👩', '👨', '🙍'];
  const h = (persona.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return emojis[h % emojis.length];
}

function formatOccupation(occ) {
  if (!occ) return '';
  return occ.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

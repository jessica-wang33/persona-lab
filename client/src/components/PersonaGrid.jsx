import PersonaCard from './PersonaCard';

export default function PersonaGrid({ personas, selectedId, onSelect }) {
  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}
      >
        {personas.map((p) => (
          <PersonaCard
            key={p.id}
            persona={p}
            selected={p.id === selectedId}
            onClick={() => onSelect(p)}
          />
        ))}
      </div>
    </div>
  );
}

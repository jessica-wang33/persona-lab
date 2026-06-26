import { useState, useCallback } from 'react';
import SetupModal from './components/SetupModal';
import PersonaGrid from './components/PersonaGrid';
import ChatPanel from './components/ChatPanel';

export default function App() {
  const [phase, setPhase] = useState('setup'); // 'setup' | 'cohort'
  const [generating, setGenerating] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);

  const generateAvatar = useCallback(async (persona) => {
    const progressInterval = startProgressAnimation(persona.id, setPersonas);
    try {
      const res = await fetch('/api/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona }),
      });
      const data = await res.json();
      clearInterval(progressInterval);
      setPersonas((prev) =>
        prev.map((p) =>
          p.id === persona.id ? { ...p, avatarUrl: data.imageUrl, avatarProgress: 100 } : p
        )
      );
    } catch {
      clearInterval(progressInterval);
      setPersonas((prev) =>
        prev.map((p) =>
          p.id === persona.id ? { ...p, avatarError: true, avatarProgress: 100 } : p
        )
      );
    }
  }, []);

  const generateCohort = useCallback(async ({ count, minAge, maxAge }) => {
    setGenerating(true);
    try {
      const res = await fetch('/api/cohort/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count, minAge, maxAge }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate cohort');

      const initial = data.personas.map((p) => ({
        ...p,
        avatarUrl: null,
        avatarError: false,
        avatarProgress: 0,
      }));
      setPersonas(initial);
      setPhase('cohort');

      initial.forEach((persona) => generateAvatar(persona));
    } catch (err) {
      alert(err.message);
    } finally {
      setGenerating(false);
    }
  }, [generateAvatar]);

  const handleSelectPersona = useCallback((p) => {
    setSelectedPersona((prev) => (prev?.id === p.id ? null : p));
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0f0f13' }}>
      {phase === 'setup' && (
        <SetupModal onGenerate={generateCohort} loading={generating} />
      )}

      {phase === 'cohort' && (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            height: '48px',
            background: '#0f0f13',
            borderBottom: '1px solid #1a1a24',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#6366f1' }}>Persona Lab</span>
            <span style={{ marginLeft: '12px', fontSize: '12px', color: '#444' }}>{personas.length} people</span>
          </div>

          {/* Main content */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Grid panel */}
            <div style={{
              width: selectedPersona ? '55%' : '100%',
              transition: 'width 0.3s ease',
              overflow: 'hidden',
              display: 'flex',
            }}>
              <PersonaGrid
                personas={personas}
                selectedId={selectedPersona?.id}
                onSelect={handleSelectPersona}
              />
            </div>

            {/* Chat panel */}
            {selectedPersona && (
              <div style={{ width: '45%', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: '100%', height: '100%' }}>
                  <ChatPanel
                    key={selectedPersona.id}
                    persona={personas.find((p) => p.id === selectedPersona.id) || selectedPersona}
                    onClose={() => setSelectedPersona(null)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function startProgressAnimation(personaId, setPersonas) {
  const start = Date.now();
  const duration = 25000;

  const interval = setInterval(() => {
    const elapsed = Date.now() - start;
    const progress = Math.min(90, (elapsed / duration) * 90);
    setPersonas((prev) =>
      prev.map((p) => (p.id === personaId ? { ...p, avatarProgress: progress } : p))
    );
  }, 300);

  return interval;
}

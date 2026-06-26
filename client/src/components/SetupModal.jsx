import { useState } from 'react';

export default function SetupModal({ onGenerate, loading }) {
  const [count, setCount] = useState(10);
  const [minAge, setMinAge] = useState(21);
  const [maxAge, setMaxAge] = useState(43);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (minAge >= maxAge) {
      setError('Min age must be less than max age.');
      return;
    }
    onGenerate({ count, minAge, maxAge });
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-2xl p-8 w-full max-w-md shadow-2xl" style={{ background: '#1a1a24', border: '1px solid #2e2e3e' }}>
        <h1 className="text-2xl font-semibold mb-1" style={{ color: '#e8e8ec' }}>Build Your Cohort</h1>
        <p className="text-sm mb-6" style={{ color: '#888' }}>
          Generate a group of simulated people to interview.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#aaa' }}>
              Number of people <span style={{ color: '#6366f1' }}>{count}</span>
            </label>
            <input
              type="range"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: '#555' }}>
              <span>1</span><span>50</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#aaa' }}>Age range</label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs mb-1 block" style={{ color: '#666' }}>Min age</label>
                <input
                  type="number"
                  min={18}
                  max={90}
                  value={minAge}
                  onChange={(e) => setMinAge(Number(e.target.value))}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: '#0f0f18', border: '1px solid #2e2e3e', color: '#e8e8ec' }}
                />
              </div>
              <span className="mt-4" style={{ color: '#555' }}>—</span>
              <div className="flex-1">
                <label className="text-xs mb-1 block" style={{ color: '#666' }}>Max age</label>
                <input
                  type="number"
                  min={18}
                  max={90}
                  value={maxAge}
                  onChange={(e) => setMaxAge(Number(e.target.value))}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: '#0f0f18', border: '1px solid #2e2e3e', color: '#e8e8ec' }}
                />
              </div>
            </div>
          </div>

          {error && <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl py-3 font-medium text-sm transition-opacity"
            style={{
              background: loading ? '#2a2a3e' : '#6366f1',
              color: loading ? '#666' : '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Generating cohort…' : `Generate ${count} people`}
          </button>
        </form>
      </div>
    </div>
  );
}

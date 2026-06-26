import { useState, useRef, useEffect } from 'react';
import ProfileDrawer from './ProfileDrawer';

export default function ChatPanel({ persona, onClose }) {
  const [messages, setMessages] = useState([]); // { role, content }
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [persona?.id]);

  const name = getPersonaName(persona);

  async function sendMessage(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const userMsg = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona, messages: updated }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: '(Error — could not reach server)' }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#13131c', borderLeft: '1px solid #1e1e2e' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0" style={{ borderBottom: '1px solid #1e1e2e' }}>
        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0" style={{ background: '#1e1e2e' }}>
          {persona.avatarUrl ? (
            <img src={persona.avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg">👤</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold leading-tight truncate" style={{ color: '#e8e8ec' }}>{name}</div>
          <div className="text-xs truncate" style={{ color: '#666' }}>
            {persona.age} · {fmt(persona.occupation)} · {persona.city}, {persona.state}
          </div>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-sm transition-colors"
          style={{ color: '#555', background: 'transparent', border: 'none', cursor: 'pointer' }}
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* Profile drawer */}
      <div className="shrink-0">
        <ProfileDrawer persona={persona} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <div className="text-2xl mb-2">💬</div>
              <div className="text-sm" style={{ color: '#555' }}>Start the interview by asking {name.split(' ')[0]} anything.</div>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-xs rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
              style={
                m.role === 'user'
                  ? { background: '#6366f1', color: '#fff', borderBottomRightRadius: '4px' }
                  : { background: '#1e1e2e', color: '#d8d8e2', borderBottomLeftRadius: '4px' }
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-3.5 py-2.5 text-sm" style={{ background: '#1e1e2e', color: '#555', borderBottomLeftRadius: '4px' }}>
              <span className="inline-flex gap-1">
                <Dot delay="0ms" /><Dot delay="150ms" /><Dot delay="300ms" />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex items-end gap-2 px-4 py-3 shrink-0" style={{ borderTop: '1px solid #1e1e2e' }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder={`Ask ${name.split(' ')[0]} something…`}
          rows={1}
          className="flex-1 resize-none rounded-xl px-3 py-2.5 text-sm outline-none"
          style={{
            background: '#1a1a26',
            border: '1px solid #2a2a3e',
            color: '#e8e8ec',
            maxHeight: '120px',
            lineHeight: '1.5',
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-opacity"
          style={{
            background: input.trim() && !sending ? '#6366f1' : '#1e1e2e',
            color: input.trim() && !sending ? '#fff' : '#444',
            border: 'none',
            cursor: input.trim() && !sending ? 'pointer' : 'not-allowed',
          }}
        >
          ↑
        </button>
      </form>
    </div>
  );
}

function Dot({ delay }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: '#555',
        animation: 'bounce 1s infinite',
        animationDelay: delay,
      }}
    />
  );
}

function fmt(str) {
  if (!str) return '';
  return str.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function getPersonaName(persona) {
  const seed = persona.id?.slice(0, 8) || 'person';
  const firstNames = ['Alex', 'Jordan', 'Morgan', 'Taylor', 'Casey', 'Riley', 'Quinn', 'Avery', 'Blake', 'Cameron'];
  const lastNames = ['Chen', 'Rivera', 'Johnson', 'Patel', 'Williams', 'Kim', 'Garcia', 'Smith', 'Lee', 'Brown'];
  const h = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return `${firstNames[h % firstNames.length]} ${lastNames[(h >> 2) % lastNames.length]}`;
}

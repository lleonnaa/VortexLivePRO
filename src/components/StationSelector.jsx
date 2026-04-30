import React, { useState, useMemo } from 'react';
import { NEXRAD_STATIONS } from '../utils/nwsApi';

export default function StationSelector({ selected, onSelect }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return NEXRAD_STATIONS.filter(s =>
      s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [search]);

  const current = NEXRAD_STATIONS.find(s => s.id === selected);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-bright)',
          borderRadius: 4,
          color: 'var(--text-primary)',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 11,
          fontWeight: 600,
          padding: '5px 10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          transition: 'all 0.15s',
          letterSpacing: '0.05em',
        }}
      >
        <span style={{ color: 'var(--accent-cyan)', fontSize: 10 }}>📡</span>
        <span>{selected}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>{current?.name?.split(',')[1]?.trim() || ''}</span>
        <span style={{ color: 'var(--text-muted)', marginLeft: 2 }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 4,
          width: 260,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-bright)',
          borderRadius: 4,
          zIndex: 2000,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: 8, borderBottom: '1px solid var(--border)' }}>
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search station ID or city..."
              style={{
                width: '100%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 3,
                color: 'var(--text-primary)',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 11,
                padding: '5px 8px',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {filtered.map(s => (
              <div
                key={s.id}
                onClick={() => { onSelect(s); setOpen(false); setSearch(''); }}
                style={{
                  padding: '7px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border)',
                  background: s.id === selected ? 'var(--bg-hover)' : 'transparent',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = s.id === selected ? 'var(--bg-hover)' : 'transparent'}
              >
                <span style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: 11,
                  fontWeight: 700,
                  color: s.id === selected ? 'var(--accent-cyan)' : 'var(--text-primary)',
                  width: 44,
                  flexShrink: 0,
                }}>{s.id}</span>
                <span style={{
                  fontFamily: 'IBM Plex Sans, sans-serif',
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 1999 }}
        />
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { getAlertStyle, formatExpires, timeAgo } from '../utils/nwsApi';

const ICONS = {
  'Tornado Warning': '🌪️',
  'Tornado Watch': '⚠️',
  'Severe Thunderstorm Warning': '⛈️',
  'Severe Thunderstorm Watch': '⚠️',
  'Flash Flood Warning': '🌊',
  'Flash Flood Emergency': '🚨',
};

const getIcon = (event) => {
  for (const [key, icon] of Object.entries(ICONS)) {
    if (event?.includes(key)) return icon;
  }
  return '📡';
};

export default function AlertsPanel({ alerts, stormReports, counts, lastUpdated, loading, onAlertClick }) {
  const [tab, setTab] = useState('alerts');
  const [expanded, setExpanded] = useState(null);

  const sortedAlerts = [...alerts].sort((a, b) => {
    const pa = getAlertStyle(a.properties?.event).priority || 1;
    const pb = getAlertStyle(b.properties?.event).priority || 1;
    return pb - pa;
  });

  const REPORT_ICONS = { torn: '🌪️', hail: '🌨️', wind: '💨' };

  return (
    <div style={{
      width: 280,
      height: '100%',
      background: 'var(--bg-panel)',
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 14px 0',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
          <span style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 16,
            letterSpacing: '0.08em',
            color: 'var(--text-primary)',
          }}>LIVE ALERTS</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {loading && (
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--accent-yellow)',
                animation: 'blink 1s infinite',
              }} />
            )}
            {counts.tornadoWarnings > 0 && (
              <div style={{
                background: 'var(--accent-red)',
                color: '#fff',
                fontSize: 9,
                fontFamily: 'IBM Plex Mono, monospace',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 2,
                animation: 'pulse-red 1.5s infinite',
              }}>
                {counts.tornadoWarnings} TOR
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0 }}>
          {[
            { id: 'alerts', label: `WARNINGS (${counts.totalAlerts})` },
            { id: 'reports', label: `REPORTS (${counts.tornReports + counts.hailReports + counts.windReports})` },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                padding: '5px 4px',
                background: 'transparent',
                border: 'none',
                borderBottom: tab === t.id ? '2px solid var(--accent-blue)' : '2px solid transparent',
                color: tab === t.id ? 'var(--text-primary)' : 'var(--text-muted)',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 9,
                letterSpacing: '0.05em',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >{t.label}</button>
          ))}
        </div>
      </div>

      {/* Stat pills */}
      {tab === 'alerts' && (
        <div style={{
          display: 'flex',
          gap: 4,
          padding: '8px 14px',
          borderBottom: '1px solid var(--border)',
          flexWrap: 'wrap',
        }}>
          {[
            { label: 'TOR WARN', val: counts.tornadoWarnings, color: 'var(--accent-red)' },
            { label: 'SVR WARN', val: counts.severeWarnings, color: 'var(--accent-orange)' },
            { label: 'WATCHES', val: counts.watches, color: 'var(--accent-yellow)' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--bg-card)',
              border: `1px solid ${s.val > 0 ? s.color : 'var(--border)'}`,
              borderRadius: 3,
              padding: '3px 7px',
              display: 'flex',
              gap: 5,
              alignItems: 'center',
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: s.val > 0 ? s.color : 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{s.val}</span>
              <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.05em' }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'reports' && (
        <div style={{
          display: 'flex',
          gap: 4,
          padding: '8px 14px',
          borderBottom: '1px solid var(--border)',
        }}>
          {[
            { label: 'TORN', val: counts.tornReports, icon: '🌪️', color: 'var(--accent-red)' },
            { label: 'HAIL', val: counts.hailReports, icon: '🌨️', color: 'var(--accent-cyan)' },
            { label: 'WIND', val: counts.windReports, icon: '💨', color: 'var(--accent-blue)' },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1,
              background: 'var(--bg-card)',
              border: `1px solid ${s.val > 0 ? s.color : 'var(--border)'}`,
              borderRadius: 3,
              padding: '5px 4px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 13 }}>{s.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: s.val > 0 ? s.color : 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{s.val}</div>
              <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tab === 'alerts' && (
          <>
            {sortedAlerts.length === 0 && !loading && (
              <div style={{
                padding: 20,
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 11,
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
                No active warnings
              </div>
            )}
            {sortedAlerts.map((alert, i) => {
              const { event, headline, expires, onset } = alert.properties || {};
              const style = getAlertStyle(event);
              const isExpanded = expanded === i;
              
              return (
                <div
                  key={alert.id || i}
                  onClick={() => {
                    setExpanded(isExpanded ? null : i);
                    if (alert.geometry && onAlertClick) onAlertClick(alert);
                  }}
                  style={{
                    padding: '10px 14px',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    background: isExpanded ? 'var(--bg-hover)' : 'transparent',
                    borderLeft: `3px solid ${style.color}`,
                    transition: 'background 0.1s',
                    animation: 'fadeIn 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 13 }}>{getIcon(event)}</span>
                      <span style={{
                        fontSize: 10,
                        fontFamily: 'IBM Plex Mono, monospace',
                        fontWeight: 600,
                        color: style.color,
                        letterSpacing: '0.05em',
                      }}>{event || 'ALERT'}</span>
                    </div>
                    <span style={{
                      fontSize: 8,
                      color: 'var(--text-muted)',
                      fontFamily: 'IBM Plex Mono, monospace',
                      flexShrink: 0,
                    }}>{timeAgo(onset)}</span>
                  </div>
                  
                  {isExpanded && headline && (
                    <div style={{
                      marginTop: 8,
                      fontSize: 10,
                      color: 'var(--text-secondary)',
                      fontFamily: 'IBM Plex Sans, sans-serif',
                      lineHeight: 1.5,
                    }}>{headline}</div>
                  )}
                  
                  <div style={{
                    marginTop: 4,
                    fontSize: 8,
                    color: 'var(--text-muted)',
                    fontFamily: 'IBM Plex Mono, monospace',
                    display: 'flex',
                    gap: 8,
                  }}>
                    <span>EXP {formatExpires(expires)}</span>
                    {alert.geometry && <span style={{ color: 'var(--accent-blue)' }}>📍 MAP</span>}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {tab === 'reports' && (
          <>
            {stormReports.length === 0 && !loading && (
              <div style={{
                padding: 20,
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 11,
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
                No storm reports today
              </div>
            )}
            {stormReports.map((r, i) => (
              <div
                key={i}
                onClick={() => onAlertClick && onAlertClick({ lat: r.lat, lon: r.lon })}
                style={{
                  padding: '8px 14px',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{REPORT_ICONS[r.type] || '📍'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 10,
                    color: 'var(--text-primary)',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>{r.location || `${r.county}, ${r.state}`}</div>
                  <div style={{
                    fontSize: 8,
                    color: 'var(--text-muted)',
                    fontFamily: 'IBM Plex Mono, monospace',
                    marginTop: 2,
                  }}>
                    {r.time} · {r.magnitude ? `F${r.magnitude} / ` : ''}{r.state}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 14px',
        borderTop: '1px solid var(--border)',
        fontSize: 8,
        color: 'var(--text-muted)',
        fontFamily: 'IBM Plex Mono, monospace',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>NWS / SPC</span>
        <span>{lastUpdated ? `UPD ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Loading...'}</span>
      </div>
    </div>
  );
}

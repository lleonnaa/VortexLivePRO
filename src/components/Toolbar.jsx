import React from 'react';
import StationSelector from './StationSelector';
import { NEXRAD_STATIONS } from '../utils/nwsApi';

const LayerToggle = ({ id, label, active, color, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? `${color}22` : 'var(--bg-card)',
      border: `1px solid ${active ? color : 'var(--border)'}`,
      borderRadius: 4,
      color: active ? color : 'var(--text-muted)',
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: 10,
      fontWeight: 600,
      padding: '5px 10px',
      cursor: 'pointer',
      transition: 'all 0.15s',
      letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
    }}
  >{label}</button>
);

export default function Toolbar({
  station,
  onStationChange,
  product,
  onProductChange,
  layers,
  onLayerToggle,
  onRefresh,
  loading,
  counts,
}) {
  return (
    <div style={{
      height: 48,
      background: 'var(--bg-panel)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 14px',
      gap: 12,
      flexShrink: 0,
      overflowX: 'auto',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 22,
          letterSpacing: '0.08em',
          background: 'linear-gradient(90deg, #ff3d3d, #ff7d2a)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
        }}>VORTEX</div>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 9,
          color: 'var(--text-muted)',
          letterSpacing: '0.12em',
          lineHeight: 1.3,
        }}>LIVE<br/>PRO</div>
      </div>

      <div style={{ width: 1, height: 24, background: 'var(--border)', flexShrink: 0 }} />

      {/* Station selector */}
      <StationSelector
        selected={station}
        onSelect={(s) => onStationChange(s)}
      />

      <div style={{ width: 1, height: 24, background: 'var(--border)', flexShrink: 0 }} />

      {/* Product toggle */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <LayerToggle
          id="N0Q"
          label="REFLECTIVITY"
          active={product === 'N0Q'}
          color="var(--accent-green)"
          onClick={() => onProductChange('N0Q')}
        />
        <LayerToggle
          id="N0U"
          label="VELOCITY"
          active={product === 'N0U'}
          color="var(--accent-cyan)"
          onClick={() => onProductChange('N0U')}
        />
      </div>

      <div style={{ width: 1, height: 24, background: 'var(--border)', flexShrink: 0 }} />

      {/* Overlay layers */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <LayerToggle
          id="warnings"
          label="⚠️ WARNINGS"
          active={layers.warnings}
          color="var(--accent-orange)"
          onClick={() => onLayerToggle('warnings')}
        />
        <LayerToggle
          id="reports"
          label="📍 REPORTS"
          active={layers.reports}
          color="var(--accent-yellow)"
          onClick={() => onLayerToggle('reports')}
        />
        <LayerToggle
          id="counties"
          label="COUNTIES"
          active={layers.counties}
          color="var(--text-secondary)"
          onClick={() => onLayerToggle('counties')}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* Tornado warning indicator */}
      {counts?.tornadoWarnings > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255,61,61,0.1)',
          border: '1px solid var(--accent-red)',
          borderRadius: 4,
          padding: '3px 10px',
          animation: 'pulse-red 1.5s infinite',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 12 }}>🌪️</span>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--accent-red)',
            letterSpacing: '0.05em',
          }}>{counts.tornadoWarnings} TORNADO {counts.tornadoWarnings === 1 ? 'WARNING' : 'WARNINGS'}</span>
        </div>
      )}

      {/* Refresh */}
      <button
        onClick={onRefresh}
        disabled={loading}
        style={{
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: 4,
          color: loading ? 'var(--text-muted)' : 'var(--text-secondary)',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 10,
          padding: '5px 10px',
          cursor: loading ? 'wait' : 'pointer',
          transition: 'all 0.15s',
          flexShrink: 0,
          letterSpacing: '0.05em',
        }}
      >{loading ? '⟳ SYNC...' : '⟳ REFRESH'}</button>
    </div>
  );
}

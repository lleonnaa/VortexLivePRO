import React from 'react';

const REFLECTIVITY_SCALE = [
  { dbz: 75, color: '#ff00ff', label: '75' },
  { dbz: 70, color: '#ae0000', label: '70' },
  { dbz: 65, color: '#ff0000', label: '65' },
  { dbz: 60, color: '#ff4400', label: '60' },
  { dbz: 55, color: '#ff8800', label: '55' },
  { dbz: 50, color: '#ffcc00', label: '50' },
  { dbz: 45, color: '#ffff00', label: '45' },
  { dbz: 40, color: '#00ff00', label: '40' },
  { dbz: 35, color: '#00cc00', label: '35' },
  { dbz: 30, color: '#009900', label: '30' },
  { dbz: 25, color: '#00ffff', label: '25' },
  { dbz: 20, color: '#0099ff', label: '20' },
  { dbz: 15, color: '#0033ff', label: '15' },
  { dbz: 5,  color: '#666699', label: '5'  },
];

const VELOCITY_SCALE = [
  { val: '+70', color: '#ff00ff', label: '+70' },
  { val: '+50', color: '#ff0000', label: '+50' },
  { val: '+30', color: '#ff8800', label: '+30' },
  { val: '+10', color: '#ffff00', label: '+10' },
  { val: '0',   color: '#111111', label: '0'   },
  { val: '-10', color: '#00ffff', label: '-10' },
  { val: '-30', color: '#0088ff', label: '-30' },
  { val: '-50', color: '#0000ff', label: '-50' },
  { val: '-70', color: '#8800ff', label: '-70' },
];

export default function RadarLegend({ product }) {
  const isVelocity = product === 'N0U';
  const scale = isVelocity ? VELOCITY_SCALE : REFLECTIVITY_SCALE;
  const unit = isVelocity ? 'kt' : 'dBZ';
  const label = isVelocity ? 'VELOCITY' : 'REFLECTIVITY';

  return (
    <div style={{
      position: 'absolute',
      bottom: 32,
      left: 16,
      zIndex: 1000,
      background: 'rgba(12,18,25,0.9)',
      border: '1px solid #1e2f42',
      borderRadius: 4,
      padding: '10px 12px',
      backdropFilter: 'blur(8px)',
      minWidth: 80,
    }}>
      <div style={{
        fontSize: 9,
        letterSpacing: '0.15em',
        color: '#7a9ab8',
        fontFamily: 'IBM Plex Mono, monospace',
        marginBottom: 6,
        fontWeight: 600,
      }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {scale.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 16,
              height: 8,
              background: item.color,
              borderRadius: 1,
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: 9,
              color: '#7a9ab8',
              fontFamily: 'IBM Plex Mono, monospace',
              lineHeight: 1,
            }}>{item.label}</span>
          </div>
        ))}
      </div>
      <div style={{
        fontSize: 8,
        color: '#3d5a75',
        fontFamily: 'IBM Plex Mono, monospace',
        marginTop: 4,
      }}>{unit}</div>
    </div>
  );
}

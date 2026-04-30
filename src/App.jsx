import React, { useState, useCallback } from 'react';
import RadarMap from './components/RadarMap';
import AlertsPanel from './components/AlertsPanel';
import Toolbar from './components/Toolbar';
import { useNWSData } from './hooks/useNWSData';
import { NEXRAD_STATIONS } from './utils/nwsApi';

const DEFAULT_STATION = NEXRAD_STATIONS.find(s => s.id === 'KTLX') || NEXRAD_STATIONS[0]; // OKC default for tornado alley

export default function App() {
  const [station, setStation] = useState(DEFAULT_STATION);
  const [product, setProduct] = useState('N0Q'); // reflectivity by default
  const [layers, setLayers] = useState({
    warnings: true,
    reports: true,
    counties: true,
  });
  const [flyTarget, setFlyTarget] = useState(null);

  const { alerts, stormReports, lastUpdated, loading, error, refresh, counts } = useNWSData();

  const handleLayerToggle = useCallback((layer) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  const handleAlertClick = useCallback((alert) => {
    if (alert.lat !== undefined) {
      setFlyTarget({ lat: alert.lat, lon: alert.lon });
    } else if (alert.geometry?.type === 'Polygon') {
      const coords = alert.geometry.coordinates[0];
      const lat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
      const lon = coords.reduce((s, c) => s + c[0], 0) / coords.length;
      setFlyTarget({ lat, lon });
    } else if (alert.geometry?.type === 'MultiPolygon') {
      const coords = alert.geometry.coordinates[0][0];
      const lat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
      const lon = coords.reduce((s, c) => s + c[0], 0) / coords.length;
      setFlyTarget({ lat, lon });
    }
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-deep)',
      overflow: 'hidden',
    }}>
      <Toolbar
        station={station.id}
        onStationChange={setStation}
        product={product}
        onProductChange={setProduct}
        layers={layers}
        onLayerToggle={handleLayerToggle}
        onRefresh={refresh}
        loading={loading}
        counts={counts}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <RadarMap
          station={station}
          product={product}
          layers={layers}
          alerts={alerts}
          stormReports={stormReports}
          flyTarget={flyTarget}
        />

        <AlertsPanel
          alerts={alerts}
          stormReports={stormReports}
          counts={counts}
          lastUpdated={lastUpdated}
          loading={loading}
          onAlertClick={handleAlertClick}
        />
      </div>

      {/* Error toast */}
      {error && (
        <div style={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,61,61,0.1)',
          border: '1px solid var(--accent-red)',
          borderRadius: 4,
          padding: '8px 16px',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 10,
          color: 'var(--accent-red)',
          zIndex: 9999,
          backdropFilter: 'blur(8px)',
        }}>
          ⚠ API Error: {error} — Data may be stale
        </div>
      )}
    </div>
  );
}

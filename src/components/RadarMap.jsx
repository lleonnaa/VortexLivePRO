import React, { useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { getAlertStyle } from '../utils/nwsApi';
import RadarLegend from './RadarLegend';

// Fix Leaflet default icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const STORM_REPORT_COLORS = {
  torn: '#ff3d3d',
  hail: '#00e5ff',
  wind: '#ffd700',
};

// Component to fly to a location
function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lon], 8, { duration: 1.2 });
    }
  }, [target, map]);
  return null;
}

// Station marker
function StationMarker({ station }) {
  const map = useMap();
  useEffect(() => {
    // Draw range rings at 50/100/150 nm
    const rings = [];
    [50, 100, 150].forEach((nm, i) => {
      const km = nm * 1.852;
      const ring = L.circle([station.lat, station.lon], {
        radius: km * 1000,
        color: '#1e2f42',
        weight: i === 0 ? 1.5 : 1,
        fill: false,
        dashArray: i === 2 ? '4 4' : null,
        opacity: 0.5,
      }).addTo(map);
      rings.push(ring);
    });

    const marker = L.circleMarker([station.lat, station.lon], {
      radius: 5,
      color: '#00e5ff',
      fillColor: '#00e5ff',
      fillOpacity: 1,
      weight: 2,
    }).addTo(map);
    
    marker.bindTooltip(station.id, {
      permanent: true,
      direction: 'right',
      offset: [8, 0],
      className: 'station-tooltip',
    });

    return () => {
      rings.forEach(r => map.removeLayer(r));
      map.removeLayer(marker);
    };
  }, [station, map]);

  return null;
}

export default function RadarMap({
  station,
  product,
  layers,
  alerts,
  stormReports,
  flyTarget,
}) {
  const radarUrl = `/api/radar-tile?product=${product}&station=${station.id}&z={z}&x={x}&y={y}`;
  const radarKey = `${station.id}-${product}`; // force re-render on change

  const onEachAlert = (feature, layer) => {
    const { event, headline, expires } = feature.properties || {};
    const style = getAlertStyle(event);
    layer.bindPopup(
      `<div style="font-family:IBM Plex Mono,monospace;font-size:11px;max-width:220px">
        <div style="color:${style.color};font-weight:700;margin-bottom:4px">${event || 'ALERT'}</div>
        <div style="color:#7a9ab8;font-size:10px;line-height:1.5">${headline || ''}</div>
        ${expires ? `<div style="color:#3d5a75;font-size:9px;margin-top:6px">Expires: ${new Date(expires).toLocaleTimeString()}</div>` : ''}
      </div>`,
      { className: 'warning-popup' }
    );
  };

  const alertStyle = (feature) => {
    const style = getAlertStyle(feature.properties?.event);
    return {
      color: style.color,
      weight: style.weight,
      fillColor: style.color,
      fillOpacity: style.fillOpacity,
    };
  };

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <MapContainer
        center={[station.lat, station.lon]}
        zoom={7}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        attributionControl={true}
      >
        {/* Dark basemap */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com">CARTO</a>'
          maxZoom={19}
        />

        {/* County boundaries layer */}
        {layers.counties && (
          <TileLayer
            url="https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/uscounties/{z}/{x}/{y}.png"
            opacity={0.5}
            zIndex={200}
          />
        )}

        {/* NEXRAD radar tiles from IEM */}
        <TileLayer
          key={radarKey}
          url={radarUrl}
          opacity={0.85}
          zIndex={300}
          attribution="NEXRAD via Iowa Environmental Mesonet"
        />

        {/* Warning polygons */}
        {layers.warnings && alerts
          .filter(a => a.geometry)
          .map((alert, i) => (
            <GeoJSON
              key={alert.id || i}
              data={alert}
              style={alertStyle}
              onEachFeature={onEachAlert}
            />
          ))
        }

        {/* Storm report markers */}
        {layers.reports && stormReports.map((r, i) => (
          <CircleMarker
            key={i}
            center={[r.lat, r.lon]}
            radius={r.type === 'torn' ? 7 : 5}
            pathOptions={{
              color: STORM_REPORT_COLORS[r.type] || '#fff',
              fillColor: STORM_REPORT_COLORS[r.type] || '#fff',
              fillOpacity: 0.8,
              weight: 1.5,
            }}
          >
            <Popup className="warning-popup">
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11 }}>
                <div style={{ fontWeight: 700, color: STORM_REPORT_COLORS[r.type], marginBottom: 4 }}>
                  {r.type === 'torn' ? '🌪️ TORNADO' : r.type === 'hail' ? '🌨️ HAIL' : '💨 WIND'}
                </div>
                <div style={{ color: '#7a9ab8' }}>{r.location || r.county}</div>
                <div style={{ color: '#3d5a75', fontSize: 9, marginTop: 4 }}>
                  {r.time} · {r.state}
                  {r.magnitude ? ` · ${r.type === 'torn' ? 'EF' : ''}${r.magnitude}` : ''}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        <StationMarker station={station} />
        {flyTarget && <FlyTo target={flyTarget} />}
      </MapContainer>

      <RadarLegend product={product} />

      {/* Radar timestamp watermark */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        right: 16,
        zIndex: 1000,
        background: 'rgba(12,18,25,0.8)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        padding: '6px 10px',
        backdropFilter: 'blur(4px)',
      }}>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 9,
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
        }}>NEXRAD · IEM</div>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 10,
          color: 'var(--accent-cyan)',
          letterSpacing: '0.05em',
          marginTop: 1,
        }}>{station.id} · {product === 'N0Q' ? 'REFL 0.5°' : 'VEL 0.5°'}</div>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 8,
          color: 'var(--text-muted)',
          marginTop: 2,
        }}>{new Date().toUTCString().slice(0, 22)} UTC</div>
      </div>
    </div>
  );
}

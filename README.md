# VortexLive Pro 🌪️

A professional storm chasing radar dashboard using 100% free, open-source government data.

## Features

- **NEXRAD Super-Res Reflectivity** — Live radar tiles from Iowa Environmental Mesonet (IEM)
- **NEXRAD Base Velocity** — Rotation detection, toggleable
- **Active NWS Warnings/Watches** — Polygon overlays color-coded by severity (tornado, severe, flash flood...)
- **SPC Storm Reports** — Today's tornado, hail, and wind reports plotted on map
- **120+ NEXRAD Stations** — Searchable station selector
- **Range rings** — 50/100/150 nm rings around selected station
- **Click to fly** — Click any alert in the panel to fly the map to that warning polygon
- **Auto-refresh** — All data refreshes every 60 seconds

## Data Sources

| Layer | Source | Cost |
|-------|--------|------|
| NEXRAD Radar Tiles | Iowa Environmental Mesonet (IEM) | Free |
| Warnings/Watches | NWS api.weather.gov | Free |
| Storm Reports | NOAA Storm Prediction Center (SPC) | Free |
| Basemap | CARTO Dark Matter | Free |

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: GitHub + Vercel dashboard
1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Framework: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click Deploy

No environment variables needed — all data sources are public APIs.

## Radar Products

| Code | Product | Use |
|------|---------|-----|
| N0Q | Super-Res Base Reflectivity (0.5°) | Where precipitation is, intensity |
| N0U | Super-Res Base Velocity (0.5°) | Wind direction/speed, rotation detection |

## Tornado Spotting Tips

- **Velocity** mode: look for tight areas of **red next to blue** (inbound/outbound) — this is rotation (mesocyclone)
- **Reflectivity** mode: hook echo shape (backwards "J") indicates tornado potential
- **Warning polygons**: red = tornado warning (imminent/occurring), orange = severe thunderstorm warning

## Architecture

```
src/
  components/
    RadarMap.jsx       — Leaflet map with radar tiles + overlays
    AlertsPanel.jsx    — Right panel: warnings list + storm reports
    Toolbar.jsx        — Top bar: station selector, layer toggles
    RadarLegend.jsx    — Color scale legend (reflectivity/velocity)
    StationSelector.jsx — Searchable NEXRAD station dropdown
  hooks/
    useNWSData.js      — Data fetching + auto-refresh hook
  utils/
    nwsApi.js          — API helpers, station list, alert styling
```

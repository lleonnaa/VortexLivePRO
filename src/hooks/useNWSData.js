import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchActiveAlerts, fetchStormReports } from '../utils/nwsApi';

const REFRESH_INTERVAL = 60 * 1000; // 1 minute

export function useNWSData() {
  const [alerts, setAlerts] = useState([]);
  const [stormReports, setStormReports] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [alertData, reportData] = await Promise.all([
        fetchActiveAlerts(),
        fetchStormReports(),
      ]);
      setAlerts(alertData);
      setStormReports(reportData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    intervalRef.current = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [refresh]);

  // Counts by type
  const counts = {
    tornadoWarnings: alerts.filter(a => 
      a.properties?.event?.toLowerCase().includes('tornado warning')).length,
    severeWarnings: alerts.filter(a => 
      a.properties?.event?.toLowerCase().includes('severe thunderstorm warning')).length,
    watches: alerts.filter(a => 
      a.properties?.event?.toLowerCase().includes('watch')).length,
    totalAlerts: alerts.length,
    tornReports: stormReports.filter(r => r.type === 'torn').length,
    hailReports: stormReports.filter(r => r.type === 'hail').length,
    windReports: stormReports.filter(r => r.type === 'wind').length,
  };

  return { alerts, stormReports, lastUpdated, loading, error, refresh, counts };
}

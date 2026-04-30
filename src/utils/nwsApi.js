// NWS / NOAA data utilities

const NWS_BASE = 'https://api.weather.gov';
const SPC_BASE = 'https://www.spc.noaa.gov';

// NEXRAD station list (major CONUS sites)
export const NEXRAD_STATIONS = [
  { id: 'KABR', name: 'Aberdeen, SD', lat: 45.4558, lon: -98.4132 },
  { id: 'KABX', name: 'Albuquerque, NM', lat: 35.1497, lon: -106.8239 },
  { id: 'KAKQ', name: 'Norfolk/Richmond, VA', lat: 36.9839, lon: -77.0072 },
  { id: 'KAMA', name: 'Amarillo, TX', lat: 35.2333, lon: -101.7092 },
  { id: 'KAMX', name: 'Miami, FL', lat: 25.6111, lon: -80.4128 },
  { id: 'KAPX', name: 'Gaylord, MI', lat: 44.9072, lon: -84.7197 },
  { id: 'KARX', name: 'La Crosse, WI', lat: 43.8228, lon: -91.1914 },
  { id: 'KATX', name: 'Seattle, WA', lat: 48.1947, lon: -122.4958 },
  { id: 'KBBX', name: 'Beale AFB, CA', lat: 39.4956, lon: -121.6317 },
  { id: 'KBGM', name: 'Binghamton, NY', lat: 42.1997, lon: -75.9847 },
  { id: 'KBHX', name: 'Eureka, CA', lat: 40.4986, lon: -124.2919 },
  { id: 'KBIS', name: 'Bismarck, ND', lat: 46.7708, lon: -100.7603 },
  { id: 'KBLX', name: 'Billings, MT', lat: 45.8536, lon: -108.6069 },
  { id: 'KBMX', name: 'Birmingham, AL', lat: 33.1722, lon: -86.7697 },
  { id: 'KBOX', name: 'Boston, MA', lat: 41.9558, lon: -71.1372 },
  { id: 'KBRO', name: 'Brownsville, TX', lat: 25.9156, lon: -97.4189 },
  { id: 'KBUF', name: 'Buffalo, NY', lat: 42.9489, lon: -78.7369 },
  { id: 'KBYX', name: 'Key West, FL', lat: 24.5975, lon: -81.7033 },
  { id: 'KCAE', name: 'Columbia, SC', lat: 33.9486, lon: -81.1183 },
  { id: 'KCBW', name: 'Caribou, ME', lat: 46.0392, lon: -67.8067 },
  { id: 'KCBX', name: 'Boise, ID', lat: 43.4911, lon: -116.2358 },
  { id: 'KCCX', name: 'State College, PA', lat: 40.9228, lon: -78.0036 },
  { id: 'KCLE', name: 'Cleveland, OH', lat: 41.4131, lon: -81.8597 },
  { id: 'KCLX', name: 'Charleston, SC', lat: 32.6556, lon: -81.0422 },
  { id: 'KCRI', name: 'Oklahoma City, OK', lat: 35.2383, lon: -97.4600 },
  { id: 'KCRP', name: 'Corpus Christi, TX', lat: 27.7839, lon: -97.5111 },
  { id: 'KCXX', name: 'Burlington, VT', lat: 44.5111, lon: -73.1661 },
  { id: 'KCYS', name: 'Cheyenne, WY', lat: 41.1519, lon: -104.8061 },
  { id: 'KDAX', name: 'Sacramento, CA', lat: 38.5011, lon: -121.6778 },
  { id: 'KDDC', name: 'Dodge City, KS', lat: 37.7208, lon: -99.9686 },
  { id: 'KDFX', name: 'Laughlin AFB, TX', lat: 29.2731, lon: -100.2803 },
  { id: 'KDGX', name: 'Jackson, MS', lat: 32.2800, lon: -89.9844 },
  { id: 'KDLH', name: 'Duluth, MN', lat: 46.8369, lon: -92.2097 },
  { id: 'KDMX', name: 'Des Moines, IA', lat: 41.7311, lon: -93.7228 },
  { id: 'KDOX', name: 'Dover AFB, DE', lat: 38.8256, lon: -75.4400 },
  { id: 'KDTX', name: 'Detroit, MI', lat: 42.6997, lon: -83.4717 },
  { id: 'KDVN', name: 'Davenport, IA', lat: 41.6117, lon: -90.5808 },
  { id: 'KDYX', name: 'Dyess AFB, TX', lat: 32.5381, lon: -99.2544 },
  { id: 'KEAX', name: 'Kansas City, MO', lat: 38.8103, lon: -94.2644 },
  { id: 'KEMX', name: 'Tucson, AZ', lat: 31.8936, lon: -110.6303 },
  { id: 'KENX', name: 'Albany, NY', lat: 42.5864, lon: -74.0644 },
  { id: 'KEOX', name: 'Fort Rucker, AL', lat: 31.4608, lon: -85.4594 },
  { id: 'KEPZ', name: 'El Paso, TX', lat: 31.8731, lon: -106.6981 },
  { id: 'KESX', name: 'Las Vegas, NV', lat: 35.7014, lon: -114.8914 },
  { id: 'KEVX', name: 'Eglin AFB, FL', lat: 30.5644, lon: -85.9214 },
  { id: 'KEWX', name: 'Austin/San Antonio, TX', lat: 29.7039, lon: -98.0283 },
  { id: 'KEYX', name: 'Edwards AFB, CA', lat: 35.0978, lon: -117.5608 },
  { id: 'KFCX', name: 'Roanoke, VA', lat: 37.0242, lon: -80.2742 },
  { id: 'KFDR', name: 'Altus AFB, OK', lat: 34.3622, lon: -98.9761 },
  { id: 'KFDX', name: 'Cannon AFB, NM', lat: 34.6344, lon: -103.6297 },
  { id: 'KFFC', name: 'Atlanta, GA', lat: 33.3636, lon: -84.5658 },
  { id: 'KFSD', name: 'Sioux Falls, SD', lat: 43.5878, lon: -96.7294 },
  { id: 'KFSX', name: 'Flagstaff, AZ', lat: 34.5744, lon: -111.1983 },
  { id: 'KFTG', name: 'Denver, CO', lat: 39.7867, lon: -104.5458 },
  { id: 'KFWS', name: 'Dallas/Fort Worth, TX', lat: 32.5728, lon: -97.3031 },
  { id: 'KGGW', name: 'Glasgow, MT', lat: 48.2064, lon: -106.6247 },
  { id: 'KGJX', name: 'Grand Junction, CO', lat: 39.0628, lon: -108.2139 },
  { id: 'KGLD', name: 'Goodland, KS', lat: 39.3669, lon: -101.7003 },
  { id: 'KGRB', name: 'Green Bay, WI', lat: 44.4986, lon: -88.1111 },
  { id: 'KGRK', name: 'Fort Hood, TX', lat: 30.7217, lon: -97.3828 },
  { id: 'KGRR', name: 'Grand Rapids, MI', lat: 42.8939, lon: -85.5447 },
  { id: 'KGSP', name: 'Greer, SC', lat: 34.8833, lon: -82.2203 },
  { id: 'KGWX', name: 'Columbus AFB, MS', lat: 33.8967, lon: -88.3289 },
  { id: 'KGYX', name: 'Portland, ME', lat: 43.8914, lon: -70.2569 },
  { id: 'KHDX', name: 'Holloman AFB, NM', lat: 33.0769, lon: -106.1228 },
  { id: 'KHGX', name: 'Houston, TX', lat: 29.4719, lon: -95.0792 },
  { id: 'KHNX', name: 'San Joaquin Valley, CA', lat: 36.3142, lon: -119.6319 },
  { id: 'KHPX', name: 'Fort Campbell, KY', lat: 36.7369, lon: -87.2847 },
  { id: 'KHTX', name: 'Huntsville, AL', lat: 34.9306, lon: -86.0836 },
  { id: 'KICT', name: 'Wichita, KS', lat: 37.6544, lon: -97.4428 },
  { id: 'KICX', name: 'Cedar City, UT', lat: 37.5908, lon: -112.8622 },
  { id: 'KILN', name: 'Wilmington, OH', lat: 39.4203, lon: -83.8217 },
  { id: 'KILX', name: 'Lincoln, IL', lat: 40.1506, lon: -89.3367 },
  { id: 'KIND', name: 'Indianapolis, IN', lat: 39.7075, lon: -86.2803 },
  { id: 'KINX', name: 'Tulsa, OK', lat: 36.1753, lon: -95.5644 },
  { id: 'KIWA', name: 'Phoenix, AZ', lat: 33.2892, lon: -111.6697 },
  { id: 'KIWX', name: 'Fort Wayne, IN', lat: 41.4086, lon: -85.7000 },
  { id: 'KJAX', name: 'Jacksonville, FL', lat: 30.4844, lon: -81.7019 },
  { id: 'KJGX', name: 'Robins AFB, GA', lat: 32.6753, lon: -83.3511 },
  { id: 'KJKL', name: 'Jackson, KY', lat: 37.5908, lon: -83.3131 },
  { id: 'KLBB', name: 'Lubbock, TX', lat: 33.6542, lon: -101.8139 },
  { id: 'KLCH', name: 'Lake Charles, LA', lat: 30.1253, lon: -93.2158 },
  { id: 'KLIX', name: 'New Orleans, LA', lat: 30.3367, lon: -89.8253 },
  { id: 'KLNX', name: 'North Platte, NE', lat: 41.9578, lon: -100.5761 },
  { id: 'KLOT', name: 'Chicago, IL', lat: 41.6044, lon: -88.0847 },
  { id: 'KLRX', name: 'Elko, NV', lat: 40.7397, lon: -116.8028 },
  { id: 'KLSX', name: 'St. Louis, MO', lat: 38.6986, lon: -90.6828 },
  { id: 'KLTX', name: 'Wilmington, NC', lat: 33.9894, lon: -78.4294 },
  { id: 'KLVX', name: 'Louisville, KY', lat: 37.9753, lon: -85.9439 },
  { id: 'KLWX', name: 'Sterling, VA', lat: 38.9753, lon: -77.4878 },
  { id: 'KLZK', name: 'Little Rock, AR', lat: 34.8364, lon: -92.2622 },
  { id: 'KMAF', name: 'Midland/Odessa, TX', lat: 31.9433, lon: -102.1894 },
  { id: 'KMAX', name: 'Medford, OR', lat: 42.0811, lon: -122.7161 },
  { id: 'KMBX', name: 'Minot AFB, ND', lat: 48.3925, lon: -100.8644 },
  { id: 'KMHX', name: 'Morehead City, NC', lat: 34.7758, lon: -76.8764 },
  { id: 'KMKX', name: 'Milwaukee, WI', lat: 42.9678, lon: -88.5506 },
  { id: 'KMLB', name: 'Melbourne, FL', lat: 28.1133, lon: -80.6542 },
  { id: 'KMOB', name: 'Mobile, AL', lat: 30.6797, lon: -88.2397 },
  { id: 'KMPX', name: 'Minneapolis, MN', lat: 44.8489, lon: -93.5653 },
  { id: 'KMQT', name: 'Marquette, MI', lat: 46.5311, lon: -87.5483 },
  { id: 'KMRX', name: 'Knoxville, TN', lat: 36.1683, lon: -83.4017 },
  { id: 'KMSX', name: 'Missoula, MT', lat: 47.0408, lon: -113.9861 },
  { id: 'KMTX', name: 'Salt Lake City, UT', lat: 41.2628, lon: -112.4478 },
  { id: 'KMUX', name: 'San Francisco, CA', lat: 37.1553, lon: -121.8983 },
  { id: 'KMVX', name: 'Grand Forks, ND', lat: 47.5281, lon: -97.3253 },
  { id: 'KMXX', name: 'Maxwell AFB, AL', lat: 32.5367, lon: -85.7897 },
  { id: 'KNKX', name: 'San Diego, CA', lat: 32.9189, lon: -117.0419 },
  { id: 'KNQA', name: 'Memphis, TN', lat: 35.3447, lon: -89.8733 },
  { id: 'KOAX', name: 'Omaha, NE', lat: 41.3200, lon: -96.3667 },
  { id: 'KOHX', name: 'Nashville, TN', lat: 36.2472, lon: -86.5625 },
  { id: 'KOKX', name: 'New York City, NY', lat: 40.8656, lon: -72.8639 },
  { id: 'KOTX', name: 'Spokane, WA', lat: 47.6803, lon: -117.6258 },
  { id: 'KPAH', name: 'Paducah, KY', lat: 37.0683, lon: -88.7719 },
  { id: 'KPBZ', name: 'Pittsburgh, PA', lat: 40.5317, lon: -80.2178 },
  { id: 'KPDT', name: 'Pendleton, OR', lat: 45.6906, lon: -118.8528 },
  { id: 'KPOE', name: 'Fort Polk, LA', lat: 31.1556, lon: -92.9758 },
  { id: 'KPUX', name: 'Pueblo, CO', lat: 38.4595, lon: -104.1814 },
  { id: 'KRAX', name: 'Raleigh, NC', lat: 35.6656, lon: -78.4897 },
  { id: 'KRGX', name: 'Reno, NV', lat: 39.7542, lon: -119.4611 },
  { id: 'KRIW', name: 'Riverton, WY', lat: 43.0661, lon: -108.4772 },
  { id: 'KRLX', name: 'Charleston, WV', lat: 38.3111, lon: -81.7228 },
  { id: 'KRTX', name: 'Portland, OR', lat: 45.7150, lon: -122.9650 },
  { id: 'KSFX', name: 'Pocatello, ID', lat: 43.1056, lon: -112.6861 },
  { id: 'KSGF', name: 'Springfield, MO', lat: 37.2353, lon: -93.4003 },
  { id: 'KSHV', name: 'Shreveport, LA', lat: 32.4508, lon: -93.8411 },
  { id: 'KSJT', name: 'San Angelo, TX', lat: 31.3714, lon: -100.4925 },
  { id: 'KSOX', name: 'Santa Ana Mtns, CA', lat: 33.8181, lon: -117.6358 },
  { id: 'KSRX', name: 'Fort Smith, AR', lat: 35.2908, lon: -94.3619 },
  { id: 'KTBW', name: 'Tampa, FL', lat: 27.7056, lon: -82.4019 },
  { id: 'KTFX', name: 'Great Falls, MT', lat: 47.4597, lon: -111.3853 },
  { id: 'KTLH', name: 'Tallahassee, FL', lat: 30.3975, lon: -84.3289 },
  { id: 'KTLX', name: 'Oklahoma City, OK', lat: 35.3331, lon: -97.2778 },
  { id: 'KTWX', name: 'Topeka, KS', lat: 38.9969, lon: -96.2325 },
  { id: 'KTYX', name: 'Montague, NY', lat: 43.7558, lon: -75.6800 },
  { id: 'KUDX', name: 'Rapid City, SD', lat: 44.1250, lon: -102.8297 },
  { id: 'KUEX', name: 'Hastings, NE', lat: 40.3211, lon: -98.4417 },
  { id: 'KVAX', name: 'Moody AFB, GA', lat: 30.8903, lon: -83.0019 },
  { id: 'KVBX', name: 'Vandenberg AFB, CA', lat: 34.8381, lon: -120.3978 },
  { id: 'KVNX', name: 'Vance AFB, OK', lat: 36.7408, lon: -98.1275 },
  { id: 'KVTX', name: 'Los Angeles, CA', lat: 34.4117, lon: -119.1794 },
  { id: 'KVWX', name: 'Evansville, IN', lat: 38.2600, lon: -87.7247 },
  { id: 'KYUX', name: 'Yuma, AZ', lat: 32.4953, lon: -114.6564 },
];

// IEM NEXRAD radar tile URLs
export const getRadarTileUrl = (station, product) => {
  // IEM serves NEXRAD tiles via their ridge2 service
  // product: 'N0Q' = base reflectivity, 'N0U' = base velocity
  return `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/${product}_${station}/{z}/{x}/{y}.png`;
};

// Get NWS active warnings/watches/advisories
export const fetchActiveAlerts = async () => {
  try {
    const res = await fetch(
      `${NWS_BASE}/alerts/active?status=actual&message_type=alert&urgency=Immediate,Expected&severity=Extreme,Severe,Moderate`,
      { headers: { 'User-Agent': 'VortexLivePro/1.0 (storm chasing app)' } }
    );
    if (!res.ok) throw new Error(`NWS API: ${res.status}`);
    const data = await res.json();
    return data.features || [];
  } catch (err) {
    console.error('fetchActiveAlerts error:', err);
    return [];
  }
};

// Get tornado-specific warnings only
export const fetchTornadoWarnings = async () => {
  try {
    const res = await fetch(
      `${NWS_BASE}/alerts/active?event=Tornado%20Warning&status=actual`,
      { headers: { 'User-Agent': 'VortexLivePro/1.0' } }
    );
    if (!res.ok) throw new Error(`NWS API: ${res.status}`);
    const data = await res.json();
    return data.features || [];
  } catch (err) {
    console.error('fetchTornadoWarnings error:', err);
    return [];
  }
};

// SPC storm reports for today
export const fetchStormReports = async () => {
  // SPC publishes CSV storm reports
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const yy = String(today.getFullYear()).slice(2);
  
  const types = ['torn', 'hail', 'wind'];
  const results = [];

  for (const type of types) {
    try {
      const url = `https://www.spc.noaa.gov/climo/reports/${yy}${mm}${dd}_rpts_${type}.csv`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const text = await res.text();
      const lines = text.trim().split('\n').slice(1); // skip header
      
      for (const line of lines) {
        const parts = line.split(',');
        if (parts.length < 6) continue;
        const [time, fscale_or_size, location, county, state, latStr, lonStr] = parts;
        const lat = parseFloat(latStr);
        const lon = parseFloat(lonStr);
        if (isNaN(lat) || isNaN(lon)) continue;
        
        results.push({
          type,
          time: parts[0],
          magnitude: parts[1],
          location: parts[2],
          county: parts[3],
          state: parts[4],
          lat,
          lon: -Math.abs(lon), // SPC reports lon as positive, flip for CONUS
        });
      }
    } catch (err) {
      // SPC CSV may 404 early in the day — that's fine
    }
  }
  
  return results;
};

// Classify alert severity for coloring
export const getAlertStyle = (event) => {
  if (!event) return { color: '#00aaff', weight: 1, fillOpacity: 0.15, label: 'Advisory' };
  
  const e = event.toLowerCase();
  if (e.includes('tornado warning')) {
    return { color: '#ff3d3d', weight: 2.5, fillOpacity: 0.3, label: 'TOR WARN', priority: 4 };
  }
  if (e.includes('tornado watch')) {
    return { color: '#ffd700', weight: 2, fillOpacity: 0.2, label: 'TOR WATCH', priority: 3 };
  }
  if (e.includes('severe thunderstorm warning')) {
    return { color: '#ff7d2a', weight: 2, fillOpacity: 0.25, label: 'SVR WARN', priority: 3 };
  }
  if (e.includes('severe thunderstorm watch')) {
    return { color: '#ffd700', weight: 1.5, fillOpacity: 0.15, label: 'SVR WATCH', priority: 2 };
  }
  if (e.includes('flash flood warning') || e.includes('flash flood emergency')) {
    return { color: '#00e5ff', weight: 2, fillOpacity: 0.25, label: 'FFW', priority: 2 };
  }
  if (e.includes('special marine') || e.includes('hurricane') || e.includes('tropical')) {
    return { color: '#ff3d3d', weight: 2, fillOpacity: 0.2, label: 'TROPICAL', priority: 3 };
  }
  return { color: '#00aaff', weight: 1, fillOpacity: 0.1, label: 'ADVISORY', priority: 1 };
};

// Format time ago
export const timeAgo = (isoString) => {
  if (!isoString) return '--';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${mins % 60}m ago`;
  return new Date(isoString).toLocaleDateString();
};

// Get expires string
export const formatExpires = (isoString) => {
  if (!isoString) return '--';
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

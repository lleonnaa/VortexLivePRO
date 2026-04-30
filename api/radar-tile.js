export default async function handler(req, res) {
  const { product, station, z, x, y } = req.query;

  if (!product || !station || !z || !x || !y) {
    return res.status(400).json({ error: 'Missing params' });
  }

  // Allowlist valid products
  const validProducts = ['N0Q', 'N0U', 'N0S', 'N0R', 'NCR'];
  if (!validProducts.includes(product)) {
    return res.status(400).json({ error: 'Invalid product' });
  }

  const upstream = `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/${product}_${station}/${z}/${x}/${y}.png`;

  try {
    const response = await fetch(upstream, {
      headers: {
        'User-Agent': 'VortexLivePro/1.0 (storm chasing radar app)',
        'Referer': 'https://mesonet.agron.iastate.edu/',
      },
    });

    if (!response.ok) {
      return res.status(response.status).end();
    }

    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=120'); // cache 2 min
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

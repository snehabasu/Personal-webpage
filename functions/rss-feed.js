exports.handler = async function (event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const fetch = (await import('node-fetch')).default;
    const res = await fetch('https://feeds.alitu.com/33228421', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; podcast-fetch/1.0)' },
    });
    if (!res.ok) throw new Error(`Feed returned ${res.status}`);
    const xml = await res.text();

    // Extract <item> blocks
    const itemBlocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);

    const episodes = itemBlocks.map(item => {
      const text = (tag) => {
        const cdata = item.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`));
        if (cdata) return cdata[1].trim();
        const plain = item.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`));
        return plain ? plain[1].trim() : '';
      };
      const attr = (tag, a) => {
        const m = item.match(new RegExp(`<${tag}[^>]*\\s${a}="([^"]*)"`));
        return m ? m[1] : '';
      };

      const rawDesc = text('description').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

      return {
        title:    text('itunes:title') || text('title'),
        desc:     rawDesc,
        pubDate:  text('pubDate'),
        duration: text('itunes:duration'),
        episode:  parseInt(text('itunes:episode') || '0', 10),
        audioUrl: attr('enclosure', 'url'),
      };
    });

    // Newest episode first
    episodes.sort((a, b) => b.episode - a.episode);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800', // 30-min cache
      },
      body: JSON.stringify(episodes),
    };
  } catch (err) {
    console.error('RSS fetch error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch feed' }) };
  }
};

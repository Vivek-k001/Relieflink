import React, { useEffect, useState } from 'react';
import { Radio, RefreshCw, ExternalLink } from 'lucide-react';

// Curated India-specific disaster news — fed from public RSS / mock until real API key is added
// Replace VITE_NEWS_API_KEY in .env to get live news from newsapi.org
const FALLBACK_NEWS = [
  { title: 'IMD issues Red Alert for heavy rainfall in Kerala and Karnataka coast', source: 'IMD India', time: '2 hours ago', category: 'Alert', color: '#EF4444', icon: '🚨', link: '#' },
  { title: 'NDRF teams deployed across 6 flood-hit districts in Assam', source: 'NDRF', time: '4 hours ago', category: 'Rescue', color: '#F97316', icon: '🚁', link: '#' },
  { title: 'Cyclone warning issued for Bay of Bengal; coastal evacuation underway', source: 'Ministry of Earth Sciences', time: '6 hours ago', category: 'Cyclone', color: '#7C3AED', icon: '🌀', link: '#' },
  { title: 'Maharashtra government opens 120 new relief camps for flood victims', source: 'Maharashtra Govt', time: '8 hours ago', category: 'Relief', color: '#2563EB', icon: '🏕️', link: '#' },
  { title: 'Heatwave warning extended across Rajasthan and Uttar Pradesh', source: 'IMD India', time: '10 hours ago', category: 'Heatwave', color: '#D97706', icon: '☀️', link: '#' },
  { title: 'Landslide in Uttarakhand: 3 villages cut off; rescue operation live', source: 'SDRF Uttarakhand', time: '12 hours ago', category: 'Rescue', color: '#059669', icon: '⛰️', link: '#' },
  { title: 'Delhi floods: Yamuna river rises above danger mark, alerts issued', source: 'Delhi Govt', time: '15 hours ago', category: 'Flood', color: '#0284C7', icon: '🌊', link: '#' },
  { title: 'Tamil Nadu: 500 families evacuated following heavy rainfall and flooding', source: 'TN State Govt', time: '18 hours ago', category: 'Flood', color: '#2563EB', icon: '🌧️', link: '#' },
  { title: 'Odisha cyclone preparedness: 10,000 volunteers deployed to coastal zones', source: 'OSDMA', time: '1 day ago', category: 'Preparedness', color: '#16A34A', icon: '🦺', link: '#' },
  { title: 'NDMA launches live dashboard for real-time disaster tracking India', source: 'NDMA', time: '1 day ago', category: 'Technology', color: '#0891B2', icon: '📡', link: '#' },
];

const CATEGORY_FILTERS = ['All', 'Alert', 'Flood', 'Cyclone', 'Rescue', 'Relief', 'Heatwave'];

async function fetchLiveNews() {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=flood+disaster+rescue+relief+India&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`
    );
    const data = await res.json();
    if (data.status !== 'ok') return null;
    return data.articles.map(a => ({
      title: a.title,
      source: a.source?.name || 'News',
      time: new Date(a.publishedAt).toLocaleString(),
      link: a.url,
      category: guessCategory(a.title),
      color: '#2563EB',
      icon: guessCategoryIcon(a.title),
    }));
  } catch { return null; }
}

function guessCategory(title = '') {
  const t = title.toLowerCase();
  if (t.includes('flood') || t.includes('rain')) return 'Flood';
  if (t.includes('cyclone') || t.includes('storm')) return 'Cyclone';
  if (t.includes('rescue') || t.includes('ndrf')) return 'Rescue';
  if (t.includes('relief') || t.includes('camp')) return 'Relief';
  if (t.includes('heat') || t.includes('temperature')) return 'Heatwave';
  if (t.includes('alert') || t.includes('warning')) return 'Alert';
  return 'General';
}

function guessCategoryIcon(title = '') {
  const t = title.toLowerCase();
  if (t.includes('flood')) return '🌊';
  if (t.includes('cyclone') || t.includes('storm')) return '🌀';
  if (t.includes('rescue')) return '🚁';
  if (t.includes('relief') || t.includes('camp')) return '🏕️';
  if (t.includes('heat')) return '☀️';
  if (t.includes('earthquake')) return '🌍';
  if (t.includes('landslide')) return '⛰️';
  return '📰';
}

export default function DisasterNews({ compact = false }) {
  const [news, setNews] = useState(FALLBACK_NEWS);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [ticker, setTicker] = useState(0);
  const [liveMode, setLiveMode] = useState(false);

  useEffect(() => {
    fetchLiveNews().then(live => { if (live?.length) { setNews(live); setLiveMode(true); } });
  }, []);

  useEffect(() => {
    if (compact) {
      const t = setInterval(() => setTicker(i => (i + 1) % news.length), 5000);
      return () => clearInterval(t);
    }
  }, [news, compact]);

  const refresh = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
  };

  const filtered = filter === 'All' ? news : news.filter(n => n.category === filter);

  if (compact) {
    const n = news[ticker];
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden', color: 'white' }}>
        <span style={{ background: 'rgba(239,68,68,0.9)', color: 'white', padding: '2px 10px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 800, whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>📡 LIVE</span>
        <span style={{ fontSize: '0.8125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, color: 'rgba(255,255,255,0.9)' }}>
          {n?.icon} {n?.title}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{n?.source}</span>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.97), rgba(30,41,59,0.95))', backdropFilter: 'blur(20px)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontFamily: 'Inter,sans-serif', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', animation: 'pulse-sos 1.5s infinite', flexShrink: 0 }} />
            <span style={{ fontWeight: 800, fontSize: '0.9375rem', fontFamily: 'Outfit,sans-serif' }}>Disaster News Feed</span>
            {liveMode && <span style={{ background: 'rgba(239,68,68,0.2)', color: '#FCA5A5', fontSize: '0.65rem', padding: '1px 6px', borderRadius: 8, fontWeight: 700 }}>LIVE</span>}
          </div>
          <button onClick={refresh} disabled={loading} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: '0.3rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
        {/* Category chips */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {CATEGORY_FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.2rem 0.625rem', borderRadius: 20, border: filter === f ? '1.5px solid #60A5FA' : '1.5px solid rgba(255,255,255,0.12)', background: filter === f ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.05)', color: filter === f ? '#93C5FD' : 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* News list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>No news in this category</div>
        ) : filtered.map((item, i) => (
          <div key={i} style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = ''}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: 1 }}>{item.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.5, fontWeight: 500, flex: 1 }}>{item.title}</p>
                  {item.link && item.link !== '#' && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0, marginTop: 2 }}>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ background: `${item.color}25`, color: item.color, padding: '1px 7px', borderRadius: 8, fontSize: '0.65rem', fontWeight: 700, border: `1px solid ${item.color}40` }}>{item.category}</span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{item.source}</span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>· {item.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0.625rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', margin: 0, textAlign: 'center' }}>
          Add VITE_NEWS_API_KEY to .env for live news · Source: NDMA / News API
        </p>
      </div>
    </div>
  );
}

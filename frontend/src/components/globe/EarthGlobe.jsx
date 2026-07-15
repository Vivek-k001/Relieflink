import React, { useEffect, useRef, useState } from 'react';

// Disaster zones — real coordinates for Indian subcontinent + world
const DISASTER_ARCS = [
  { startLat: 11.2, startLng: 75.7, endLat: 23.5, endLng: 87.3, color: '#EF4444', label: 'Kerala ↔ West Bengal Flood Zone' },
  { startLat: 19.0, startLng: 72.8, endLat: 28.6, endLng: 77.2, color: '#F97316', label: 'Mumbai ↔ Delhi Relief Corridor' },
  { startLat: 13.0, startLng: 80.2, endLat: 17.4, endLng: 78.5, color: '#FBBF24', label: 'Chennai ↔ Hyderabad Aid Route' },
  { startLat: 26.9, startLng: 75.8, endLat: 22.6, endLng: 88.3, color: '#34D399', label: 'Jaipur ↔ Kolkata Rescue Route' },
];

const DISASTER_POINTS = [
  { lat: 11.2588, lng: 75.7804, size: 0.6, color: '#EF4444', label: 'Wayanad, Kerala Flood' },
  { lat: 22.5726, lng: 88.3639, size: 0.5, color: '#EF4444', label: 'Kolkata Cyclone Zone' },
  { lat: 20.9374, lng: 85.0900, size: 0.55, color: '#F97316', label: 'Odisha Flood Zone' },
  { lat: 15.3173, lng: 75.7139, size: 0.4, color: '#FBBF24', label: 'Karnataka Relief Camp' },
  { lat: 28.7041, lng: 77.1025, size: 0.35, color: '#3B82F6', label: 'Delhi Command Center' },
  { lat: 19.0760, lng: 72.8777, size: 0.45, color: '#3B82F6', label: 'Mumbai Relief Hub' },
  { lat: 26.8467, lng: 80.9462, size: 0.4, color: '#F97316', label: 'Lucknow Relief Center' },
];

export default function EarthGlobe({ userLat, userLng, height = 480 }) {
  const containerRef = useRef(null);
  const globeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    let globe = null;
    let animFrame = null;

    const initGlobe = async () => {
      const GlobeGL = (await import('globe.gl')).default;

      if (!containerRef.current) return;

      // Destroy previous
      if (globeRef.current) {
        containerRef.current.innerHTML = '';
      }

      const points = [...DISASTER_POINTS];
      if (userLat && userLng) {
        points.push({ lat: userLat, lng: userLng, size: 0.7, color: '#22C55E', label: '📍 Your Location' });
      }

      globe = GlobeGL()(containerRef.current)
        .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
        .atmosphereColor('#3B82F6')
        .atmosphereAltitude(0.18)
        .backgroundColor('rgba(0,0,0,0)')
        .width(containerRef.current.offsetWidth || 480)
        .height(height)
        // Points for disaster zones
        .pointsData(points)
        .pointColor(d => d.color)
        .pointRadius(d => d.size)
        .pointAltitude(0.01)
        .pointLabel(d => `
          <div style="background:rgba(15,23,42,0.95);color:white;padding:8px 12px;border-radius:8px;font-family:Inter,sans-serif;font-size:12px;border:1px solid rgba(255,255,255,0.15);pointer-events:none">
            <strong style="color:${d.color}">${d.label}</strong>
          </div>
        `)
        // Arcs for relief corridors
        .arcsData(DISASTER_ARCS)
        .arcColor(d => d.color)
        .arcDashLength(0.4)
        .arcDashGap(0.2)
        .arcDashAnimateTime(2000)
        .arcStroke(0.5)
        .arcAltitude(0.12)
        .arcLabel(d => `<div style="background:rgba(15,23,42,0.95);color:white;padding:6px 10px;border-radius:6px;font-family:Inter,sans-serif;font-size:11px">${d.label}</div>`)
        // Auto-rotate
        .enablePointerInteraction(true);

      // Auto-rotate
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.4;
      globe.controls().enableZoom = false;

      // Center on India
      globe.pointOfView({ lat: 22, lng: 80, altitude: 2.2 }, 1000);

      globeRef.current = globe;
      setLoaded(true);
    };

    initGlobe();

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [userLat, userLng, height]);

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      {!loaded && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 12, zIndex: 2 }}>
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', animation: 'float 2s ease-in-out infinite' }}>🌍</div>
            <div style={{ fontSize: '0.875rem', fontFamily: 'Inter,sans-serif' }}>Loading Earth...</div>
          </div>
        </div>
      )}
      <div ref={containerRef} style={{ width: '100%', height, borderRadius: 12, overflow: 'hidden' }} />
      {/* Legend */}
      {loaded && (
        <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', borderRadius: 10, padding: '8px 12px', color: 'white', fontSize: '0.7rem', fontFamily: 'Inter,sans-serif', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ marginBottom: 4, fontWeight: 700, color: '#93C5FD', fontSize: '0.75rem' }}>🌍 Active Disaster Zones</div>
          {[{ color: '#EF4444', label: 'Active SOS / Flood Zone' }, { color: '#F97316', label: 'Relief Corridor' }, { color: '#22C55E', label: 'Your Location' }, { color: '#3B82F6', label: 'Relief Hub' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

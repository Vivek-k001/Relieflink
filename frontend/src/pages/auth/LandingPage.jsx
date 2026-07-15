import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { weatherAPI, alertAPI } from '../../api';
import WeatherWidget from '../../components/common/WeatherWidget';
import DisasterNews from '../../components/common/DisasterNews';
import {
  Shield, AlertTriangle, Users, MapPin, Phone, ChevronRight,
  Droplets, Wind, Thermometer, Radio, ArrowRight, Activity,
  Zap, Heart, Package, Navigation, Bell, ArrowDown
} from 'lucide-react';

// Lazy-load the heavy 3D globe
const EarthGlobe = lazy(() => import('../../components/globe/EarthGlobe'));

const DISASTER_TYPES = [
  { type: 'flood', emoji: '🌊', label: 'Flood' },
  { type: 'earthquake', emoji: '🌍', label: 'Earthquake' },
  { type: 'cyclone', emoji: '🌀', label: 'Cyclone' },
  { type: 'landslide', emoji: '⛰️', label: 'Landslide' },
  { type: 'fire', emoji: '🔥', label: 'Fire' },
  { type: 'heatwave', emoji: '☀️', label: 'Heatwave' },
  { type: 'tsunami', emoji: '🌊', label: 'Tsunami' },
];

const FEATURES = [
  { icon: '🆘', title: 'Send SOS', desc: 'Instant rescue request broadcast to nearby volunteers', color: '#EF4444' },
  { icon: '📦', title: 'Request Relief', desc: 'Food, water, medicine & essentials delivered to you', color: '#2563EB' },
  { icon: '🏕️', title: 'Find Safe Camps', desc: 'AI-matched nearby shelters with capacity info', color: '#059669' },
  { icon: '✅', title: "I'm Safe", desc: 'Let your family know you\'re safe instantly', color: '#10B981' },
  { icon: '🚁', title: 'Volunteer', desc: 'Join trained rescue & relief operations on the ground', color: '#7C3AED' },
  { icon: '📡', title: 'Live Alerts', desc: 'Real-time disaster alerts with hazard broadcast zones', color: '#D97706' },
  { icon: '📊', title: 'Track Requests', desc: 'Live status tracking for every request you make', color: '#0284C7' },
  { icon: '🏥', title: 'Medical Aid', desc: 'Emergency ambulance & medical assistance access', color: '#DC2626' },
  { icon: '💝', title: 'Donate & Help', desc: 'NGOs receive donations with full transparency', color: '#E11D48' },
];

const STATS = [
  { val: '50K+', label: 'People Helped', icon: '👥' },
  { val: '120+', label: 'Relief Camps', icon: '🏕️' },
  { val: '1,200+', label: 'Volunteers', icon: '🦺' },
  { val: '98%', label: 'SOS Response Rate', icon: '⚡' },
];

// Emergency contacts for India
const EMERGENCY_CONTACTS = [
  { name: 'National Emergency', number: '112', color: '#EF4444', icon: '🚨' },
  { name: 'NDRF Helpline', number: '011-24363260', color: '#2563EB', icon: '🏥' },
  { name: 'Disaster Mgmt', number: '1078', color: '#7C3AED', icon: '🆘' },
  { name: 'Flood Control', number: '1800-180-5999', color: '#0284C7', icon: '🌊' },
  { name: 'Police', number: '100', color: '#1D4ED8', icon: '👮' },
  { name: 'Ambulance', number: '108', color: '#DC2626', icon: '🚑' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [alertIdx, setAlertIdx] = useState(0);
  const [userCoords, setUserCoords] = useState({ lat: null, lng: null });
  const [scrolled, setScrolled] = useState(false);
  const featuresRef = useRef(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
    alertAPI.getAll({ active: true }).then(r => setAlerts(r.data.alerts || [])).catch(() => {});
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!alerts.length) return;
    const t = setInterval(() => setAlertIdx(i => (i + 1) % alerts.length), 4500);
    return () => clearInterval(t);
  }, [alerts]);

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: '#050D1F' }}>

      {/* ─── BREAKING NEWS TICKER ─── */}
      <div style={{ background: 'rgba(180,0,0,0.95)', backdropFilter: 'blur(10px)', padding: '0.4rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,0,0,0.3)' }}>
        <span style={{ background: 'white', color: '#B91C1C', padding: '1px 10px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.08em', whiteSpace: 'nowrap', flexShrink: 0 }}>📡 LIVE</span>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <DisasterNews compact />
        </div>
        <button onClick={() => navigate('/alerts')} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: 6, padding: '0.25rem 0.75rem', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
          All Alerts →
        </button>
      </div>

      {/* ─── NAVBAR ─── */}
      <nav style={{ background: scrolled ? 'rgba(5,13,31,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none', padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 34, zIndex: 90, transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}>🆘</div>
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.35rem', color: 'white', letterSpacing: '-0.02em' }}>ReliefLink</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: -2, letterSpacing: '0.04em' }}>DISASTER MANAGEMENT PLATFORM</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '0.5rem 1rem', background: 'none', color: 'rgba(255,255,255,0.7)', border: 'none', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}>Features</button>
          <button onClick={() => navigate('/alerts')} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF4444', animation: 'pulse-sos 1.5s infinite' }} />
            Live Alerts
          </button>
          <button onClick={() => navigate('/login')} style={{ padding: '0.5rem 1.25rem', borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(255,255,255,0.25)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#60A5FA'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}>
            Log In
          </button>
          <button onClick={() => navigate('/register')} style={{ padding: '0.5rem 1.25rem', borderRadius: 8, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: 'white', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,99,235,0.35)', border: 'none' }}>
            Register
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════════════
          HERO SECTION — Globe + CTA + Weather
      ════════════════════════════════════════ */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', paddingTop: '2rem' }}>
        {/* Radial background glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 60% 50%, rgba(37,99,235,0.15) 0%, rgba(109,40,217,0.08) 40%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '60%', height: '80%', background: 'radial-gradient(ellipse, rgba(37,99,235,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', padding: '0 2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '3rem', alignItems: 'center', minHeight: '85vh' }}>

            {/* ── LEFT: Text CTA ── */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(37,99,235,0.15)', backdropFilter: 'blur(6px)', padding: '0.375rem 1rem', borderRadius: 50, color: '#93C5FD', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid rgba(96,165,250,0.2)' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', animation: 'pulse-sos 1.5s infinite' }} />
                Live Emergency Response Platform
              </div>

              <h1 style={{ fontFamily: 'Outfit, sans-serif', color: 'white', fontSize: 'clamp(2.5rem, 5.5vw, 4rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
                When Disaster{' '}
                <span style={{ background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Strikes,
                </span>
                <br />
                <span style={{ color: 'rgba(255,255,255,0.95)' }}>ReliefLink </span>
                <span style={{ background: 'linear-gradient(135deg, #34D399, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Responds
                </span>
              </h1>

              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.0625rem', maxWidth: 520, lineHeight: 1.75, marginBottom: '2rem' }}>
                India's most comprehensive disaster coordination platform — connecting affected people, volunteers, NGOs, and emergency responders in real time across floods, earthquakes, cyclones, and all natural disasters.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', borderRadius: 12, background: 'linear-gradient(135deg, #EF4444, #B91C1C)', color: 'white', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 6px 24px rgba(239,68,68,0.4)', animation: 'pulse-sos 3s infinite', border: 'none' }}>
                  🆘 Emergency Access
                </button>
                <button onClick={() => navigate('/register')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 1.75rem', borderRadius: 12, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.15)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}>
                  Join as Volunteer <ArrowRight size={18} />
                </button>
              </div>

              {/* Disaster type pills */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {DISASTER_TYPES.map(d => (
                  <span key={d.type} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.75rem', borderRadius: 50, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(4px)' }}>
                    {d.emoji} {d.label}
                  </span>
                ))}
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                {STATS.map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.5rem', fontWeight: 900, color: '#60A5FA' }}>{s.val}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: 3D Globe ── */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Suspense fallback={
                <div style={{ height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ fontSize: '3rem', animation: 'float 2s ease-in-out infinite' }}>🌍</div>
                  <span style={{ fontSize: '0.875rem' }}>Loading Earth...</span>
                </div>
              }>
                <EarthGlobe userLat={userCoords.lat} userLng={userCoords.lng} height={480} />
              </Suspense>

              {/* Floating badges on globe */}
              <div style={{ position: 'absolute', top: '12%', left: '-5%', background: 'rgba(239,68,68,0.9)', color: 'white', borderRadius: 12, padding: '0.5rem 0.875rem', fontSize: '0.78rem', fontWeight: 700, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', animation: 'float 4s ease-in-out infinite', boxShadow: '0 8px 24px rgba(239,68,68,0.4)' }}>
                🆘 12 Active SOS
              </div>
              <div style={{ position: 'absolute', top: '35%', right: '-5%', background: 'rgba(37,99,235,0.9)', color: 'white', borderRadius: 12, padding: '0.5rem 0.875rem', fontSize: '0.78rem', fontWeight: 700, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', animation: 'float 5s ease-in-out infinite 0.5s', boxShadow: '0 8px 24px rgba(37,99,235,0.4)' }}>
                🏕️ 78 Relief Camps
              </div>
              <div style={{ position: 'absolute', bottom: '15%', left: '-2%', background: 'rgba(16,185,129,0.9)', color: 'white', borderRadius: 12, padding: '0.5rem 0.875rem', fontSize: '0.78rem', fontWeight: 700, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', animation: 'float 3.5s ease-in-out infinite 1s', boxShadow: '0 8px 24px rgba(16,185,129,0.4)' }}>
                🦺 340 Volunteers Active
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ textAlign: 'center', paddingBottom: '1.5rem', animation: 'float 2s ease-in-out infinite' }}>
          <ArrowDown size={20} style={{ color: 'rgba(255,255,255,0.25)' }} />
        </div>
      </section>

      {/* ════════════════════════════════════════
          WEATHER + NEWS SECTION
      ════════════════════════════════════════ */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(180deg, #050D1F, #0A1628)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(37,99,235,0.1)', padding: '0.375rem 1rem', borderRadius: 50, color: '#93C5FD', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1rem', border: '1px solid rgba(96,165,250,0.15)' }}>
              <Activity size={14} /> Live Intelligence Center
            </div>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', color: 'white', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Real-Time Weather & Disaster Intelligence
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 600, margin: '0 auto', fontSize: '1rem', lineHeight: 1.7 }}>
              Stay informed with live weather conditions at your location and breaking disaster news from across India.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.5rem', alignItems: 'start' }}>
            {/* Weather Panel */}
            <WeatherWidget />

            {/* News Panel */}
            <div style={{ height: 520 }}>
              <DisasterNews />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          EMERGENCY CONTACTS STRIP
      ════════════════════════════════════════ */}
      <section style={{ padding: '2rem', background: 'rgba(239,68,68,0.05)', borderTop: '1px solid rgba(239,68,68,0.15)', borderBottom: '1px solid rgba(239,68,68,0.15)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <span style={{ color: '#FCA5A5', fontWeight: 700, fontSize: '0.8125rem', letterSpacing: '0.1em' }}>📞 EMERGENCY CONTACTS</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {EMERGENCY_CONTACTS.map(c => (
              <a key={c.number} href={`tel:${c.number}`} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 1.25rem', borderRadius: 12, background: `${c.color}15`, border: `1px solid ${c.color}35`, color: 'white', textDecoration: 'none', transition: 'all 0.2s', fontFamily: 'Inter,sans-serif' }}
                onMouseEnter={e => { e.currentTarget.style.background = `${c.color}25`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${c.color}15`; e.currentTarget.style.transform = ''; }}>
                <span style={{ fontSize: '1.125rem' }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: c.color, letterSpacing: '0.02em' }}>{c.number}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES GRID
      ════════════════════════════════════════ */}
      <section ref={featuresRef} style={{ padding: '6rem 2rem', background: '#0A1628' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(37,99,235,0.1)', padding: '0.375rem 1rem', borderRadius: 50, color: '#93C5FD', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1rem', border: '1px solid rgba(96,165,250,0.15)' }}>
              <Zap size={14} /> Platform Capabilities
            </div>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', color: 'white', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Everything You Need in a Crisis
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto' }}>Complete disaster management tools for all stakeholders — affected people, volunteers, NGOs & administrators.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.75rem', cursor: 'default', transition: 'all 0.25s', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = `${f.color}40`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.3), 0 0 0 1px ${f.color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `${f.color}08`, filter: 'blur(20px)' }} />
                <div style={{ fontSize: '2rem', marginBottom: '0.875rem' }}>{f.icon}</div>
                <h4 style={{ fontFamily: 'Outfit,sans-serif', color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '0.375rem' }}>{f.title}</h4>
                <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ROLES SECTION
      ════════════════════════════════════════ */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, #0F172A, #1E3A8A)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', color: 'white', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Built for Every Stakeholder</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto' }}>Four distinct portals — each customized for the unique needs of every person in the relief ecosystem.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: '🆘', role: 'Affected Person', color: '#EF4444', features: ['Phone OTP quick access', 'Send SOS request', '"I\'m Safe" status', 'Request food, water, medicine', 'Find nearby safe camps', 'Track relief in real time'], to: '/login' },
              { icon: '🦺', role: 'Volunteer', color: '#2563EB', features: ['Register your skills', 'View nearby SOS requests', 'Accept rescue tasks', 'Navigate with live maps', 'Track task progress', 'Activity dashboard'], to: '/register' },
              { icon: '🏥', role: 'NGO / Relief Center', color: '#059669', features: ['Create & manage camps', 'Manage inventory', 'Approve relief requests', 'Assign volunteers', 'Accept donations', 'Relief distribution reports'], to: '/register' },
              { icon: '⚙️', role: 'Administrator', color: '#7C3AED', features: ['System-wide oversight', 'Manage all users', 'Broadcast disaster alerts', 'Monitor all SOS requests', 'Hazard zone broadcast', 'Analytics & reports'], to: '/login' },
            ].map(r => (
              <div key={r.role} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${r.color}30`, borderRadius: 20, padding: '2rem', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.background = `${r.color}12`; e.currentTarget.style.borderColor = `${r.color}60`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = `${r.color}30`; e.currentTarget.style.transform = ''; }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{r.icon}</div>
                <h4 style={{ fontFamily: 'Outfit,sans-serif', color: 'white', fontWeight: 800, fontSize: '1.125rem', marginBottom: '1rem' }}>{r.role}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {r.features.map(f => (
                    <li key={f} style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.5 }}>
                      <span style={{ color: r.color, flexShrink: 0, marginTop: 2 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate(r.to)} style={{ width: '100%', padding: '0.7rem', borderRadius: 10, background: `${r.color}20`, color: r.color, border: `1.5px solid ${r.color}40`, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = r.color; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${r.color}20`; e.currentTarget.style.color = r.color; }}>
                  Get Started →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA FOOTER SECTION
      ════════════════════════════════════════ */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(180deg, #0A1628, #050D1F)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(37,99,235,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', color: 'white', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '1rem' }}>Ready When Disasters Strike</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '2.5rem' }}>Join thousands of volunteers, NGOs, and emergency responders already keeping communities safer with ReliefLink.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/login')} style={{ padding: '0.9rem 2.25rem', borderRadius: 12, background: 'linear-gradient(135deg, #EF4444, #B91C1C)', color: 'white', fontWeight: 800, cursor: 'pointer', border: 'none', fontSize: '0.9375rem', boxShadow: '0 8px 24px rgba(239,68,68,0.35)' }}>🆘 Emergency Access</button>
            <button onClick={() => navigate('/register?role=volunteer')} style={{ padding: '0.9rem 2.25rem', borderRadius: 12, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.9)', fontWeight: 700, cursor: 'pointer', border: '1.5px solid rgba(255,255,255,0.15)', fontSize: '0.9375rem', backdropFilter: 'blur(8px)' }}>Volunteer Now</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#020812', color: '#475569', padding: '2rem', textAlign: 'center', fontSize: '0.8125rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
          <span style={{ fontSize: '1.125rem' }}>🆘</span>
          <span style={{ fontFamily: 'Outfit,sans-serif', color: '#94A3B8', fontWeight: 700, fontSize: '1rem' }}>ReliefLink</span>
          <span style={{ color: '#1E293B' }}>|</span>
          <span>Disaster Management Platform</span>
        </div>
        <p style={{ margin: '0 0 0.375rem', color: '#334155' }}>For emergencies, always call <strong style={{ color: '#EF4444' }}>112</strong> (National Emergency Number)</p>
        <p style={{ margin: 0, color: '#1E293B' }}>Built for MCA Mini Project · React + Vite + Node.js + MongoDB · Socket.io + Leaflet</p>
      </footer>
    </div>
  );
}

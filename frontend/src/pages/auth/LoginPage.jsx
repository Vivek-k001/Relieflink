import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { Phone, Mail, Lock, ArrowLeft, Eye, EyeOff, ChevronRight } from 'lucide-react';

const ROLES = [
  { value: 'affected', emoji: '🆘', label: 'Affected Person', desc: 'Quick access with phone OTP', color: '#DC2626' },
  { value: 'volunteer', emoji: '🦺', label: 'Volunteer', desc: 'Email + password login', color: '#2563EB' },
  { value: 'ngo', emoji: '🏥', label: 'NGO / Relief Center', desc: 'Email + password login', color: '#059669' },
  { value: 'admin', emoji: '⚙️', label: 'Administrator', desc: 'Email + password login', color: '#7C3AED' },
];

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phone.length < 10) { toast.error('Enter a valid phone number'); return; }
    setLoading(true);
    try {
      const res = await authAPI.sendOTP(phone);
      setOtpSent(true);
      if (res.data.devOtp) setDevOtp(res.data.devOtp);
      toast.success('OTP sent! Check console in dev mode.');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) { toast.error('Enter 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await authAPI.verifyOTP(phone, otp);
      setAuth(res.data.user, res.data.token);
      toast.success('Welcome to ReliefLink!');
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) { toast.error('Enter email and password'); return; }
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      const home = { volunteer: '/volunteer', ngo: '/ngo', admin: '/admin' }[res.data.user.role] || '/dashboard';
      navigate(home);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  if (!selectedRole) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #EFF6FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              <ArrowLeft size={16} /> Back to home
            </Link>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🆘</div>
            <h1 style={{ fontSize: '1.75rem', color: '#1E3A8A', fontFamily: 'Outfit,sans-serif', marginBottom: '0.5rem' }}>Access ReliefLink</h1>
            <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>Select your role to continue</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ROLES.map((r) => (
              <button key={r.value} onClick={() => setSelectedRole(r.value)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', border: '2px solid #E2E8F0', borderRadius: 14, background: 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                onMouseEnter={(e) => { e.currentTarget.style.border = `2px solid ${r.color}`; e.currentTarget.style.boxShadow = `0 4px 20px ${r.color}20`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.border = '2px solid #E2E8F0'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = ''; }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${r.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{r.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.9375rem' }}>{r.label}</div>
                  <div style={{ color: '#64748B', fontSize: '0.8125rem', marginTop: 2 }}>{r.desc}</div>
                </div>
                <ChevronRight size={18} style={{ color: '#94A3B8' }} />
              </button>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748B', fontSize: '0.875rem' }}>
            Don't have an account? <Link to="/register" style={{ color: '#2563EB', fontWeight: 600 }}>Register here</Link>
          </p>
        </div>
      </div>
    );
  }

  const roleInfo = ROLES.find(r => r.value === selectedRole);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #EFF6FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 440, background: 'white', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${roleInfo.color}, ${roleInfo.color}CC)`, padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{roleInfo.emoji}</div>
          <h2 style={{ color: 'white', fontFamily: 'Outfit, sans-serif', marginBottom: '0.25rem' }}>{roleInfo.label}</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>{roleInfo.desc}</p>
        </div>

        <div style={{ padding: '2rem' }}>
          <button onClick={() => setSelectedRole(null)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#64748B', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1.5rem', padding: 0 }}>
            <ArrowLeft size={15} /> Change role
          </button>

          {selectedRole === 'affected' ? (
            <>
              {!otpSent ? (
                <>
                  <div className="form-group">
                    <label className="form-label">📱 Phone Number</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                      <input className="form-control" style={{ paddingLeft: '2.5rem' }} placeholder="+91 XXXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendOTP()} />
                    </div>
                    <p className="form-hint">We'll send you a one-time password</p>
                  </div>
                  <button className="btn btn-primary btn-full btn-lg" onClick={handleSendOTP} disabled={loading}>
                    {loading ? <div className="spinner spinner-sm" /> : 'Send OTP'}
                  </button>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">🔐 Enter OTP</label>
                    <input className="form-control" placeholder="6-digit OTP" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleVerifyOTP()} style={{ fontSize: '1.5rem', letterSpacing: '0.5rem', textAlign: 'center' }} />
                    {devOtp && <p className="form-hint" style={{ color: '#F59E0B', fontWeight: 600 }}>🛠️ Dev OTP: {devOtp}</p>}
                  </div>
                  <button className="btn btn-primary btn-full btn-lg" onClick={handleVerifyOTP} disabled={loading}>
                    {loading ? <div className="spinner spinner-sm" /> : '✅ Verify & Login'}
                  </button>
                  <button onClick={() => setOtpSent(false)} style={{ width: '100%', textAlign: 'center', marginTop: '0.75rem', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>Resend OTP</button>
                </>
              )}
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input type="email" className="form-control" style={{ paddingLeft: '2.5rem' }} placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input type={showPwd ? 'text' : 'password'} className="form-control" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmailLogin()} />
                  <button onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button className="btn btn-primary btn-full btn-lg" onClick={handleEmailLogin} disabled={loading}>
                {loading ? <div className="spinner spinner-sm" /> : 'Log In'}
              </button>
            </>
          )}

          {selectedRole !== 'affected' && (
            <p style={{ textAlign: 'center', marginTop: '1.25rem', color: '#64748B', fontSize: '0.875rem' }}>
              New volunteer or NGO? <Link to="/register" style={{ color: '#2563EB', fontWeight: 600 }}>Register here</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

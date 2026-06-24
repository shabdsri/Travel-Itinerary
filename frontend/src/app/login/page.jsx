'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/user/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Invalid credentials');
      if (data.token) {
        localStorage.setItem('token', data.token);
        setSuccess('Authentication successful. Redirecting...');
        setTimeout(() => router.push('/dashboard'), 1500);
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Enter your credentials to access your travel suite</p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}
        {success && <div style={styles.successAlert}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" required style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required style={styles.input} 
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Verifying Session...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account? <a href="/signUp" style={styles.link}>Create one now</a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0b0f19', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  card: { backgroundColor: '#131c2e', padding: '40px 32px', borderRadius: '16px', width: '100%', maxWidth: '400px', border: '1px solid #1e293b', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)' },
  header: { marginBottom: '32px', textAlign: 'center' },
  title: { color: '#ffffff', fontSize: '26px', fontWeight: '700', letterSpacing: '-0.5px', margin: '0 0 8px 0', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { color: '#64748b', fontSize: '14px', margin: 0 },
  inputGroup: { marginBottom: '22px' },
  label: { display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '13px', fontWeight: '600', letterSpacing: '0.3px' },
  input: { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#f8fafc', fontSize: '14px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' },
  submitBtn: { width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', color: '#ffffff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)', transition: 'transform 0.1s ease' },
  errorAlert: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid rgba(239, 68, 68, 0.4)', fontSize: '13px', fontWeight: '500' },
  successAlert: { backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid rgba(34, 197, 94, 0.4)', fontSize: '13px', fontWeight: '500' },
  footerText: { color: '#64748b', marginTop: '28px', fontSize: '13px', textAlign: 'center', marginBottom: 0 },
  link: { color: '#38bdf8', textDecoration: 'none', fontWeight: '600', marginLeft: '4px' }
};

export default Login;
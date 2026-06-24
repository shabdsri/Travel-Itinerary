'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const AddItinerary = () => {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [itineraryDays, setItineraryDays] = useState(['']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddDay = () => { setItineraryDays([...itineraryDays, '']); };
  const handleDayChange = (index, value) => {
    const updatedDays = [...itineraryDays];
    updatedDays[index] = value;
    setItineraryDays(updatedDays);
  };
  const handleRemoveDay = (index) => {
    if (itineraryDays.length > 1) {
      setItineraryDays(itineraryDays.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Session expired. Redirecting to auth...');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/trip/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ destination, startDate, endDate, budget: Number(budget), itinerary: itineraryDays.filter(day => day.trim() !== '') }),
      });
      if (!response.ok) throw new Error('Data transmission logs faulted');
      setSuccess('Itinerary created successfully.');
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ marginBottom: '28px' }}>
          <button onClick={() => router.push('/dashboard')} style={styles.backBtn}>← Return to Overview</button>
          <h2 style={styles.title}>Initialize Travel Plan</h2>
          <p style={styles.subtitle}>Log parameters to chart dynamic execution schedules</p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}
        {success && <div style={styles.successAlert}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Destination Route</label>
            <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Kyoto, Switzerland" required style={styles.input} />
          </div>

          <div style={styles.row}>
            <div style={{ flex: 1, marginRight: '14px' }}>
              <label style={styles.label}>Start Window</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={styles.input} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>End Window</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={styles.input} />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Financial Limit (INR)</label>
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Cost index value" required style={styles.input} />
          </div>

          <div style={styles.section}>
            <label style={styles.sectionLabel}>Timeline Metrics Allocation</label>
            {itineraryDays.map((dayText, index) => (
              <div key={index} style={styles.dayRow}>
                <span style={styles.dayNum}>Day {index + 1}</span>
                <input type="text" value={dayText} onChange={(e) => handleDayChange(index, e.target.value)} placeholder="Activity block data" required style={styles.input} />
                {itineraryDays.length > 1 && (
                  <button type="button" onClick={() => handleRemoveDay(index)} style={styles.removeBtn}>Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddDay} style={styles.addBtn}>+ Append Schedule Block</button>
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Executing Deploy...' : 'Deploy Itinerary'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0b0f19', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  card: { backgroundColor: '#131c2e', padding: '40px 36px', borderRadius: '16px', width: '100%', maxWidth: '560px', border: '1px solid #1e293b', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)' },
  backBtn: { backgroundColor: 'transparent', border: 'none', color: '#64748b', padding: 0, fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginBottom: '14px', transition: 'color 0.2s' },
  title: { color: '#ffffff', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px', margin: '0 0 6px 0', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { color: '#64748b', fontSize: '13px', margin: 0 },
  inputGroup: { marginBottom: '20px' },
  row: { display: 'flex', marginBottom: '20px' },
  label: { display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '13px', fontWeight: '600' },
  input: { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  section: { borderTop: '1px solid #1e293b', marginTop: '28px', paddingTop: '24px', marginBottom: '28px' },
  sectionLabel: { display: 'block', color: '#ffffff', marginBottom: '16px', fontSize: '14px', fontWeight: '600', letterSpacing: '0.3px' },
  dayRow: { display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' },
  dayNum: { color: '#64748b', fontSize: '13px', fontWeight: 'bold', minWidth: '45px' },
  removeBtn: { backgroundColor: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '11px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  addBtn: { backgroundColor: 'transparent', border: '1px solid #334155', color: '#38bdf8', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
  submitBtn: { width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', color: '#ffffff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)' },
  errorAlert: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(239, 68, 68, 0.4)', fontSize: '13px' },
  successAlert: { backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(34, 197, 94, 0.4)', fontSize: '13px' }
};

export default AddItinerary;
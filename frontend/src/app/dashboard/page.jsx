'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editTripId, setEditTripId] = useState('');
  const [editDestination, setEditDestination] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editItinerary, setEditItinerary] = useState([]);

  useEffect(() => { fetchMyTrips(); }, []);

  const fetchMyTrips = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    try {
      const response = await fetch('http://localhost:5000/trip/getmytrips', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch dashboard data');
      setTrips(data);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const openEditModal = (trip) => {
    setEditTripId(trip._id);
    setEditDestination(trip.destination);
    setEditStartDate(trip.startDate);
    setEditEndDate(trip.endDate);
    setEditBudget(trip.budget);
    setEditItinerary(trip.itinerary);
    setIsEditing(true);
  };

  const handleItineraryChange = (index, value) => {
    const updated = [...editItinerary];
    updated[index] = value;
    setEditItinerary(updated);
  };

  const handleUpdateTrip = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/trip/update/${editTripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ destination: editDestination, startDate: editStartDate, endDate: editEndDate, budget: Number(editBudget), itinerary: editItinerary })
      });
      if (!response.ok) throw new Error('Update failed');
      const updatedTrip = await response.json();
      setTrips(trips.map(trip => trip._id === editTripId ? updatedTrip : trip));
      setIsEditing(false);
    } catch (err) { alert(err.message); }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!confirm('Are you sure you want to delete this itinerary?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/trip/delete/${tripId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Delete failed');
      setTrips(trips.filter(trip => trip._id !== tripId));
    } catch (err) { alert(err.message); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>Travel Control Center</h1>
        <div style={styles.navButtons}>
          <button onClick={() => router.push('/add-itinerary')} style={styles.addBtn}>Plan New Trip</button>
          <button onClick={() => { localStorage.removeItem('token'); router.push('/login'); }} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}

      {loading ? (
        <div style={styles.message}>Loading itinerary metrics...</div>
      ) : trips.length === 0 ? (
        <div style={styles.emptyState}>
          <h3 style={{ margin: '0 0 10px 0', color: '#ffffff', fontSize: '18px' }}>No active itineraries</h3>
          <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>Deploys are empty. Start mapping your upcoming travel pipeline database today.</p>
          <button onClick={() => router.push('/add-itinerary')} style={styles.addBtn}>Create First Plan</button>
        </div>
      ) : (
        <div style={styles.grid}>
          {trips.map((trip) => (
            <div key={trip._id} style={styles.tripCard}>
              <div style={styles.cardHeader}>
                <h2 style={styles.destinationTitle}>📍 {trip.destination}</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => openEditModal(trip)} style={styles.actionIcon} title="Edit">Edit</button>
                  <button onClick={() => handleDeleteTrip(trip._id)} style={styles.actionIconDanger} title="Delete">Delete</button>
                </div>
              </div>
              <div style={styles.detailsRow}>
                <span>📅 {trip.startDate} — {trip.endDate}</span>
                <span style={styles.budgetText}>💰 INR {trip.budget.toLocaleString()}</span>
              </div>
              <hr style={styles.divider} />
              <h4 style={styles.itineraryHeading}>Schedule Blueprint</h4>
              <ul style={styles.itineraryList}>
                {trip.itinerary.map((dayPlan, index) => (
                  <li key={index} style={styles.itineraryItem}>{dayPlan}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={styles.modalTitle}>Update Travel Log</h3>
            <form onSubmit={handleUpdateTrip}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Destination Target</label>
                <input type="text" value={editDestination} onChange={(e) => setEditDestination(e.target.value)} style={styles.input} required />
              </div>
              <div style={styles.row}>
                <div style={{ flex: 1, marginRight: '12px' }}>
                  <label style={styles.label}>Start Date</label>
                  <input type="date" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} style={styles.input} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>End Date</label>
                  <input type="date" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} style={styles.input} required />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Financial Budget (INR)</label>
                <input type="number" value={editBudget} onChange={(e) => setEditBudget(e.target.value)} style={styles.input} required />
              </div>

              <label style={styles.label}>Timeline Array Parameters</label>
              {editItinerary.map((day, idx) => (
                <div key={idx} style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', marginRight: '12px', fontSize: '13px', fontWeight: 'bold', minWidth: '45px' }}>Day {idx+1}</span>
                  <input type="text" value={day} onChange={(e) => handleItineraryChange(idx, e.target.value)} style={styles.input} />
                </div>
              ))}

              <div style={{ display: 'flex', gap: '14px', marginTop: '28px' }}>
                <button type="submit" style={styles.saveBtn}>Commit Changes</button>
                <button type="button" onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Abort</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0b0f19', padding: '40px 48px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#f8fafc' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' },
  navTitle: { fontSize: '26px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.5px', margin: 0 },
  navButtons: { display: 'flex', gap: '14px' },
  addBtn: { background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)' },
  logoutBtn: { backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '10px 20px', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer' },
  message: { textAlign: 'center', fontSize: '14px', marginTop: '48px', color: '#64748b' },
  emptyState: { textAlign: 'center', padding: '48px 32px', backgroundColor: '#131c2e', borderRadius: '16px', border: '1px solid #1e293b', maxWidth: '460px', margin: '64px auto', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '28px' },
  tripCard: { backgroundColor: '#131c2e', padding: '26px', borderRadius: '16px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.02)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  destinationTitle: { fontSize: '20px', fontWeight: '700', color: '#ffffff', margin: 0, letterSpacing: '-0.3px' },
  actionIcon: { backgroundColor: '#1e293b', border: '1px solid #334155', color: '#38bdf8', fontSize: '12px', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' },
  actionIconDanger: { backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '12px', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' },
  detailsRow: { display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '13px', marginBottom: '18px', fontWeight: '500' },
  budgetText: { color: '#34d399', fontWeight: '600' },
  divider: { border: '0', borderTop: '1px solid #1e293b', marginBottom: '18px' },
  itineraryHeading: { fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '12px', margin: 0, letterSpacing: '0.5px', textTransform: 'uppercase' },
  itineraryList: { paddingLeft: '18px', color: '#cbd5e1', fontSize: '13px', lineHeight: '1.7', margin: 0 },
  itineraryItem: { marginBottom: '8px' },
  errorAlert: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '24px', border: '1px solid rgba(239, 68, 68, 0.4)', fontSize: '13px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(5, 8, 15, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' },
  modalCard: { backgroundColor: '#131c2e', padding: '36px', borderRadius: '20px', border: '1px solid #1e293b', width: '100%', maxWidth: '500px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' },
  modalTitle: { color: '#ffffff', fontSize: '22px', marginBottom: '24px', fontWeight: '700', margin: '0 0 24px 0', letterSpacing: '-0.4px' },
  inputGroup: { marginBottom: '18px' },
  row: { display: 'flex', marginBottom: '18px' },
  label: { display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '13px', fontWeight: '600' },
  input: { width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  saveBtn: { flex: 1, background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)' },
  cancelBtn: { flex: 1, backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '12px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }
};

export default Dashboard;
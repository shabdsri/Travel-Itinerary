'use client'
import React, { useState } from 'react';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Frontend Validations
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/user/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess('Registration successful! You can now login.');
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join us to plan your next travel itinerary</p>
        
        {error && <div style={styles.errorAlert}>{error}</div>}
        {success && <div style={styles.successAlert}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input 
              type="text" name="username" value={formData.username} 
              onChange={handleChange} required style={styles.input} placeholder="johndoe"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" name="email" value={formData.email} 
              onChange={handleChange} required style={styles.input} placeholder="name@example.com"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" name="password" value={formData.password} 
              onChange={handleChange} required style={styles.input} placeholder="••••••••"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input 
              type="password" name="confirmPassword" value={formData.confirmPassword} 
              onChange={handleChange} required style={styles.input} placeholder="••••••••"
            />
          </div>

          <button type="submit" style={styles.button}>Sign Up</button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <a href="/login" style={styles.link}>Login here</a>
        </p>
      </div>
    </div>
  );
};

// Inline Dark/Modern Styles (Aap ise Tailwind ya CSS file mein convert kar sakte hain)
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#121212', fontFamily: 'Arial, sans-serif' },
  card: { backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', width: '100%', maxWidth: '400px', textAlign: 'center', border: '1px solid #2d2d2d' },
  title: { color: '#ffffff', marginBottom: '8px', fontSize: '28px' },
  subtitle: { color: '#aaa', marginBottom: '24px', fontSize: '14px' },
  form: { textAlign: 'left' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', color: '#ccc', marginBottom: '6px', fontSize: '14px' },
  input: { width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: '#fff', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#00adb5', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', transition: 'background 0.3s' },
  errorAlert: { backgroundColor: '#ff4d4d22', color: '#ff4d4d', padding: '10px', borderRadius: '6px', marginBottom: '15px', border: '1px solid #ff4d4d', fontSize: '14px' },
  successAlert: { backgroundColor: '#2ecc7122', color: '#2ecc71', padding: '10px', borderRadius: '6px', marginBottom: '15px', border: '1px solid #2ecc71', fontSize: '14px' },
  footerText: { color: '#aaa', marginTop: '20px', fontSize: '14px' },
  link: { color: '#00adb5', textDecoration: 'none', fontWeight: 'bold' }
};

export default Signup;
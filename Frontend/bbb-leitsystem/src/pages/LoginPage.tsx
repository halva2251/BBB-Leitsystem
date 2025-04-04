import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Hier Backend-Login-Logik integrieren
    console.log("Login:", email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input 
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input 
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required 
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

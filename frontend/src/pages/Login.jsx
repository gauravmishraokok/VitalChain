import React, { useState } from 'react';
import axios from 'axios';
import { Shield, Lock, ArrowRight } from 'lucide-react';
import GlassCard from '../components/shared/GlassCard';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      onLogin();
    } catch (err) {
      setError('Invalid cryptographic credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-deep relative overflow-hidden">
        {/* Subtle background effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-cyan/10 rounded-full blur-[120px]" />
        
        <GlassCard className="w-full max-w-md p-8" glowColor="var(--accent-cyan)">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent-cyan/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent-cyan/20">
                    <Shield className="w-8 h-8 text-accent-cyan" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase">MediChain <span className="text-accent-cyan">Login</span></h1>
                <p className="text-text-muted text-xs font-medium uppercase tracking-widest mt-1">Verifiable Health Intelligence Portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 ml-1">Terminal ID</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-cyan transition-colors"
                            placeholder="ADMIN_USER"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 ml-1">Access Key</label>
                    <div className="relative">
                        <Lock className="absolute right-4 top-3.5 w-4 h-4 text-text-muted" />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-cyan transition-colors"
                            placeholder="••••••••••••"
                        />
                    </div>
                </div>

                {error && <p className="text-accent-red text-[10px] font-bold uppercase text-center">{error}</p>}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-accent-cyan text-bg-deep font-black uppercase tracking-tighter py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-colors group"
                >
                    {loading ? 'Authenticating...' : (
                        <>
                            Open Session <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-[9px] text-text-muted leading-relaxed uppercase font-medium">
                    Protected by AES-256 GCM & RSA-2048 <br/>
                    © 2024 VitalChain Research Group
                </p>
            </div>
        </GlassCard>
    </div>
  );
};

export default Login;

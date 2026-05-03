import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../components/shared/GlassCard';
import MerkleVisualizer from '../components/blockchain/MerkleVisualizer';
import { Database, Search, ShieldCheck } from 'lucide-react';

const AuditPortal = () => {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('/api/audit/logs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setLogs(res.data);
        if (res.data.length > 0) setSelectedLog(res.data[0]);
      } catch (err) {
        console.error('Audit logs fetch failed', err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-bg-deep p-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
             <Database className="text-accent-green" /> Verification <span className="text-accent-green">Portal</span>
           </h1>
           <p className="text-text-muted text-[10px] uppercase font-bold tracking-widest">Public Merkle Proof Audit Trail</p>
        </div>
        <div className="flex gap-4">
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10">Export Ledger</button>
            <button className="px-4 py-2 bg-accent-green text-bg-deep rounded-lg text-xs font-black uppercase">Verify Live Proof</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <GlassCard className="h-[70vh] overflow-hidden flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4">Blockchain Commit History</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-bg-card backdrop-blur-md">
                  <tr className="text-[10px] text-text-muted uppercase font-bold border-b border-white/10">
                    <th className="py-3 px-2">TX Hash</th>
                    <th className="py-3 px-2">Block</th>
                    <th className="py-3 px-2">Root</th>
                    <th className="py-3 px-2">Size</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {logs.map(log => (
                    <tr 
                      key={log.tx_hash} 
                      onClick={() => setSelectedLog(log)}
                      className={`border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${selectedLog?.tx_hash === log.tx_hash ? 'bg-accent-green/10' : ''}`}
                    >
                      <td className="py-4 px-2 font-mono text-accent-cyan">{log.tx_hash.slice(0, 12)}...</td>
                      <td className="py-4 px-2 text-text-primary">{log.block_number}</td>
                      <td className="py-4 px-2 font-mono text-text-muted">{log.merkle_root.slice(0, 12)}...</td>
                      <td className="py-4 px-2">{log.batch_size} pkts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-5">
            {selectedLog && (
                <div className="space-y-6">
                    <GlassCard glowColor="var(--accent-green)">
                        <h3 className="text-xs font-black uppercase tracking-widest mb-4">Cryptographic Visualization</h3>
                        <MerkleVisualizer root={selectedLog.merkle_root} batch_size={selectedLog.batch_size} />
                    </GlassCard>

                    <GlassCard>
                        <h3 className="text-xs font-black uppercase tracking-widest mb-4">Log Metadata</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-[10px] text-text-muted uppercase">IPFS CID</span>
                                <span className="text-[10px] font-mono text-accent-cyan">{selectedLog.ipfs_cid}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[10px] text-text-muted uppercase">Timestamp</span>
                                <span className="text-[10px] text-text-primary">{new Date(selectedLog.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[10px] text-text-muted uppercase">On-Chain Status</span>
                                <span className="flex items-center gap-1 text-[10px] text-accent-green font-bold">
                                    <ShieldCheck className="w-3 h-3" /> IMMUTABLE
                                </span>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AuditPortal;

import React, { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';

const BlockchainTicker = () => {
    const [commits, setCommits] = useState([]);
    const { on } = useSocket();

    useEffect(() => {
        const unsubscribe = on('blockchain:commit', (data) => {
            setCommits(prev => [data, ...prev].slice(0, 10));
        });
        return () => unsubscribe();
    }, [on]);

    if (commits.length === 0) {
        return <div className="text-[10px] text-text-muted px-4 italic">Synchronizing with Ethereum Mainnet...</div>;
    }

    return (
        <div className="flex-1 overflow-hidden h-full flex items-center">
            <div className="flex gap-8 px-4 animate-[ecg-scroll_30s_linear_infinite] whitespace-nowrap">
                {commits.map((commit, i) => (
                    <div key={commit.tx_hash + i} className="flex items-center gap-2">
                        <span className="text-[10px] text-accent-green font-black uppercase">BLOCK {commit.block_number}</span>
                        <span className="text-[10px] text-text-muted font-mono">{commit.tx_hash.slice(0, 16)}...</span>
                        <span className="text-[10px] text-accent-cyan font-bold">BATCH {commit.batch_size}</span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlockchainTicker;

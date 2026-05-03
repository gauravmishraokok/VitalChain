import React, { createContext, useContext, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const url = 'http://localhost:5000';

    if (!socketRef.current) {
        socketRef.current = io(url, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000
        });
        
        socketRef.current.on('connect', () => {
            console.log('[SOCKET] Connected to Backend');
        });
        
        socketRef.current.on('disconnect', (reason) => {
            console.log('[SOCKET] Disconnected:', reason);
        });
    }

    return (
        <SocketContext.Provider value={socketRef.current}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (!socket) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return socket;
};

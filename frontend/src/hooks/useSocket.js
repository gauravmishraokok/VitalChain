import { useCallback } from 'react';
import { useSocket as useSocketContext } from '../context/SocketContext';

export const useSocket = () => {
    const socket = useSocketContext();
    
    const on = useCallback((event, handler) => {
        socket.on(event, handler);
        return () => {
            socket.off(event, handler);
        };
    }, [socket]);
    
    const emit = useCallback((event, data) => {
        socket.emit(event, data);
    }, [socket]);
    
    return { on, emit, socket };
};

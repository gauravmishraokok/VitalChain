let io;

const init = (socketIo) => {
    io = socketIo;
    io.on('connection', (socket) => {
        console.log('Client connected to Socket.io');
        
        socket.on('acknowledge:alert', (data) => {
            console.log('Alert acknowledged via socket:', data);
            // This could trigger database updates or other logic
        });

        socket.on('request:history', (data) => {
            console.log('History requested via socket:', data);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected from Socket.io');
        });
    });

    // System stats interval
    setInterval(() => {
        emit('system:stats', {
            tps: Math.random() * 10,
            queue_depth: Math.floor(Math.random() * 5),
            anomaly_rate: Math.random() * 0.05
        });
    }, 5000);
};

const emit = (event, data) => {
    if (io) {
        io.emit(event, data);
    }
};

module.exports = { init, emit };

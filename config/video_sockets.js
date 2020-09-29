module.exports.videoSockets= function(socketServer){
    const io= require('socket.io')(socketServer);
    
    io.on('connection', socket => {
        socket.on('join-room', (roomId, userId) => {
            socket.join(roomId)
            socket.to(roomId).broadcast.emit('user-connected', userId)
    
            socket.on('disconnect', () => {
                socket.to(roomId).broadcast.emit('user-disconnected', userId)
            })
        })
    })
}
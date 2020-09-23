module.exports.chatSockets= function(socketServer){
    let io= require('socket.io')(socketServer);

    var temp;
    io.sockets.on('connection',function(socket){
        console.log('new connection received',socket.id);

        
        socket.on('disconnect',function(){
            io.in(temp.chatroom).emit('diss',temp);
            console.log('socket disconnected !');
        });

        socket.on('join_room',function(data){
            console.log('joining req. rec.',data);
            
            socket.join(data.chatroom);

            //if we want to emit in a specific chat room
            io.in(data.chatroom).emit('user_joined',data);

            temp=data;
        });

        //detect send message and broadcast to everyone in the room
        socket.on('send_message',function(data){
            io.in(data.chatroom).emit('receive_message',data);
        });
    });
}
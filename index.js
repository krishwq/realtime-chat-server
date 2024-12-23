const io=require('socket.io')(8000, {
    cors: {
        origin: "*", // Allow requests from this origin
        methods: ["GET", "POST"]       // Allow these HTTP methods
    }
});

const users={};
io.on('connection',socket=>{
    socket.on('new-user-joined',(name)=>{
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
        socket.emit('participant', users);
        socket.broadcast.emit('participant', users);
    });

    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,name:users[socket.id]})
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
        socket.broadcast.emit('participant', users);
    });
    
    socket.on('send-audio', (data) => {
        // Broadcast the audio buffer to all clients
        socket.broadcast.emit('receive-audio', {
            buffer: data.buffer,
            name: users[socket.id],
        });
    });
})
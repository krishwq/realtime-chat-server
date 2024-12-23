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
    
    socket.on('send-audio', (audiourl) => {
        socket.broadcast.emit('receive-audio', { name: users[socket.id], audio:audiourl });
    });
})
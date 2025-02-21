
const app = require('./src/app');
//  read documentation
const server = require('http').createServer(app);  // pass the app 

//  socket.io setup for real-time communication  // copy the code from the npm soket.io package ffrom the npm webstie
const io = require('socket.io')(server);
io.on('connection', socket => {
    socket.on('message', message => {
        console.log('Received message:', message);
        io.emit('message', message);  // broadcast the message to all connected clients
    });
    console.log('New user connected');  // a new user connected to the server
});
server.listen(3000 ,() => {
    console.log('Server is running on port 3000');  // Server is listening on port 3000
});


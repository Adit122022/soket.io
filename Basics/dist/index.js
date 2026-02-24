"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
//  Seperate stand alone server for handshaking 
const wss = new ws_1.WebSocketServer({ port: 8080 });
// 0 : CONNECTION
// 1 : OPEN (The Only state where you can safely. send())
// 2 : CLOSING
// 3 : CLOSED
//  Conneection Event
wss.on("connection", (socket, request) => {
    // socket  -> individual connection to client
    //  request -> cookies ,  IP address etc
    const ip = request.socket.remoteAddress;
    socket.on('message', (rawData) => {
        console.log({ rawData });
        const message = rawData.toString();
        wss.clients.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN)
                client.send(`Server BroadCast :${message}`);
        });
        socket.on("error", (err) => {
            console.log(`Error :${err} :${ip}`);
        });
        socket.on("close", () => { console.log('Client Disconnected'); });
    });
});
//# sourceMappingURL=index.js.map
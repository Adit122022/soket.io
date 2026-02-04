# Socket.IO Implementation Details

This document explains the Socket.IO setup in `class_02`, specifically focusing on why we use `http.createServer()` and how the code works line-by-line.

## Why `http.createServer()`?

In a standard **Express** application, `app.listen()` usually creates the HTTP server for you internally. However, **Socket.IO** needs to attach itself to the _actual_ HTTP server instance to handle the initial handshake (which starts as HTTP and upgrades to WebSockets).

When we do:

```javascript
const app = express();
const node_server = createServer(app);
```

We are explicitly creating the raw Node.js HTTP server and passing our Express app as the handler for standard HTTP requests. We then pass this `node_server` to Socket.IO:

```javascript
const socket = new Server(node_server, { ... });
```

This allows both Express (handling routes like `/`) and Socket.IO (handling real-time connections) to run on the **same port** sharing the same server instance.

---

## Server Code Breakdown (`server/src/app.js`)

```javascript
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
```

**Lines 1-3**: Import necessary modules. `express` for the web framework, `createServer` from Node's built-in `http` module, and `Server` from the `socket.io` library.

```javascript
const app = express();
```

**Line 4**: Initialize the Express application. This `app` object handles standard API routes.

```javascript
const node_server = createServer(app);
```

**Line 7**: **CRITICAL STEP**. We create a raw HTTP server using Node's built-in module. We pass `app` to it so that any regular HTTP requests (like GET /) are still handled by Express.

```javascript
const socket = new Server(node_server, {
  cors: { origin: "http://localhost:5173" },
});
```

**Lines 9-11**: We initialize Socket.IO by passing it the `node_server` we just created.

- **Why?** So Socket.IO can intercept the upgrade requests.
- **CORS**: We enable Cross-Origin Resource Sharing for `localhost:5173` (your React client), or else the browser would block the connection.

```javascript
socket.on("connection", (client) => {
    console.log("User connected", client.id);
```

**Line 12**: The main event listener. It triggers every time a new client (browser tab) connects.

- `client` (often called `socket`): Represents _that specific user's_ connection.
- `client.id`: A unique ID generated for that session.

```javascript
    client.on("message", (data) => {
        socket.emit("message", data);
    })
});
```

**Lines 15-17**:

- `client.on("message", ...)`: We listen for a specific event named "message" coming _from this client_.
- `data`: The payload sent by the user (e.g., the chat text).
- `socket.emit("message", data)`: **BROADCAST**. We use the global `socket` (the IO server instance) to send this message to _everyone_ connected, including the sender.

```javascript
app.get("/", (req, res) => {
  res.send("AFRICA KI MUDRAA");
});
```

**Lines 21-23**: A standard Express route to prove the server handles normal HTTP too.

```javascript
export default node_server;
```

**Line 25**: We export the `node_server` so `index.js` can call `.listen()` on it.

---

## Client Code Breakdown (`client/src/App.jsx`)

```javascript
import { io } from "socket.io-client";
const socket = io("http://localhost:8080");
```

**Line 2 & 4**: Import the client library and connect to the backend URL. This initiates the handshake.

```javascript
useEffect(() => {
  socket.on("message", (chat) => {
    setData(chat);
  });
}, []);
```

**Lines 8-13**:

- `useEffect`: Runs once when the component mounts.
- `socket.on("message", ...)`: Sets up a listener for incoming messages from the server.
- `setData(chat)`: Updates the React state with the received message, causing a re-render to show it.

```javascript
const send = (e) => {
  e.preventDefault();
  socket.emit("message", input);
  setInput("");
};
```

**Lines 15-20**:

- `e.preventDefault()`: Prevents the form/button from refreshing the page.
- `socket.emit("message", input)`: Sends an event named "message" to the server. `input` is the text payload.
- `setInput('')`: Clears the input field.

```javascript
<button onClick={send}>send</button>
```

**Line 27**: formatting triggers the `send` function when clicked.

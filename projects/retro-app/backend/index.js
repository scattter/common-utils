import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import {getHashMapValue, setHashMapValue} from "./storage/redis/utils.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

// app.get('/', (req, res) => {
//   res.sendFile(new URL('./index.html', import.meta.url).pathname);
// })

let room = ''

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  socket.on('room', async (roomId) => {
    const data = await getHashMapValue(`room-${roomId}`)
    room = roomId
    socket.emit('receiver', data)
  })
  socket.on('update', async (msg) => {
    // data = msg
    await setHashMapValue(`room-${room}`, msg)
    const data = await getHashMapValue(`room-${room}`)
    socket.broadcast.emit('receiver', data)
  })
})

// io.on('room', (msg) => {
//   console.log(msg)
// })

server.listen(3000, () => {
  console.log('listening on *:3000');
})
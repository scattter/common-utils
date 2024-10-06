import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(new URL('./index.html', import.meta.url).pathname);
})

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  socket.on('send', (msg) => {
    socket.broadcast.emit('receiver', `客户端${socket.id}说: ${msg}`)
  })
})

server.listen(4000, () => {
  console.log('listening on *:4000');
})
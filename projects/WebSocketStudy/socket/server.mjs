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
  socket.on('chat message', (msg) => {
    console.log(msg, '来活了')
    io.emit('receiver', '发送消息了')
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000');
})
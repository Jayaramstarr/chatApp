const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 5000

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

if(process.env.NODE_ENV == "production")
{
  app.use(express.static("client/build"))
}

io.on('connection', socket => {
  const id = socket.handshake.query.id
  socket.join(id)

  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach(recipient => {
      const newRecipients = recipients.filter(r => r !== recipient)
      newRecipients.push(id)
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients, sender: id, text
      })
    })
  })
})

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
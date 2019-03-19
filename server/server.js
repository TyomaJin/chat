const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../front-end/ngApp/dist/ngApp");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (client) => {
    console.log('Client connected...');

    client.on('join', (data) => {
        console.log(data)
        client.emit('messages', 'Hello from server');
    });

    client.on('messages', function(data) {
        client.emit('broad', data);
        client.broadcast.emit('broad',data);
    });
})

server.listen(port, () => console.log(`App listening on port ${port}!`))

// app.get('/', (req, res) => res.send('Hello World!'))

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const dbUrl = 'mongodb+srv://user:pass@cluster0-jbpi0.mongodb.net/test?retryWrites=true';
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../front-end/ngApp/dist/ngApp");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

mongoose.connect(dbUrl , (err) => { 
    console.log('mongodb connected',err);
 })

var Message = mongoose.model('Message',{ name : String, message : String})

app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
        res.send(messages);
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
        if(err)
            sendStatus(500);
        io.emit('message', req.body);
        res.sendStatus(200);
    })
})

// io.on('connection', (client) => {
//     console.log('Client connected...');

//     client.on('join', (data) => {
//         console.log(data)
//         client.emit('messages', 'Hello from server');
//     });

//     client.on('messages', function(data) {
//         client.emit('broad', data);
//         client.broadcast.emit('broad',data);
//     });
// })

server.listen(port, () => console.log(`App listening on port ${port}!`))

// app.get('/', (req, res) => res.send('Hello World!'))

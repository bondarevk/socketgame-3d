let express = require('express');
let expressServer = express();
let httpServer = require('http').Server(expressServer);
const io = require('socket.io')(httpServer);

const serverPort = 80;

expressServer.use(express.static('../public'));
httpServer.listen(serverPort, function () {
    console.log('Сервер запущен. *:' + serverPort);
});

io.on('connection', function (socket) {
    console.log(socket.id + 'Connect');



    socket.on('disconnect', function () {
        console.log(socket.id + 'Disconnect');
    });
});
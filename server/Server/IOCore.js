const express = require('express');
const expressServer = express();
const httpServer = require('http').Server(expressServer);

const IOUtils = require('../Utils/IOUtils');
//const ServerUtils = require('../Utils/ServerUtils');
//const GameUtils = require('../Utils/GameUtils');

const serverPort = 80;

const IOCore = {

    io: require('socket.io')(httpServer),

    init: () => {
        expressServer.use(express.static('../public'));
        httpServer.listen(serverPort, function () {
            console.log('Сервер запущен. *:' + serverPort);
        });

        IOCore.io.on('connection', function (socket) {
            IOCore.onConnect(socket);
            IOCore.initEvents(socket);
            socket.on('disconnect', function () {
                IOCore.onDisconnect(socket);
            });
        });
    },

    initEvents: (socket) => {

    },

    onConnect: (socket) => {
        IOUtils.clientRunUp(socket);
    },

    onDisconnect: (socket) => {

    },



    Packet: {
        clientRunUp: (id) => {
            let packet = {};

            packet.inputReq = [87, 83, 65, 68, 16];

            return packet;
        }
    }

};


module.exports = IOCore;
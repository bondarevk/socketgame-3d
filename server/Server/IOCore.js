const express = require('express');
const expressServer = express();
const httpServer = require('http').Server(expressServer);

const IOUtils = require('../Utils/IOUtils');
const TickManager = require('./TickManager');
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

        socket.on('clientInput', (packet) => {
            function Mouse(isDown, button) {
                this.isDown = isDown || false;
                this.button = button || 1;
            }

            let input = {};
            try {
                input.keyboard = new Map(packet.keyboard);
                input.mouse = new Mouse(packet.mouse.isDown, packet.mouse.button);
            } catch (err) {
                input.keyboard = new Map();
                input.mouse = new Mouse();
            }
            //socket.player.input = input;

            if (input.mouse.isDown === true) {
                console.log(input);
            }

        });

    },

    onConnect: (socket) => {
        IOUtils.clientRunUp(socket);
    },

    onDisconnect: (socket) => {

    },



    Packet: {
        clientRunUp: () => {
            let packet = {};

            packet.inputReq = [87, 83, 65, 68, 16];
            packet.tickrate = TickManager.tickrate;

            return packet;
        }
    }

};


module.exports = IOCore;
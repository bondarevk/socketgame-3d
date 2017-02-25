const express = require('express');
const expressServer = express();
const httpServer = require('http').Server(expressServer);

const IOUtils = require('../Utils/IOUtils');
const TickManager = require('./TickManager');
const Chat = require('../Chat/Chat');
const Player = require('../Entity/Player');

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

        // Chat
        socket.on('chatMessage', (packet) => {
            Chat.onMessageReceive(socket, packet);
        });

        // Input
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
            input.cameraDirection = packet.cameraDirection;

            socket.player.input = input;
        });

    },

    onConnect: (socket) => {
        socket.player = new Player();
        socket.player.onConnect(socket);

        IOUtils.clientRunUp(socket);
        IOUtils.spawnEntity(socket.player);
        IOUtils.bindCamera(socket, socket.player.id);
        Chat.reloadChatHistory(socket);
    },

    onDisconnect: (socket) => {
        socket.player.onDisconnect(socket);
        IOUtils.despawnEntity(socket.player.id);
    },



    Packet: {
        clientRunUp: (socket) => {
            let packet = {};

            packet.entityMap = { };
            global.Server.globalEntityMap.forEach((entity, id, map) => {
                packet.entityMap[id] = entity.generatePacket();
            });

            if (socket.player instanceof Player) {
                packet.player = {
                    id: socket.player.id
                };
            } else {
                packet.player = {
                    id: null
                };
            }

            packet.inputReq = [87, 83, 65, 68, 16];
            packet.tickrate = TickManager.tickrate;

            return packet;
        },

        clientEntityMapUpdate: () => {
            let packet = {};
            packet.entityMap = { };

            global.Server.globalEntityMap.forEach((entity, id) => {
                if (entity.updateNeeded === true) {
                    packet.entityMap[id] = entity.generatePacket();
                    entity.updateNeeded = false;
                }
            });

            return packet;
        },

        bindCamera: (camera) => {
            // Привязать камеру к объекту или координатам
            return camera;
        }
    }

};


module.exports = IOCore;
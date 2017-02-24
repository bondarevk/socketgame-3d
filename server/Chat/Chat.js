let IOUtils = require('../Utils/IOUtils');

class Message {
    constructor(nick, text, id) {
        this.nick = nick;
        this.text = text;
        this.date = Date.now();
        this.id = id;
    }
}

let Chat = {
    message_history: [],
    players_online: [],

    sendMessage: (nickname, text, senderid) => {
        let message = new Message(nickname, text, senderid);
        console.log(message);
        Chat.message_history.push(message);
        IOUtils.sendMessageToChat(message);
    },

    onMessageReceive: (socket, msg) => {
        Chat.sendMessage(socket.player.Nickname, msg, socket.player.id);
    },

    onPlayerConnect: (socket) => {
        socket.emit('init chat', Chat.message_history);
        socket.emit('reload players', Chat.players_online);
        Chat.players_online.push(socket.player.id);
        global.IOCore.io.emit('add player', socket.player.id);
    },

    onPlayerDisconnect: (socket) => {
        Chat.players_online.splice(Chat.players_online.indexOf(socket.player.id), 1);
        global.IOCore.io.emit('delete player', socket.player.id);
    }
};

module.exports = Chat;
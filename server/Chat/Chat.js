const IOUtils = require('../Utils/IOUtils');
const MathUtils = require('../Utils/MathUtils');

class Message {
    constructor(nickname, text, sender, style) {
        this.id = MathUtils.guid();
        this.nickname = nickname;
        this.text = text || '';
        this.sender = sender || 0;
        this.date = Date.now();
        this.style = style || '';
    }
}

const Chat = {
    chat: [],

    sendMessage: (nickname, text, sender) => {
        let message = new Message(nickname, text, sender);
        Chat.chat.push(message);
        IOUtils.sendChatMessage(message);
    },

    reloadChatHistory: (socket) => {
        IOUtils.loadChatHistory(socket, Chat.chat);
    },

    clearChat: () => {
        chat = [];
        Chat.reloadChatHistory(global.IOCore.io);
    },

    onMessageReceive: (socket, text) => {
        if (typeof text === 'string' && socket.player instanceof Object) {
            Chat.sendMessage(socket.player.Nickname, text, socket.player.id);
        }
    }
};

module.exports = Chat;

class ChatMessage {
    constructor(id, nickname, text, date, sender, style) {
        this.id = id || 'unknown';
        this.nickname = nickname || 'Unknown';
        this.text = text || '';
        this.sender = sender || '0';
        this.date = new Date(date || Date.now());
        this.style = style || '';
    }

    toString() {
        // Стиль сообщения
        let style;
        if (this.sender === Game.player.id) {
            style = 'msg-1'; // Свое сообщение
        } else {
            style = 'msg-0';
        }
        style += ' ' + this.style;

        // Дата
        let options = {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };

        return '<li class="' + style + '"><div class="author"><p>' + this.nickname +
            '</p></div><div class="text"><p>' + this.text +
            '</p></div><div class="date"><p>' + this.date.toLocaleString("ru", options) +
            '</p></div></li>';
    }
}

const Chat = {

    _messageInput: $('#message'),
    _messageForm: $('#messageForm'),
    _onlineList: $('#onlineList'),
    _messagesList: $('#msgs'),
    _messagesScroll: undefined,

    init: () => {
        Chat._messagesScroll = new IScroll('#wrapper', {
            mouseWheel: true,
            disablePointer: true
        });

        Chat._messageForm.submit(() => {
            IO.socket.emit('chatMessage', Chat._messageInput.val());
            Chat._messageInput.val('');
            return false;
        });
    },

    initIO: (socket) => {

        // Полное обновление чата
        socket.on('chatHistory', function (chat) {
            let messages = [];
            chat.forEach((message) => {
                messages.push(new ChatMessage(message.id, message.nickname, message.text, message.date, message.sender, message.style));
            });

            Chat.clearChat();
            Chat.chatMessages(messages);
        });

        // Получение сообщения
        socket.on('chatMessage', function (message) {
            Chat.chatMessage(new ChatMessage(message.id, message.nickname, message.text, message.date, message.sender, message.style));
        });
    },



    // TODO: Online
    addPlayerToOnlineList: (id) => {
        if (Game.globalEntityMap.has(id)) {
            let nick = Game.globalEntityMap.get(id).nickname;
            Chat._onlineList.append('<li id="' + id + '">' + nick + '</li>');
        }
    },

    removePlayerFromOnlineList: (id) => {
        $("#" + id + "").remove();
    },

    clearPlayers: () => {
        Chat._onlineList.empty();
    },



    // Chat
    chatMessage: (message) => {
        Chat._messagesList.append(message.toString());
        Chat._refreshScroll();
    },

    chatMessages: (messages) => {
        messages.forEach((message) => {
            Chat._messagesList.append(message.toString());
        });
        Chat._refreshScroll();
    },

    clearChat: () => {
        Chat._messagesList.empty();
        Chat._refreshScroll();
    },

    _refreshScroll: () => {
        let autoscroll = false;
        if (Chat._messagesScroll.y <= Chat._messagesScroll.maxScrollY + 250) {
            autoscroll = true;
        }
        Chat._messagesScroll.refresh();
        if (autoscroll === true) {
            Chat._messagesScroll.scrollTo(0, Chat._messagesScroll.maxScrollY, 0);
        }
    },

    getDate: (date) => {
        let d = new Date(date);
        let year = d.getFullYear(),
            mnth = d.getMonth() < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1,
            day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate(),
            hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours(),
            min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes(),
            sec = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
        return year + '-' + mnth + '-' + day + ' ' + hour + ':' + min + ':' + sec;
    }
};

Chat.init();
let Chat = {

    messageInput: undefined,
    messageForm: undefined,
    onlineList: undefined,
    messagesList: undefined,
    messagesScroll: undefined,

    init: () => {
        Chat.messageInput = $('#message');
        Chat.messageForm = $('#messageForm');
        Chat.onlineList = $('#onlineList');
        Chat.messagesList = $('#msgs');
        Chat.messagesScroll = new IScroll('#wrapper', {
            mouseWheel: true,
            disablePointer: true
        });

        Chat.messageForm.submit(() => {
            IO.socket.emit('chat message', Chat.messageInput.val());
            Chat.messageInput.val('');
            return false;
        });
    },

    addPlayerToOnlineList: (id) => {
        if (Game.globalEntityMap.has(id)) {
            let nick = Game.globalEntityMap.get(id).nickname;
            Chat.onlineList.append('<li id="' + id + '">' + nick + '</li>');
        }
    },

    removePlayerFromOnlineList: (id) => {
        $("#" + id + "").remove();
    },

    addMessageToChat: (message) => {
        Chat.messagesList.append(message);
        Chat.refreshScroll();
    },

    clearChat: () => {
        Chat.messagesList.empty();
        Chat.refreshScroll();
    },

    clearPlayers: () => {
        Chat.onlineList.empty();
    },

    refreshScroll: () => {
        let autoscroll = false;
        if (Chat.messagesScroll.y <= Chat.messagesScroll.maxScrollY + 250) {
            autoscroll = true;
        }
        Chat.messagesScroll.refresh();
        if (autoscroll === true) {
            Chat.messagesScroll.scrollTo(0, Chat.messagesScroll.maxScrollY, 0);
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
    },

    initIO: (socket) => {

        //Добавление игроков в список
        socket.on('reload players', function (ids) {
            Chat.clearPlayers();
            if (ids.length !== 0) {
                ids.forEach((id) => {
                    Chat.addPlayerToOnlineList(id);
                });
            }
        });

        //Добавление игрока в список
        socket.on('add player', function (id) {
            Chat.addPlayerToOnlineList(id);
        });

        //Удаление игрока из списка
        socket.on('delete player', function (id) {
            Chat.removePlayerFromOnlineList(id);
        });


        //Инициализация чата для нового игрока
        socket.on('init chat', function (messages) {
            Chat.clearChat();

            messages.forEach(function (message) {
                if (message.id === Game.player.id)
                    Chat.messagesList.append('<li class="msg-1"><div class="author"><p>' + message.nick + '</p></div><div class="text"><p>' + message.text + '</p></div><div class="date"><p>' + Chat.getDate(message.date) + '</p></div></li>');
                else
                    Chat.messagesList.append('<li class="msg-0"><div class="author"><p>' + message.nick + '</p></div><div class="text"><p>' + message.text + '</p></div><div class="date"><p>' + Chat.getDate(message.date) + '</p></div></li>');
            });

            Chat.refreshScroll();
        });

        //Обновление чата для всех игроков
        socket.on('chat message', function (message) {
            if (message.id === Game.player.id) {
                Chat.addMessageToChat('<li class="msg-1"><div class="author"><p>' + message.nick + '</p></div><div class="text"><p>' + message.text + '</p></div><div class="date"><p>' + Chat.getDate(message.date) + '</p></div></li>');
            } else {
                Chat.addMessageToChat('<li class="msg-0"><div class="author"><p>' + message.nick + '</p></div><div class="text"><p>' + message.text + '</p></div><div class="date"><p>' + Chat.getDate(message.date) + '</p></div></li>');
            }
        });
    }
};

Chat.init();
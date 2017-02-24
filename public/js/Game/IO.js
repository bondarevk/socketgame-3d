

let IO = {

    socket: undefined,

    init: () => {
        this.socket = io.connect();

        // Подключился
        this.socket.on('connect', () => {
            Game.UI.textStatus.innerText = "Online";
        });

        // Отключился
        this.socket.on('disconnect', () => {
            Game.UI.textStatus.innerText = "Offline";
        });
    }

};
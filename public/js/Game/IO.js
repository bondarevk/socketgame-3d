

let IO = {

    socket: undefined,

    init: () => {
        this.socket = io.connect();

        IO.initEvents();
    },

    initEvents: () => {

        // Подключился к серверу
        this.socket.on('connect', () => {
            Game.UI.textStatus.innerText = "Online";
        });

        // Отключился от сервера
        this.socket.on('disconnect', () => {
            Game.UI.textStatus.innerText = "Offline";
        });


        // Подготовка клиента
        this.socket.on('clientRunUp', (packet) => {


            Input.setupKeys(packet.inputReq);

        });

    }

};
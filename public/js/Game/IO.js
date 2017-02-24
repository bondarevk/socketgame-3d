const IO = {

    socket: null,

    init: () => {
        IO.socket = io.connect();

        IO.initEvents();
    },

    initEvents: () => {

        // Подключился к серверу
        IO.socket.on('connect', () => {
            Game.UI.textStatus.innerText = "Online";
        });

        // Отключился от сервера
        IO.socket.on('disconnect', () => {
            Game.UI.textStatus.innerText = "Offline";
            IO.InputTimer.stop();
        });


        // Подготовка клиента
        IO.socket.on('clientRunUp', (packet) => {


            // Input Keys
            Input.setupKeys(packet.inputReq);

            // Input Timer
            IO.InputTimer.start(1000 / packet.tickrate);
        });

    },


    InputTimer: {
        _inputTimer: null,

        start: (interval) => {
            IO.InputTimer.stop();
            IO.InputTimer._inputTimer = setInterval(IO.InputTimer.inputLoop, interval);
        },

        stop: () => {
            if (IO.InputTimer._inputTimer !== null) {
                clearInterval(IO.InputTimer._inputTimer);
                IO.InputTimer._inputTimer = null;
            }
        },

        inputLoop: () => {
            IO.socket.emit('clientInput', Input.getInput());
        }
    }

};
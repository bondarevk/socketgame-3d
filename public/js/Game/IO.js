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
            let entityMap = packet.entityMap;

            GameUtils.clearEntities();
            Object.keys(entityMap).map(function(key, index) {
                let entity = entityMap[key];
                GameUtils.addEntity(entity);
            });

            // Input Keys
            Input.setupKeys(packet.inputReq);

            // Input Timer
            IO.InputTimer.start(1000 / packet.tickrate);
        });


        // Получение обновлений для сущностей
        IO.socket.on('clientEntityMapUpdate', (packet) => {
            let entityMap = packet.entityMap;

            Object.keys(entityMap).map(function(key, index) {
                let entity = entityMap[key];

                GameUtils.updateEntity(entity);
            });
        });

        // Спавн сущности
        IO.socket.on('spawnEntity', (packet) => {
            GameUtils.addEntity(packet);
        });

        // Удаление сущности
        IO.socket.on('despawnEntity', (packet) => {
            GameUtils.deleteEntityById(packet);
        });

        // Установка камеры
        IO.socket.on('bindCamera', (packet) => {
            GameUtils.bindCamera(packet);
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
            let input = Input.getInput();
            let d;
            input.cameraDirection = Game.cameraControls.controls.getDirection(d);

            IO.socket.emit('clientInput', input);
        }
    }

};
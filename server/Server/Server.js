const TickManager = require('./TickManager');

const Server = {

    globalEntityMap: new Map(),

    init: () => {
        TickManager.init();
    }
};

module.exports = Server;
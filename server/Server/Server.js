const TickManager = require('./TickManager');

const Server = {

    globalEntityMap: new Map(),

    init: () => {
        TickManager.init();
    },

    addEntity: (entity) => {
        if (!Server.globalEntityMap.has(entity.id)) {
            Server.globalEntityMap.set(entity.id, entity);
            return true;
        }
        return false;
    },

    removeEntityById: (id) => {
        if (Server.globalEntityMap.has(id)) {
            Server.globalEntityMap.delete(id);
            return true;
        }
        return false;
    }
};

module.exports = Server;
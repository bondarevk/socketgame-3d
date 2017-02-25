const IOUtils = require('../Utils/IOUtils');

const TickManager = {

    tickrate: 64,
    _tickTimer: null,
    _currentTick: 0,

    init: () => {
        TickManager._tickTimer = setInterval(TickManager.serverTick, 1000 / TickManager.tickrate);
    },

    serverTick: () => {

        // Тики
        global.Server.globalEntityMap.forEach((entity, id, map) => {
            if (entity.alive !== false && entity.requireTick === true) {
                entity.onTick(TickManager._currentTick);
            }
        });

        IOUtils.clientEntityMapUpdate();

        TickManager._currentTick++;
    }
};

module.exports = TickManager;
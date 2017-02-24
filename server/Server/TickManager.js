const IOUtils = require('../Utils/IOUtils');

const TickManager = {

    tickrate: 30,
    _tickTimer: null,
    _currentTick: 0,

    init: () => {
        TickManager._tickTimer = setInterval(TickManager.serverTick, 1000 / TickManager.tickrate);
    },

    serverTick: () => {

        //IOUtils.clientEntityMapUpdate();

        TickManager._currentTick++;
    }
};

module.exports = TickManager;
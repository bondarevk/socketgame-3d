let TickManager = require('../Server/TickManager');

class Ability {

    constructor(cooldown, onUse) {
        this.setCooldown(cooldown);

        this._lastUse = 0;

        this.onUse = onUse || null;
    }

    setCooldown(cooldown) {
        this._cooldown = cooldown || 1;

        let tickCd = this._cooldown * TickManager.tickrate;
        this._tickCooldown = tickCd > 1 ? tickCd : 1;
    }

    refresh() {
        this._lastUse = 0;
    }

    tryUse(tick, player) {
        if (tick > (this._lastUse + this._tickCooldown)) {
            this.use(tick, player);
        }
    }

    use(tick, player) {
        this._lastUse = tick;
        if (typeof this.onUse == 'function') {
            this.onUse(player);
        }
    }

}

module.exports = Ability;
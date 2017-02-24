let MathUtils = require('../Utils/MathUtils');
let IOUtils = require('../Utils/IOUtils');

class Entity {
    constructor() {
        this.id = MathUtils.guid();

        this.updateNeeded = false;
        this.requireTick = false;

        this.posX = 0.0;
        this.posY = 0.0;
        this.posZ = 0.0;

        this.type = ['BaseEntity'];
    }

    onTick(tick) {
        this.requestUpdate();
    }

    onDespawn() {

    }

    generatePacket() {
        let packet = {
            id: this.id,
            posX: this.posX,
            posY: this.posY,
            posZ: this.posZ,
            type: this.type
        };

        return packet;
    }

    requestUpdate() {
        this.updateNeeded = true;
    }
}

module.exports = Entity;
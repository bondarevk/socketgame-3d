let MathUtils = require('../Utils/MathUtils');
let IOUtils = require('../Utils/IOUtils');

class Entity {
    constructor() {
        this.id = MathUtils.guid();

        this.posX = 0.0;
        this.posY = 0.0;
        this.posZ = 0.0;


        this.width = 39;
        this.height = 55;

        this.type = ['BaseEntity'];
    }

    onTick(tick) {

    }

    onDespawn() {

    }

    generatePacket() {
        let packet = {
            id: this.id,
            posX: this.posX,
            posY: this.posY,
            sprite: this.sprite,
            width: this.width,
            height: this.height,
            rotation: this.rotation,
            text: this.text,
            type: this.type
        };

        return packet;
    }
}

module.exports = Entity;
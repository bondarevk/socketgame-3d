let MathUtils = require('../Utils/MathUtils');
let IOUtils = require('../Utils/IOUtils');

class Entity {
    constructor() {
        this.id = MathUtils.guid();

        this.updateNeeded = false;
        this.requireTick = false;

        this.object3D = new global.THREE.Object3D();
        this.object3D.position.x = 0;
        this.object3D.position.y = 1;
        this.object3D.position.z = 0;
        this.object3D.rotation.y = 0;
        this.object3D.rotation.x = 0;
        this.object3D.rotation.z = 0;

        this.width = 3;
        this.height = 2;
        this.depth = 3;
        this.color = 0xFFFFFF;

        this.type = ['BaseEntity'];
    }

    onTick(tick) {
        this.requestUpdate();
    }

    onDespawn() {

    }

    generatePacket() {
        return {
            id: this.id,
            posX: this.object3D.position.x,
            posY: this.object3D.position.y,
            posZ: this.object3D.position.z,
            rotationX: this.object3D.rotation.x,
            rotationY: this.object3D.rotation.y,
            rotationZ: this.object3D.rotation.z,
            width: this.width,
            height: this.height,
            depth: this.depth,
            color: this.color,
            type: this.type
        };
    }

    requestUpdate() {
        this.updateNeeded = true;
    }
}

module.exports = Entity;
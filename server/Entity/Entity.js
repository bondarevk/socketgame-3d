let MathUtils = require('../Utils/MathUtils');
let IOUtils = require('../Utils/IOUtils');

class Entity {
    constructor(width, height, depth, mass) {
        this.id = MathUtils.guid();

        this.updateNeeded = false;
        this.requireTick = false;

        this.tObject = new global.THREE.Object3D();
        this.tObject.position.x = 0;
        this.tObject.position.y = 1;
        this.tObject.position.z = 0;
        this.tObject.rotation.y = 0;
        this.tObject.rotation.x = 0;
        this.tObject.rotation.z = 0;

        this.width = width || 1;
        this.height = height || 1;
        this.depth = depth || 1;

        this.shape = new Ammo.btBoxShape( new Ammo.btVector3( this.width * 0.5, this.height * 0.5, this.depth * 0.5 ));
        this.shape.setMargin(0.5);
        this.mass = mass;
        if (mass === undefined) {
            this.mass = 1;
        }
        this.pObject = global.Physics.createRigidBody(this.tObject, this.shape, this.mass);

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
            posX: this.tObject.position.x,
            posY: this.tObject.position.y,
            posZ: this.tObject.position.z,
            rotationX: this.tObject.rotation.x,
            rotationY: this.tObject.rotation.y,
            rotationZ: this.tObject.rotation.z,
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
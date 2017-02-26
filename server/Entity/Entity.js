let MathUtils = require('../Utils/MathUtils');
let IOUtils = require('../Utils/IOUtils');

class Entity {
    constructor(width, height, depth, mass) {
        this.id = MathUtils.guid();

        this.updateNeeded = false;
        this.requireTick = false;
        this.color = 0xFFFFFF;

        this.tObject = new global.THREE.Object3D();
        this.tObject.position.x = 0;
        this.tObject.position.y = 0;
        this.tObject.position.z = 0;
        this.tObject.rotation.y = 0;
        this.tObject.rotation.x = 0;
        this.tObject.rotation.z = 0;

        this._width = width || 1;
        this._height = height || 1;
        this._depth = depth || 1;

        this._shape = new Ammo.btBoxShape( new Ammo.btVector3( this._width * 0.5, this._height * 0.5, this._depth * 0.5 ));
        this._shape.setMargin(0.5);
        this._mass = mass;
        if (mass === undefined) {
            this._mass = 1;
        }
        this.pObject = global.Physics.createRigidBody(this.tObject, this._shape, this._mass);


        this.type = ['BaseEntity'];
    }

    // Масса
    setMass(mass) {
        this._mass = mass;
        this.pObject.setMassProps(this._mass, new Ammo.btVector3( 0, 0, 0 ));
        this._shape.calculateLocalInertia( this._mass, new Ammo.btVector3( 0, 0, 0 ) );
    }

    // Размеры объекта
    setSize(width, height, depth) {
        this._width = width;
        this._height = height;
        this._depth = depth;

        this._shape = new Ammo.btBoxShape( new Ammo.btVector3( this._width * 0.5, this._height * 0.5, this._depth * 0.5 ));
        this._shape.setMargin(0.5);
        this._shape.calculateLocalInertia( this._mass, new Ammo.btVector3( 0, 0, 0 ) );
        this.pObject.setCollisionShape(this._shape);

        this.requestUpdate();
    }

    // Координаты
    setPos(x, y, z) {
        let transform = this.pObject.getCenterOfMassTransform();
        let origin = transform.getOrigin();

        if (x === undefined) {
            x = origin.x();
        }
        if (y === undefined) {
            y = origin.y();
        }
        if (z === undefined) {
            z = origin.z();
        }

        this.tObject.position.x = x;
        this.tObject.position.y = y;
        this.tObject.position.z = z;


        transform.setOrigin( new Ammo.btVector3( x, y, z ) );


        this.pObject.setCenterOfMassTransform(transform);
        this.requestUpdate();
    }

    setRotation(x, y, z) {
        let transform = this.pObject.getCenterOfMassTransform();

        // TODO: FIX ROTATION!


        console.log('----');
        console.log(this.tObject.rotation);

        this.tObject.rotation.set(x, y, z, "XYZ");

        let quat = new THREE.Quaternion();
        quat.copy(this.tObject.quaternion);
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

        //this.tObject.setRotationFromQuaternion(new THREE.Quaternion())

        console.log(this.tObject.rotation);
        console.log('----');


        this.pObject.setCenterOfMassTransform(transform);

        this.requestUpdate();
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
            width: this._width,
            height: this._height,
            depth: this._depth,
            color: this.color,
            type: this.type
        };
    }

    requestUpdate() {
        this.updateNeeded = true;
    }
}

module.exports = Entity;
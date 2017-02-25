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
        let transformAux = new Ammo.btTransform();
        this.pObject.getMotionState().getWorldTransform( transformAux );

        let p = transformAux.getOrigin();

        if (x === undefined) {
            x = p.x();
        }
        if (y === undefined) {
            y = p.y();
        }
        if (z === undefined) {
            z = p.z();
        }

        this.tObject.position.x = x;
        this.tObject.position.y = y;
        this.tObject.position.z = z;
        transformAux.setOrigin( new Ammo.btVector3( x, y, z ) );

        this.pObject.setWorldTransform(transformAux);
        this.pObject.getMotionState().setWorldTransform(transformAux);

        this.requestUpdate();
    }

    setRotation(x, y, z) {

        if (x === undefined) {
            x = this.tObject.rotation.x;
        }
        if (y === undefined) {
            y = this.tObject.rotation.y;
        }
        if (z === undefined) {
            z = this.tObject.rotation.z;
        }

        //this.tObject.rotation.set(x, y, z);
        //let quat = new THREE.Quaternion();
        //quat.copy(this.tObject.quaternion);

        console.log('----');
        console.log(y);


        let q = new Ammo.btQuaternion(  );
        q.setEulerZYX(z, y, x);
        console.log(q.y());


        // TODO: FIX ROTATION!
        let transformAux = new Ammo.btTransform();
        this.pObject.getMotionState().getWorldTransform( transformAux );
        console.log(transformAux.getRotation().y());
        transformAux.setRotation( q );
        console.log(transformAux.getRotation().y());
        //q2.setValue( quat.x, quat.y, quat.z, quat.w );


        //this.tObject.quaternion.set(transformAux.getRotation().x(), transformAux.getRotation().y(), transformAux.getRotation().z(), transformAux.getRotation().w());


        this.pObject.setWorldTransform(transformAux);
        this.pObject.getMotionState().setWorldTransform(transformAux);

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
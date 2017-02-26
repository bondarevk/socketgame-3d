const Physics = {

    _collisionConfiguration: null,
    _dispatcher: null,
    _broadphase: null,
    _solver: null,
    _softBodySolver: null,

    gravityConstant: -9.8,
    physicsWorld: null,
    rigidBodies: [],

    init: () => {
        Physics._collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
        Physics._dispatcher = new Ammo.btCollisionDispatcher(Physics._collisionConfiguration);
        Physics._broadphase = new Ammo.btDbvtBroadphase();
        Physics._solver = new Ammo.btSequentialImpulseConstraintSolver();
        Physics._softBodySolver = new Ammo.btDefaultSoftBodySolver();

        Physics.physicsWorld = new Ammo.btSoftRigidDynamicsWorld(
            Physics._dispatcher,
            Physics._broadphase,
            Physics._solver,
            Physics._collisionConfiguration,
            Physics._softBodySolver
        );
        Physics.physicsWorld.setGravity(new Ammo.btVector3(0, Physics.gravityConstant, 0));
        Physics.physicsWorld.getWorldInfo().set_m_gravity(new Ammo.btVector3(0, Physics.gravityConstant, 0));
        console.log('Physics init.')
    },


    // Mesh, btShape, Mass
    createRigidBody: (threeObject, physicsShape, mass) => {

        // Position
        let pos = new THREE.Vector3();
        pos.copy(threeObject.position);

        // Quaternion
        let quat = new THREE.Quaternion();
        quat.copy(threeObject.quaternion);


        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

        let motionState = new Ammo.btDefaultMotionState(transform);
        let localInertia = new Ammo.btVector3(0, 0, 0);
        physicsShape.calculateLocalInertia(mass, localInertia);

        let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
        let body = new Ammo.btRigidBody(rbInfo);
        threeObject.userData.physicsBody = body;

        if (mass > 0) {
            // Disable deactivation
            body.setActivationState(4);
        }

        return body;
    },

    addRigidBody: (tObject, pObject) => {
        Physics.rigidBodies.push(tObject);
        Physics.physicsWorld.addRigidBody(pObject);
    },

    removeRigidBody: (tObject, pObject) => {
        Physics.physicsWorld.removeRigidBody(pObject);

        let index = Physics.rigidBodies.indexOf(tObject);
        if (index >= 0) {
            Physics.rigidBodies.splice(index, 1);
        }
    },

    tick: () => {
        Physics.physicsWorld.stepSimulation(1 / 64, 1 / 64);

        for (let i = 0; i < Physics.rigidBodies.length; i++) {

            let tObject = Physics.rigidBodies[i];
            let pObject = tObject.userData.physicsBody;

            let transform = pObject.getCenterOfMassTransform();

            let origin = transform.getOrigin();
            let rotation = transform.getRotation();



            console.log('!!!!');
            console.log(tObject.rotation);
            tObject.position.set( origin.x(), origin.y(), origin.z() );
            tObject.quaternion.set( rotation.x(), rotation.y(), rotation.z(), rotation.w() );
            console.log(tObject.rotation);
            console.log('!!!!');
        }
    }

};

module.exports = Physics;
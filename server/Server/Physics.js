

const Physics = {

    _collisionConfiguration: null,
    _dispatcher: null,
    _broadphase: null,
    _solver: null,
    _softBodySolver: null,

    _transformAux: null,

    gravityConstant: -9.8,
    physicsWorld: null,
    rigidBodies: [],

    init: () => {
        Physics._collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
        Physics._dispatcher = new Ammo.btCollisionDispatcher( Physics._collisionConfiguration );
        Physics._broadphase = new Ammo.btDbvtBroadphase();
        Physics._solver = new Ammo.btSequentialImpulseConstraintSolver();
        Physics._softBodySolver = new Ammo.btDefaultSoftBodySolver();

        Physics._transformAux = new Ammo.btTransform();

        Physics.physicsWorld = new Ammo.btSoftRigidDynamicsWorld(
            Physics._dispatcher,
            Physics._broadphase,
            Physics._solver,
            Physics._collisionConfiguration,
            Physics._softBodySolver
        );
        Physics.physicsWorld.setGravity( new Ammo.btVector3( 0, Physics.gravityConstant, 0 ) );
        Physics.physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, Physics.gravityConstant, 0 ) );
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
        transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
        transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );

        let motionState = new Ammo.btDefaultMotionState( transform );
        let localInertia = new Ammo.btVector3( 0, 0, 0 );
        physicsShape.calculateLocalInertia( mass, localInertia );

        let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
        let body = new Ammo.btRigidBody( rbInfo );
        threeObject.userData.physicsBody = body;

        if ( mass > 0 ) {
            // Disable deactivation
            body.setActivationState( 4 );
        }

        return body;
    },

    addRigidBody: (tObject, pObject) => {
        Physics.rigidBodies.push( tObject );
        Physics.physicsWorld.addRigidBody( pObject );

        console.log('add RB ' + Physics.rigidBodies.length);
    },

    removeRigidBody: (tObject, pObject) => {
        Physics.physicsWorld.removeRigidBody( pObject );

        let index = Physics.rigidBodies.indexOf(tObject);
        if (index >= 0) {
            Physics.rigidBodies.splice(index, 1);
        }

        console.log('rem RB ' + Physics.rigidBodies.length);
    },

    tick: () => {
        Physics.physicsWorld.stepSimulation(1 / 20, 1 / 20);

        for ( let i = 0; i < Physics.rigidBodies.length; i++ ) {

            let tObject = Physics.rigidBodies[i];
            let pObject = tObject.userData.physicsBody;

            let ms = pObject.getMotionState();
            if ( ms ) {
                ms.getWorldTransform( Physics._transformAux );
                let p = Physics._transformAux.getOrigin();
                let q = Physics._transformAux.getRotation();
                tObject.position.set( p.x(), p.y(), p.z() );
                tObject.quaternion.set( q.x(), q.y(), q.z(), q.w() );
            }

        }
    }

};

module.exports = Physics;
THREE.PointerLockControls = function ( camera ) {

	let scope = this;

	camera.rotation.set( 0, 0, 0 );

	let pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	let yawObject = new THREE.Object3D();
	yawObject.add( pitchObject );

    yawObject.position.x = 25;
	yawObject.position.y = 15;
    yawObject.position.z = 25;

	let PI_2 = Math.PI / 2;

	let onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	this.dispose = function() {

		document.removeEventListener( 'mousemove', onMouseMove, false );

	};

	document.addEventListener( 'mousemove', onMouseMove, false );

	this.enabled = false;

	this.getObject = () => {
		return yawObject;
	};


	this.getDirection = () => {
		return {
            pitch: pitchObject.rotation.x,
			yaw: yawObject.rotation.y
		}
	};

};

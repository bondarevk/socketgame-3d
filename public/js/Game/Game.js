let Game = {

    blocker: document.getElementById('blocker'),
    container: document.getElementById('gameContainer'),
    UI: {
        textStatus: document.getElementById("textInfo")
    },

    stats: undefined,
    clock: undefined,
    cameraBind: {
        dX: 0,
        dY: 0,
        dZ: 0,
        eID: null
    },

    time: 0,

    globalEntityMap: new Map(),
    player: {
        id: null
    },

    cameraControls: {
        firstPerson: true,
        camera: undefined,

        controls: undefined,
        controlsEnabled: false,

        pointerLockChange: ( event ) => {
            if ( document.pointerLockElement === Game.container || document.mozPointerLockElement === Game.container || document.webkitPointerLockElement === Game.container ) {
                Game.cameraControls.controlsEnabled = true;
                Game.cameraControls.controls.enabled = true;
                Game.blocker.style.display = 'none';
            } else {
                Game.cameraControls.controlsEnabled = false;
                Game.cameraControls.controls.enabled = false;
                Game.blocker.style.display = '-webkit-box';
                Game.blocker.style.display = '-moz-box';
                Game.blocker.style.display = 'box';
            }
        },
        pointerLockError: ( event ) => {

        }
    },

    scene: undefined,
    renderer: undefined,

    textureLoader: undefined,

    init: () => {
        Game.initGraphics();
        Game.initPointerLock();
        Game.createBaseObjects();

        Input.init(Game.container);
        IO.init();

        Game.animate();
    },

    initGraphics: () => {
        // Сцена
        Game.scene = new THREE.Scene();
        Game.clock = new THREE.Clock();
        Game.scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

        // Камера
        Game.cameraControls.camera = new THREE.PerspectiveCamera(75, Game.container.clientWidth / Game.container.clientHeight, 1, 1000);

        Game.cameraControls.controls = new THREE.PointerLockControls( Game.cameraControls.camera );

        // Рендерер
        Game.renderer = new THREE.WebGLRenderer();
        Game.renderer.setClearColor(0xbfd1e5);
        Game.renderer.setPixelRatio(window.devicePixelRatio);
        Game.renderer.setSize(Game.container.clientWidth, Game.container.clientHeight);
        Game.renderer.shadowMap.enabled = true;

        // Загрузчик текстур
        Game.textureLoader = new THREE.TextureLoader();

        //
        Game.container.innerHTML = "";
        Game.container.appendChild(Game.renderer.domElement);

        // Счетчик фпс
        Game.stats = new Stats();
        Game.stats.domElement.style.position = 'absolute';
        Game.stats.domElement.style.top = '0px';
        Game.container.appendChild(Game.stats.domElement);

        // Ресайз игры
        window.addEventListener('resize', Game.onWindowResize, false);
    },

    initPointerLock: () => {
        // Hook pointer lock state change events
        document.addEventListener( 'pointerlockchange', Game.cameraControls.pointerLockChange, false );
        document.addEventListener( 'mozpointerlockchange', Game.cameraControls.pointerLockChange, false );
        document.addEventListener( 'webkitpointerlockchange', Game.cameraControls.pointerLockChange, false );
        document.addEventListener( 'pointerlockerror', Game.cameraControls.pointerLockError, false );
        document.addEventListener( 'mozpointerlockerror', Game.cameraControls.pointerLockError, false );
        document.addEventListener( 'webkitpointerlockerror', Game.cameraControls.pointerLockError, false );

        Game.blocker.addEventListener( 'click', function ( event ) {
            // Ask the browser to lock the pointer
            Game.container.requestPointerLock = Game.container.requestPointerLock || Game.container.mozRequestPointerLock || Game.container.webkitRequestPointerLock;
            Game.container.requestPointerLock();
        }, false );
    },

    createBaseObjects: () => {

        // Camera
        Game.scene.add( Game.cameraControls.controls.getObject() );

        // Источник света
        let ambientLight = new THREE.AmbientLight(0x404040);
        Game.scene.add(ambientLight);
        let light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
        light.position.set( 0.5, 1, 0.75 );
        Game.scene.add( light );

        // Ground


        let ground = RenderUtils.addBox(0, -2, 0, 100, 1, 100);

        Game.textureLoader.load("textures/grass.jpg", function (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(40, 40);
            ground.material.map = texture;
            ground.material.needsUpdate = true;
        });
    },


    animate: () => {
        requestAnimationFrame(Game.animate);
        Game.render();
        Game.stats.update();
    },

    render: () => {
        let deltaTime = Game.clock.getDelta();
        GameUtils.updateCameraPos();
        Game.renderer.render(Game.scene, Game.cameraControls.camera);
        Game.time += deltaTime;
    },


    onWindowResize: () => {
        Game.cameraControls.camera.aspect = Game.container.clientWidth / Game.container.clientHeight;
        Game.cameraControls.camera.updateProjectionMatrix();
        Game.renderer.setSize(Game.container.clientWidth, Game.container.clientHeight);
    }
};

if (Detector.webgl === false || Detector.havePointerLock === false) {
    Detector.addErrorMessage();
    $('#game').hide();
} else {
    Game.init();
}
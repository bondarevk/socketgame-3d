let Game = {

    container: undefined,
    stats: undefined,
    clock: undefined,

    time: 0,

    camera: undefined,
    scene: undefined,
    renderer: undefined,

    textureLoader: undefined,

    init: () => {
        Game.initGraphics();
        Game.createObjects();

        Game.animate();
    },

    initGraphics: () => {
        Game.container = document.getElementById('gameContainer');
        Game.camera = new THREE.PerspectiveCamera(60, Game.container.clientWidth / Game.container.clientHeight, 0.2, 2000);

        Game.scene = new THREE.Scene();
        Game.clock = new THREE.Clock();

        Game.camera.position.x = -7;
        Game.camera.position.y = 5;
        Game.camera.position.z = 8;

        Game.renderer = new THREE.WebGLRenderer();
        Game.renderer.setClearColor(0xbfd1e5);
        Game.renderer.setPixelRatio(window.devicePixelRatio);
        Game.renderer.setSize(Game.container.clientWidth, Game.container.clientHeight);
        Game.renderer.shadowMap.enabled = true;

        Game.textureLoader = new THREE.TextureLoader();

        let ambientLight = new THREE.AmbientLight(0x404040);
        Game.scene.add(ambientLight);


        Game.container.innerHTML = "";
        Game.container.appendChild(Game.renderer.domElement);

        Game.stats = new Stats();
        Game.stats.domElement.style.position = 'absolute';
        Game.stats.domElement.style.top = '0px';
        Game.container.appendChild(Game.stats.domElement);


        window.addEventListener('resize', Game.onWindowResize, false);
    },

    createObjects: () => {

        // Ground

        let ground = RenderUtils.createParalellepiped(40, 1, 40, new THREE.MeshPhongMaterial({color: 0xFFFFFF}));
        ground.castShadow = true;
        ground.receiveShadow = true;

        Game.scene.add(ground);

        Game.textureLoader.load("textures/grid.png", function (texture) {
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
        Game.renderer.render(Game.scene, Game.camera);
        Game.time += deltaTime;
    },


    onWindowResize: () => {
        Game.camera.aspect = Game.container.clientWidth / Game.container.clientHeight;
        Game.camera.updateProjectionMatrix();
        Game.renderer.setSize(Game.container.clientWidth, Game.container.clientHeight);
    }
};

if (Detector.webgl === false) {
    Detector.addGetWebGLMessage();
    $('#game').hide();
} else {
    Game.init();
}
let LiveEntity = require('./LiveEntity');
let ServerUtils = require('../Utils/ServerUtils');
let MathUtils = require('../Utils/MathUtils');
let Ability = require('../Ability/Ability');
let IOUtils = require('../Utils/IOUtils');
let events = require('events');

class Player extends LiveEntity {

    /**
     * @return {string}
     */
    get Hostname() {
        if (this.hostname === null) {
            return this.ip;
        }
        return this.hostname;
    }

    /**
     * @return {string}
     */
    get Nickname() {
        if (this.nickname === null) {
            return this.Hostname;
        }
        return this.nickname;
    }


    constructor() {
        super();

        this.socket = null;
        this.ip = null;
        this.hostname = null;
        this.nickname = null;
        this.input = {
            keyboard: new Map(),
            mouse: {
                isDown: false,
                button: 1
            },
            cameraDirection: {
                yaw: 0,
                pitch: 0
            }
        };
        this.headHeight = 1; // Высота камеры от центра модели

        this.color = 0xFFFFFF;

        // Events
        this.eventEmitter = new events.EventEmitter();
        this.abilitiesMap = this.abilitiesInit(this.eventEmitter);

        this.pObject.setAngularFactor( 0, 1, 0 );

        this.type.push('BasePlayer');
    }

    abilitiesInit() {
        let abilitiesMap = new Map();

        // Abilities
        abilitiesMap.set('ml', new Ability(0.1, (player) => {
            console.log(player.input.cameraDirection);

        }));

        this.eventEmitter.on('mouseLeft', (tick, player) => {
            player.abilitiesMap.get('ml').tryUse(tick, player);

            this.pObject.applyCentralLocalForce( new Ammo.btVector3( 0, 20, 0 ) );
            //global.ground.setPosition(undefined, global.ground.tObject.position.y - 1, undefined);

        });

        return abilitiesMap;
    }

    onTick(tick) {


        let keyboard = this.input.keyboard;

        if (keyboard.has(87) && keyboard.has(83) && keyboard.has(65) && keyboard.has(68)) {

            let vX = 0;
            let vY = 0;
            let vZ = 0;

            //console.log(this.input.cameraDirection.yaw);
            this.setRotation(0, this.input.cameraDirection.yaw, 0);
            //this.object3D.rotation.y = this.input.cameraDirection.yaw;

            if (keyboard.get(65) === true) {
                vX -= 1.0;
            }

            if (keyboard.get(68) === true) {
                vX += 1.0;
            }

            if (keyboard.get(87) === true) {
                vZ -= 1.0;
            }

            if (keyboard.get(83) === true) {
                vZ += 1.0;
            }

            let normVec = MathUtils.normalize(vX, vY, vZ);

            this.movement.vX = normVec.vX;
            this.movement.vY = normVec.vY;
            this.movement.vZ = normVec.vZ;
        }
        super.onTick();

        if (this.input.mouse.isDown === true) {
            if (this.input.mouse.button === 1) {
                this.eventEmitter.emit('mouseLeft', tick, this)
            } else if (this.input.mouse.button === 2) {
                this.eventEmitter.emit('mouseRight', tick, this)
            }
        }
    }

    onDie (source) {
        super.onDie();
        console.log('Игрок [' + this.Nickname + '] умер.');
    }



    onConnect(socket) {
        this.socket = socket;
        this.ip = ServerUtils.getClientIp(socket);

        ServerUtils.getClientHostname(this.ip, (ip) => {
            this.hostname = ip;
        });

        console.log('Игрок [' + this.Nickname + '] подключился.');
    }

    onDisconnect(socket) {
        this.socket = null;
        console.log('Игрок [' + this.Nickname + '] отключился.');
    }



    generatePacket() {
        let packet = super.generatePacket();

        packet['nickname'] = this.Nickname;
        packet['headHeight'] = this.headHeight;

        return packet;
    }
}

module.exports = Player;
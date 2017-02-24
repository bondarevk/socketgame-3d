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
            }
        };


        // Events
        this.eventEmitter = new events.EventEmitter();
        this.abilitiesMap = this.abilitiesInit(this.eventEmitter);



        this.type.push('BasePlayer');
    }

    abilitiesInit() {
        let abilitiesMap = new Map();

        // Abilities
        abilitiesMap.set('ml', new Ability(0.3, (player) => {
            console.log(player.input.cameraDirection);
        }));

        this.eventEmitter.on('mouseLeft', (tick, player) => {
            player.abilitiesMap.get('ml').tryUse(tick, player);
        });

        return abilitiesMap;
    }

    onTick(tick) {
        super.onTick();

        let keyboard = this.input.keyboard;

        if (keyboard.has(87) && keyboard.has(83) && keyboard.has(65) && keyboard.has(68)) {

            let vX = 0;
            let vY = 0;
            let vZ = 0;

            let obj = new global.THREE.Object3D();
            obj.position.x = this.posX;
            obj.position.y = this.posY;
            obj.position.z = this.posZ;
            obj.rotation.y = this.input.cameraDirection.yaw;
            obj.rotation.x = this.input.cameraDirection.pitch;


            if (keyboard.get(65) === true) {
                vX += 1.0;
            }

            if (keyboard.get(68) === true) {
                vX -= 1.0;
            }

            if (keyboard.get(87) === true) {
                vZ -= 1.0;
            }

            if (keyboard.get(83) === true) {
                vZ += 1.0;
            }

            obj.translateX(vX);
            obj.translateZ(vZ);

            this.posX = obj.position.x;
            this.posZ = obj.position.z;
        }

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

        return packet;
    }
}

module.exports = Player;
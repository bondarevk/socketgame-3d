let Entity = require('./Entity');
let TickManager = require('../Server/TickManager');

class LiveEntity extends Entity {
    constructor() {
        super();

        this.requireTick = true;

        this.hp = {
            current: 10,
            max: 10
        };
        this.alive = true;
        this.movement = {
            vX: 0.0,
            vY: 0.0,
            vZ: 0.0,
            speed: 20.0
        };

        this.type.push('BaseLiveEntity');
    }

    damage(damage, source) {
        if (this.alive === false) {
            return;
        }

        if (this.onDamage(damage, source) === true) {
            this.hp.current -= damage;
            if (this.hp.current <= 0) {
                this.hp.current = 0;
                this.onDie(source);
            }
        }
    }

    onDamage(damage, source) {
        return true;
    }

    onDie (source) {
        this.alive = false;
    }

    onTick(tick) {
        super.onTick();

        //this.object3D.translateX(this.movement.vX * (this.movement.speed / TickManager.tickrate));
        //this.object3D.translateY(this.movement.vY * (this.movement.speed / TickManager.tickrate));
        //this.object3D.translateZ(this.movement.vZ * (this.movement.speed / TickManager.tickrate));
    }

    generatePacket() {
        let packet = super.generatePacket();

        packet['hp'] = this.hp;
        packet['alive'] = this.alive;

        return packet;
    }
}

module.exports = LiveEntity;
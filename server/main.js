global.THREE = require('./libs/three.module');
global.Ammo = require('ammo-node');
global.Physics = require('./Server/Physics');
global.Server = require('./Server/Server');
global.IOCore = require('./Server/IOCore');

if (!String.prototype.format) {
    String.prototype.format = function() {
        let args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

global.Server.init();
global.IOCore.init();
global.Physics.init();

const IOUtils = require('./Utils/IOUtils');
const Entity = require('./Entity/Entity');

let ground = new Entity();
ground.setMass(0);
ground.setSize(40, 1, 40);
ground.setPos(0, -10, 0);
ground.color = 0xA1A1C5;

IOUtils.spawnEntity(ground);
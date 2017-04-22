global.THREE = require('./libs/three.module');
global.Ammo = require('ammo-node');
global.Physics = require('./Server/Physics');
global.Server = require('./Server/Server');
global.IOCore = require('./Server/IOCore');

if (!String.prototype.format) {
    String.prototype.format = function() {
        let args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return args[number] !== undefined ? args[number] : match;
        });
    };
}

global.Server.init();
global.IOCore.init();
global.Physics.init();

const IOUtils = require('./Utils/IOUtils');
const Entity = require('./Entity/Entity');

let ground = new Entity();
ground.a = 0;
global.ground = ground;
ground.setMass(0);
ground.setSize(20, 1, 20);
ground.setPosition(0, -10, 0);
ground.setRotation(0, 4.4, 0);
ground.color = 0xA1A1C5;

IOUtils.spawnEntity(ground);

let box = new Entity();
box.setMass(0);
box.setSize(3, 1, 3);
box.setPosition(0, -9, 0);
box.setRotation(0, 0, 0);
box.color = 0xFFFFFF;
IOUtils.spawnEntity(box);
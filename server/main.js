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

let IOUtils = require('./Utils/IOUtils');
let Entity = require('./Entity/Entity');

let ground = new Entity(10, 1, 10, 0);

IOUtils.spawnEntity(ground);
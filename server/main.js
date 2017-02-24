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

let IOUtils = require('./Utils/IOUtils');
let Entity = require('./Entity/Entity');
let testEntity = new Entity();
testEntity.posX = 24;
testEntity.posY = 10;
testEntity.posZ = 24;
IOUtils.spawnEntity(testEntity)
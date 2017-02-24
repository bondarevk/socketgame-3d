

const IOUtis = {

    clientRunUp: (socket) => {
        socket.emit('clientRunUp', global.IOCore.Packet.clientRunUp());
    },

    spawnEntity: (entity) => {
        if (global.Server.addEntity(entity)) {
            global.IOCore.io.emit('spawnEntity', entity.generatePacket());
        }
    },

    despawnEntity: (id) => {
        if (global.Server.globalEntityMap.has(id)) {

            let entity = global.Server.globalEntityMap.get(id);
            entity.onDespawn();

            global.Server.removeEntityById(id);
            global.IOCore.io.emit('despawnEntity', id);
        }
    }
};


module.exports = IOUtis;
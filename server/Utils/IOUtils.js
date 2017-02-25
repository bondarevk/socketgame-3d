

const IOUtis = {

    clientRunUp: (socket) => {
        socket.emit('clientRunUp', global.IOCore.Packet.clientRunUp(socket));
    },


    // Entity
    spawnEntity: (entity) => {
        if (global.Server.addEntity(entity)) {
            global.IOCore.io.emit('spawnEntity', entity.generatePacket());
        }
        global.Physics.addRigidBody(entity.tObject, entity.pObject);
    },

    despawnEntity: (id) => {
        if (global.Server.globalEntityMap.has(id)) {

            let entity = global.Server.globalEntityMap.get(id);
            entity.onDespawn();

            global.Server.removeEntityById(id);
            global.Physics.removeRigidBody(entity.tObject, entity.pObject);
            global.IOCore.io.emit('despawnEntity', id);
        }
    },

    clientEntityMapUpdate: () => {
        global.IOCore.io.emit('clientEntityMapUpdate', global.IOCore.Packet.clientEntityMapUpdate());
    },

    bindCamera: (socket, eID, dX, dY, dZ) => {

        socket.emit('bindCamera', global.IOCore.Packet.bindCamera({
            eID: eID,
            dX: dX || 0,
            dY: dY || 0,
            dZ: dZ || 0
        }));

    },

    // Chat
    sendChatMessage: (message) => {
        IOCore.io.emit('chatMessage', message);
    },

    loadChatHistory: (socket, chatHistory) => {
        socket.emit('chatHistory', chatHistory);
    }
};


module.exports = IOUtis;
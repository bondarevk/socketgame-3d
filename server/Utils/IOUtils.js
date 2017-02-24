

const IOUtis = {

    clientRunUp: (socket) => {
        socket.emit('clientRunUp', global.IOCore.Packet.clientRunUp());
    }

};


module.exports = IOUtis;
let dns = require('dns');

let ServerUtils = {
    getClientHostname: (ip, callback) => {
        dns.reverse(ip, function(err, domains) {
            if (err) {
                callback(null);
                return;
            }

            if (domains.length > 0) {
                callback(domains[0].replace(/\s*\.itstep\.lan\s*/g, ''));
                return;
            }

            callback(null);
        });
    },

    getClientIp: (socket) => {
        let ip = socket.client.conn.remoteAddress;
        if (ip.length > 7 && ip.startsWith('::ffff:')) {
            ip = ip.substring(7);
        }
        return ip;
    }
};

module.exports = ServerUtils;
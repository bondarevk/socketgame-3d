

let MathUtils = {
    guid: () => {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },

    normalize: (vX, vY, vZ) => {
        let norm = Math.sqrt((vX * vX) + (vY * vY) + (vZ * vZ));
        if (norm != 0) {
            return {
                vX: vX / norm,
                vY: vY / norm,
                vZ: vZ / norm
            };
        } else {
            return {
                vX: vX,
                vY: vY,
                vZ: vZ
            };
        }
    }
};

module.exports = MathUtils;
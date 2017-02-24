

let RenderUtils = {

    createParalellepiped: ( sx, sy, sz, material ) => {

        return new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);
    }

};
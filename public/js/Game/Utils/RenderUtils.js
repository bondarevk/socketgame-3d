

let RenderUtils = {

    addBox: (x, y, z, width, height, depth, castShadow, receiveShadow) => {
        let material = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
        let mesh = new THREE.Mesh(new THREE.BoxGeometry(
            width || 1,
            height || 1,
            depth|| 1
        ), material);
        mesh.position.x = x || 0;
        mesh.position.y = y || 0;
        mesh.position.z = z || 0;
        mesh.castShadow = castShadow || false;
        mesh.receiveShadow = receiveShadow || false;

        Game.scene.add(mesh);

        return mesh;
    }

};
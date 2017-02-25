let GameUtils = {

    addEntity: (entity) => {
        if (Game.globalEntityMap.has(entity.id)) {
            return;
        }

        entity.Object3D = RenderUtils.addBox(entity.posX, entity.posY, entity.posZ, entity.width, entity.height, entity.depth, entity.color);


        Game.globalEntityMap.set(entity.id, entity);
        console.log('add, ' + Game.globalEntityMap.size);
    },

    deleteEntityById: (id) => {
        let entity = Game.globalEntityMap.get(id);
        Game.scene.remove( entity.Object3D );

        Game.globalEntityMap.delete(id);
        console.log('del, ' + Game.globalEntityMap.size);
    },

    updateEntity: (entity) => {
        if (Game.globalEntityMap.has(entity.id) === false) {
            return;
        }

        let localEntity = Game.globalEntityMap.get(entity.id);


        // Position
        localEntity.posX = entity.posX;
        localEntity.posY = entity.posY;
        localEntity.posZ = entity.posZ;
        localEntity.Object3D.position.x = localEntity.posX;
        localEntity.Object3D.position.y = localEntity.posY;
        localEntity.Object3D.position.z = localEntity.posZ;

        // Rotation
        localEntity.rotationX = entity.rotationX;
        localEntity.rotationY = entity.rotationY;
        localEntity.rotationZ = entity.rotationZ;
        localEntity.Object3D.rotation.x = localEntity.rotationX;
        localEntity.Object3D.rotation.y = localEntity.rotationY;
        localEntity.Object3D.rotation.z = localEntity.rotationZ;
    },

    clearEntities: () => {
        Game.scene.children.forEach(function(object){
            Game.scene.remove(object);
        });
        Game.createBaseObjects();
    },

    bindCamera: (cameraBind) => {
        Game.cameraBind.eID = cameraBind.eID;
        Game.cameraBind.dX = cameraBind.dX;
        Game.cameraBind.dY = cameraBind.dY;
        Game.cameraBind.dZ = cameraBind.dZ;
    },



    updateCameraPos: () => {
        let cam = Game.cameraControls.controls.getObject();
        if (Game.cameraBind.eID !== null) {
            if (Game.globalEntityMap.has(Game.cameraBind.eID)) {
                let player = Game.globalEntityMap.get(Game.cameraBind.eID);
                cam.position.x = player.posX;
                cam.position.y = player.posY + player.headHeight;
                cam.position.z = player.posZ;
                if (Game.cameraControls.firstPerson === false) {
                    cam.translateZ(5);
                    cam.translateY(4);
                }
            } else {
                cam.position.x = Game.cameraBind.dX;
                cam.position.y = Game.cameraBind.dY;
                cam.position.z = Game.cameraBind.dZ;
            }
        } else {
            cam.position.x = Game.cameraBind.dX;
            cam.position.y = Game.cameraBind.dY;
            cam.position.z = Game.cameraBind.dZ;
        }
    },

    // TODO:
    setUIHp: (hp) => {

    },

    setUINickname: (nickname) => {

    }
};
let GameUtils = {

    addEntity: (entity) => {
        if (Game.globalEntityMap.has(entity.id)) {
            return;
        }

        entity.Object3D = RenderUtils.addBox(entity.posX, entity.posY, entity.posZ, 2, 2, 2);


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


    },

    clearEntities: () => {

    },

    // TODO:
    bindCamera: (camera) => {

    },

    updateCamera: () => {

    },

    setUIHp: (hp) => {

    },

    setUINickname: (nickname) => {

    }
};
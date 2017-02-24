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
        if (Game.globalEntityMap.has(entity.id)) {

        }

        //console.log('upd');
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
let GameUtils = {

    addEntity: (entity) => {
        if (Game.globalEntityMap.has(entity.id)) {
            return;
        }

        entity.Object3D = undefined;


        Game.globalEntityMap.set(entity.id, entity);
        console.log('add, ' + Game.globalEntityMap.size);
    },

    deleteEntityById: (id) => {
        let entity = Game.globalEntityMap.get(id);


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
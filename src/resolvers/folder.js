const { uuid2id } = require("../helpers/convertUuid");
const { prepareQueryWhereInIDs } = require("../helpers/prepareQuery");

async function getFolders(_, data, { logger, db }) {
    const ids = data.uuIds
        .map((uuid) => uuid2id(uuid))
        .filter((id) => id !== "");

    if (!ids.length) {
        return [];
    }

    try {
        const getIDsWithX = prepareQueryWhereInIDs(ids);
        const foundEntities = await db.getEntities(getIDsWithX);
        return foundEntities.map((ent) => JSON.parse(ent.entity));
    } catch (error) {
        logger.error("failed to get folders", error);
    }
}

async function getFromFolder(_, data, { logger, db }) {
    const subject = uuid2id(data.subject);
    if (subject === "") {
        return new Error("uuid is invalid");
    }

    try {
        const edges = await db.getEdge({
            predicate: "ru.webrx.folder",
            subject,
        });

        return edges.map((edge) => edge.object);
    } catch (error) {
        logger.error("failed to get from folder", error);
    }
}

async function catalog(_, { id }, { logger, db }) {
    const subject = uuid2id(id);
    if (subject === "") {
        return new Error("uuid is invalid");
    }

    try {
        const edges = await db.getEdge({
            predicate: "ru.webrx.folder",
            subject,
        });

        const foundOfferIds = edges.map((edge) => edge.object);

        const getIDsWithX = prepareQueryWhereInIDs(foundOfferIds);
        const foundEntities = await db.getEntities(getIDsWithX);

        return foundEntities.map((ent) => JSON.parse(ent.entity));
    } catch (error) {
        logger.error("failed to get catalog", error);
        throw Error(error);
    }
}

async function addFolder(_, { input }, { logger, db }) {
    const id = uuid2id(input.id);
    if (id === "") {
        return new Error("uuid is invalid");
    }

    try {
        const r = await db.createEntity({
            entity: JSON.stringify({
                ...input,
                type: "ru.webrx.folder",
            }),
            id: id,
            type: "ru.webrx.folder",
        });

        return true;
    } catch (error) {
        logger.error("failed to add folder", error);
    }
}

async function updateFolder(_, data, { logger, db }) {
    const id = uuid2id(data.input.id);
    if (id === "") {
        return new Error("uuid is invalid");
    }

    try {
        const r = await db.updateEntity({
            entity: JSON.stringify({
                ...data.input,
                type: "ru.webrx.folder",
            }),
            id: id,
            type: "ru.webrx.folder",
        });

        return true;
    } catch (error) {
        logger.error("failed to update folder", error);
    }
}

async function removeFolder(_, data, { logger, db }) {
    const id = uuid2id(data.id);
    if (id === "") {
        return new Error("uuid is invalid");
    }
    try {
        const r = await db.removeEntity(id);

        return true;
    } catch (error) {
        logger.error("failed to remove folder", error);
    }
}

async function moveToFolder(_, { input }, { logger, db }) {
    const subject = uuid2id(input.subject);
    const object = uuid2id(input.object);

    // if (subject === "" || object === "") {
    //     return new Error("uuid is invalid");
    // }

    try {
        const rTriple = await db.createTriple({
            object: object,
            predicate: "ru.webrx.folder",
            priority: input.priority,
            subject: subject,
        });

        return true;
    } catch (error) {
        logger.error("failed to move to folder", error);
    }
}

async function removeFromFolder(_, { input }, { logger, db }) {
    const subject = uuid2id(input.subject);
    const object = uuid2id(input.object);
    if (subject === "") {
        return new Error("uuid is invalid");
    }

    try {
        const r = await db.removeTriple({
            object,
            predicate: "ru.webrx.folder",
            subject,
        });

        return true;
    } catch (error) {
        logger.error("failed to remove from folder", error);
    }
}

module.exports = {
    addFolder,
    getFolders,
    getFromFolder,
    catalog,
    moveToFolder,
    removeFolder,
    removeFromFolder,
    updateFolder,
};

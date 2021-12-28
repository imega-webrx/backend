const { uuid2id } = require("../helpers/convertUuid");
const { prepareQueryWhereInIDs } = require("../helpers/prepareQuery");

async function getProducts(_, data, { logger, db }) {
    const ids = data.uuIds
        .map((uuid) => uuid2id(uuid))
        .filter((id) => id !== "");

    if (!ids.length) {
        return [];
    }

    try {
        const getIDsWithX = prepareQueryWhereInIDs(ids);
        const foundEntities = await db.getEntities(getIDsWithX);

        const result = foundEntities.map((ent) => JSON.parse(ent.entity));
        return result;
    } catch (error) {
        logger.error("failed to get products", error);
    }
}

// eslint-disable-next-line complexity
async function searchProduct(_, data, { logger, db }) {
    if (data.title.length < 3) {
        return [];
    }

    try {
        const foundSuggests = await db.getSuggests(data);

        if (!foundSuggests.length) {
            return [];
        }

        const suggestIds = foundSuggests.map((entity) => entity.id);
        const getIDsWithX = prepareQueryWhereInIDs(suggestIds);
        const foundEntities = await db.getEntities(getIDsWithX);

        const result = foundEntities.map((ent) => JSON.parse(ent.entity));
        return result;
    } catch (error) {
        logger.error("failed to search product", error);
    }
}

async function addProduct(_, { input }, { logger, db }) {
    const id = uuid2id(input.id);
    if (id === "") {
        return new Error("uuid is invalid");
    }

    try {
        const rEntity = await db.createEntity({
            id: id,
            type: "ru.webrx.product",
            entity: JSON.stringify({
                ...input,
                type: "ru.webrx.product",
                rootFolder: process.env.ROOT_FOLDER,
            }),
        });
        const rSuggest = await db.addSuggest({
            id: id,
            source: input.title,
            type: "ru.webrx.product",
        });

        return true;
    } catch (error) {
        logger.error("failed to add product", error);
    }
}

async function updateProduct(_, data, { logger, db }) {
    const id = uuid2id(data.id);
    if (id === "") {
        return new Error("uuid is invalid");
    }

    try {
        const r = await db.updateEntity({
            entity: JSON.stringify({
                ...data.input,
                type: "ru.webrx.product",
            }),
            id: id,
            type: "ru.webrx.product",
        });

        return true;
    } catch (error) {
        logger.error("failed to update product", error);
    }
}

async function removeProduct(_, data, { logger, db }) {
    const id = uuid2id(data.id);
    if (id === "") {
        return new Error("uuid is invalid");
    }

    try {
        const r = await db.removeEntity(id);

        return true;
    } catch (error) {
        logger.error("failed to remove product", error);
    }
}

module.exports = {
    addProduct,
    getProducts,
    removeProduct,
    searchProduct,
    updateProduct,
};

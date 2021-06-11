const {
    ProvidedRequiredArgumentsOnDirectivesRule,
} = require("graphql/validation/rules/ProvidedRequiredArgumentsRule");

const products = [
    {
        id: "1",
        title: "Капецитабин",
        price: "от 150р.",
    },
    {
        id: "2",
        title: "Пенталгин",
        price: "от 200р.",
    },
    {
        id: "3",
        title: "Пендимин",
        price: "от 450р.",
    },
    {
        id: "4",
        title: "Пендаль",
        price: "от 700р.",
    },
];

const books = [
    {
        title: "Harry Potter and the Chamber of Secrets",
        author: "J.K. Rowling",
        year: 2000,
    },
    {
        title: "Jurassic Park",
        author: "Michael Crichton",
        year: 2000,
    },
];

const resolvers = {
    Query: {
        books: async (_, o, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    conn.query("SELECT 1 as id", (err, res) => {
                        conn.release();

                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve(res);
                    });
                });
            });

            console.log("+++", JSON.stringify(res, null, 2));

            return books;
        },
        entities: async (_, o, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    conn.query("SELECT * from entities", (err, res) => {
                        conn.release();

                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve(res);
                    });
                });
            });

            console.log("enty: ", JSON.stringify(res, null, 2));

            return res;
        },
        product(parent, args, context, info) {
            return products.filter(
                (product) =>
                    args.title.length > 2 &&
                    product.title
                        .toLowerCase()
                        .indexOf(args.title.toLowerCase()) > -1
            );
        },
    },
    Mutation: {
        addProduct: (_, { id, title, entity, fullTitle, price }, { db }) => {
            const newProduct = { id, title, entity, fullTitle, price };
            products.push(newProduct);

            db.getConnection(function (err, conn) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(newProduct.id);
                const insertProductData = conn.query(
                    "INSERT INTO entities (id, type, entity) VALUES (?,?,?)",
                    [
                        newProduct.id,
                        newProduct.title,
                        `{"${newProduct.entity}": ${newProduct.entity}}`,
                    ],
                    (err, res) => {
                        conn.release();

                        if (err) {
                            console.log(err);
                            return;
                        }
                    }
                );
            });

            return products;
        },
        updateProduct: (_, ih, { db }) => {
            const updateOk = products.find(
                (product) => product.id === ih.productId
            );
            if (!updateOk) {
                console.log("error, not such product");
            }

            updateOk.title = ih.title;
            updateOk.entity = ih.entity;

            console.log(products);

            db.getConnection(function (err, conn) {
                if (err) {
                    console.log(err);
                    return;
                }

                console.log(products);

                const uploadData = conn.query(
                    "UPDATE entities SET type =?, entity =? WHERE id = ?",
                    [
                        updateOk.title,
                        `{"${updateOk.entity}": ${updateOk.entity}}`,
                        updateOk.id,
                    ],
                    (err, res) => {
                        conn.release();
                        console.log("we here");
                        console.log(res);
                        if (err) {
                            console.log(err);
                            return;
                        }
                    }
                );

                console.log(uploadData.sql);
                console.log(products);
            });

            return products;
        },
        removeProduct: (_, ih, { db }) => {
            db.getConnection(function (err, conn) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(products);
                const deleteData = conn.query(
                    "DELETE FROM entities WHERE id = ?",
                    [ih.id],
                    (err, res) => {
                        conn.release();
                        console.log("we here");
                        console.log(res);
                        if (err) {
                            console.log(err);
                            return;
                        }
                    }
                );
                console.log(deleteData.sql);
            });
            return products;
        },
    },
};

module.exports = resolvers;

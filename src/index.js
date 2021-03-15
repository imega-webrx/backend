const path = require("path");
const fs = require("fs");

const mysql = require("mysql");
const express = require("express");
const cors = require("cors");

// Apollo server
const { ApolloServer, gql } = require("apollo-server-express");
const expressPlayground = require("graphql-playground-middleware-express")
    .default;

const PORT = 4000;

const schema = fs.readFileSync(
    path.join(__dirname, "shema", "schema.graphql"),
    "utf-8",
    (error) => {
        if (error) throw error;
    }
);

const typeDefs = gql(schema);
const resolvers = require("./resolvers");

const server = new ApolloServer({ typeDefs, resolvers, introspection: true });

const app = express();
app.use(cors());
app.use(express.json());

server.applyMiddleware({
    app,
    cors: {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        optionsSuccessStatus: 204,
    },
});

app.use("/playground", expressPlayground({ endpoint: "/graphql" }));

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "root",
    database: process.env.MYSQL_DBNAME || "testdb",
});

connection.connect((err) => {
    if (err)
        connection.end((err) => {
            throw err;
        });
    else {
        app.listen(process.env.BACKEND_PORT || PORT, () => {
            console.log(`start localhost:${PORT}`);
        });
    }
});

connection.query("SELECT 1 + 2 AS solution", function (error, results, fields) {
    if (error) throw error;
    console.log("The solution is: ", results[0].solution);
});

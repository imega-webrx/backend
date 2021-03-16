module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:node/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:promise/recommended",
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    plugins: ["node", "import", "promise"],
    ignorePatterns: ["/*.*"],
    rules: {
        indent: "off",
    },
};

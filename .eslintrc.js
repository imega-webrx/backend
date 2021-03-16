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
    // disables eslint check of configuration files in the project root dir
    // not required if rules:"sort-keys" disabled
    ignorePatterns: ["/*.*"],
    rules: {
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double", { allowTemplateLiterals: true }],
        semi: ["error", "always"],
        curly: ["error"],
        "space-before-function-paren": [
            "error",
            {
                anonymous: "never",
                named: "never",
                asyncArrow: "always",
            },
        ],
        "one-var": ["error", { var: "always", let: "never", const: "never" }],
        // warns if elements in objects are not ordered in ascending order
        "sort-keys": [
            "warn",
            "asc",
            { caseSensitive: true, natural: false, minKeys: 2 },
        ],
        eqeqeq: ["error", "smart"],
        complexity: ["warn", { max: 2 }],
        "no-magic-numbers": [
            "error",
            { ignore: [-1, 0, 1], ignoreArrayIndexes: true },
        ],
        "no-param-reassign": ["error", { props: false }],
        "no-unused-vars": [
            "error",
            {
                args: "after-used",
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
            },
        ],
    },
};

const config = {
    testEnvironment: "node",

    testMatch: [
        "**/test/**/*.test.js"
    ],

    collectCoverageFrom: [
        "src/**/*.js",
        "!src/cli.js"
    ]
}
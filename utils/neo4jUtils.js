module.exports = {
    driver: function () {
        const neo4j = require('neo4j-driver').v1;
        const maxRetryTimeMs = 15 * 1000; // 15 seconds
        const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '123456'), {
            maxTransactionRetryTime: maxRetryTimeMs
        });
        return driver;
    },
    isBlank: function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }
};
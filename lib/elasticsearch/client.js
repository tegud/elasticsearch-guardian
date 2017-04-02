const elasticsearch = require('elasticsearch');
let client;
let config;

module.exports = {
    config: newConfig => config = newConfig,
    start: () => {
        client = new elasticsearch.Client({ host: config.host });
        return Promise.resolve();
    },
    get: () => Promise.resolve(client)
};

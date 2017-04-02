const esClient = require('./client');

module.exports = function() {
    return esClient.get()
        .then(client => client.info());
};

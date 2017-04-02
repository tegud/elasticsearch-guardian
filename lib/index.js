const config = require('./config');
const HttpServer = require('./http');

module.exports = function() {
    const modules = [
        new HttpServer(),
        require('./elasticsearch/client')
    ];

    require('./elasticsearch/client').config(config.get());

    return {
        start: () => Promise.all(modules.map(m => m.start()))
            .then(() => require('./cluster-info').start())
    }
};

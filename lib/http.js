const http = require('http');
const app = require('express')();
const logging = require('./logging').forModule('HTTP Server');

module.exports = function() {
    const server = http.createServer(app);
    const port = 1234;

    app
        .use((req, res, next) => {
            res.set({
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            });

            next();
        })
        .get('/', (req, res) => require('./cluster-info').get()
            .then(cluster => res.json({
                name: 'elasticsearch-guardian',
                description: 'Monitoring and advice for elasticsearch clusters',
                cluster: cluster,
                links: []
            })));

    return {
        start: () => new Promise(resolve => server.listen(port, () => {
            logging.logInfo('Server listening', { port: port });
            resolve();
        })),
        stop: () => new Promise(resolve => {
            server.close();
            resolve();
        })
    };
};

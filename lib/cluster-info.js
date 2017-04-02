const getBasicInfo = require('./elasticsearch/info');
const getNodeInfo = require('./elasticsearch/nodes');

let clusterInfo;
let getDataPromise;
let refreshTimeout;

function refresh() {
    return getDataPromise = Promise.all([getBasicInfo(), getNodeInfo()]).then(results => {
        const [basicInfo, nodes] = results;

        refreshTimeout = setTimeout(refresh, 30000);

        return Promise.resolve(clusterInfo = {
            cluster: basicInfo.cluster_name,
            version: basicInfo.version.number,
            nodes: nodes
        });
    });
}

module.exports = {
    start: () => {
        clusterInfo = undefined;
        getDataPromise = refresh();

        return Promise.resolve();
    },
    stop: () => clearTimeout(refreshTimeout),
    get: () => {
        if(clusterInfo) {
            return Promise.resolve(clusterInfo);
        }

        if(getDataPromise) {
            return getDataPromise;
        }
    }
};

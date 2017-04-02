const esClient = require('./client');

const properties = [
    'name',
    'timestamp',
    {
        property: 'transport_address',
        key: 'address',
        mapper: value => {
            const transportAddressIpRegex = /^inet\[\/([^\:]+):([0-9]+)\]$/i;

            const ipMatch = value.match(transportAddressIpRegex);

            return ipMatch ? {
                ip: ipMatch[1],
                port: ipMatch[2] || 9300
            } : value;
        }
    },
    'host',
    'attributes',
    'os',
    'jvm'
];

module.exports = function() {
    const whitelistedProperties = properties.map(property => typeof property === 'string' ? property : property.property);

    return esClient.get()
        .then(client => client.nodes.stats())
        .then(nodes => Object.keys(nodes.nodes).map(nodeKey => Object.keys(nodes.nodes[nodeKey]).reduce((mappedNode, property) => {
            if(whitelistedProperties.includes(property)) {
                const propertyWhitelistEntrty = properties.filter(entry => entry === property || entry.property === property)[0];

                if(typeof propertyWhitelistEntrty === 'string') {
                    mappedNode[property] = nodes.nodes[nodeKey][property];
                    return mappedNode;
                }

                if(propertyWhitelistEntrty.mapper) {
                    mappedNode[propertyWhitelistEntrty.key || property] = propertyWhitelistEntrty.mapper(nodes.nodes[nodeKey][property]);
                    return mappedNode;
                }
            }

            return mappedNode;
        }, { id: nodeKey })))
};

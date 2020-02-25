var rpcApi = require("./rpcApi.js");

function getBlockByHeight(blockHeight) {
	return rpcApi.getBlockByHeight(blockHeight);
}

function getBlocksByHeight(blockHeights) {
	return new Promise((resolve, reject) => {
		var promises = [];
		for (var i = 0; i < blockHeights.length; i++) {
            promises.push(getBlockByHeight(blockHeights[i]));
            // .then(result => {
            //     resolve(result);
            // })
            // .catch(err => {
            //     console.log(err);
            //     reject(err);
            // }));
		}
        Promise.all(promises)
        .then(results => {
			resolve(results);
		}).catch(err => {
            console.log(err);
            reject(err);
		});
	});
}

function getBlockchainInfo() {
    return rpcApi.getBlockchainInfo();
}

function getBlockByHash(blockHash) {
	return rpcApi.getBlockByHash(blockHash);
}

module.exports = {
    getBlockByHeight: getBlockByHeight,
    getBlocksByHeight: getBlocksByHeight,
    getBlockchainInfo: getBlockchainInfo,
    getBlockByHash: getBlockByHash
}

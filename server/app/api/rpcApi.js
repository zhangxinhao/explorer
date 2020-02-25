function getRpcData(cmd) {
    return new Promise((resolve, reject) => {
        var client = global.rpcClient;
        client.command(cmd)
        .then(result => {
            resolve(result);
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

function getRpcDataWithParams(request) {
    return new Promise((resolve, reject) => {
        JSON.stringify(request);
        var client = global.rpcClient;
        client.command([request])
        .then(result => {
            resolve(result);
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });
    });
}


function getBlockByHeight(blockHeight) {
	return new Promise((resolve, reject) => {
        getRpcDataWithParams({method:"getblockhash", parameters:[blockHeight]})
        .then(blockhash => {
            getBlockByHash(blockhash)
            .then(block => {
				resolve(block);
            })
            .catch(err => {
                console.log(err);
                reject(err);
			});
        })
        .catch(err => {
            console.log(err);
            reject(err);
		});
	});
}

function getBlockByHash(blockHash) {
	return new Promise((resolve, reject) => {
        getRpcDataWithParams({method:"getblock", parameters:blockHash})
        .then(block => {
            resolve(block);
        })
        .catch(err => {
            console.log(err);
            reject(err);
		});
	});
}

function getBlockchainInfo() {
	return getRpcData("getblockchaininfo");
}


module.exports = {
	getBlockchainInfo: getBlockchainInfo,
	// getNetworkInfo: getNetworkInfo,
	// getNetTotals: getNetTotals,
	// getMempoolInfo: getMempoolInfo,
	// getMempoolTxids: getMempoolTxids,
	// getMiningInfo: getMiningInfo,
	// getRawTransaction: getRawTransaction,
	// getUtxo: getUtxo,
	// getMempoolTxDetails: getMempoolTxDetails,
	// getRawMempool: getRawMempool,
	// getUptimeSeconds: getUptimeSeconds,
	// getHelp: getHelp,
	// getRpcMethodHelp: getRpcMethodHelp,
	// getAddress: getAddress,
	// getPeerInfo: getPeerInfo,
    // getChainTxStats: getChainTxStats,
    getBlockByHeight: getBlockByHeight,
	getBlockByHash: getBlockByHash
};

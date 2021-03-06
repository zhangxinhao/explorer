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
            resolve(result[0]);
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
        getRpcDataWithParams({method:"getblock", parameters:[blockHash]})
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

function getRawTransaction(txid) {
	return new Promise((resolve, reject) => {
        getRpcDataWithParams({method:"getrawtransaction", parameters:[txid, 1]})
        .then(result => {
            if (result == null || result.code && result.code < 0) {
                reject(result);

                return;
            }
            resolve(result);
        })
        .catch(function(err) {
            reject(err);
        });
	});
}

function getUtxo(txid, outputIndex) {
	return new Promise((resolve, reject) => {
        getRpcDataWithParams({method:"gettxout", parameters:[txid, outputIndex]})
        .then(result => {
			if (result == null) {
				resolve("0");

				return;
			}

			if (result.code && result.code < 0) {
				reject(result);

				return;
			}

			resolve(result);

        })
        .catch(err => {
			reject(err);
		});
	});
}

function getAddress(address) {
	return getRpcDataWithParams({method:"validateaddress", parameters:[address]});
}

module.exports = {
	getBlockchainInfo: getBlockchainInfo,
	getRawTransaction: getRawTransaction,
	getUtxo: getUtxo,
    getBlockByHeight: getBlockByHeight,
    getBlockByHash: getBlockByHash,
    getAddress: getAddress
};

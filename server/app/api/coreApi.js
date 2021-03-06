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

function getBlockByHashWithTransactions(blockHash, txLimit, txOffset) {
    return new Promise((resolve, reject) => {
        getBlockByHash(blockHash).then(block => {
            var txids = [];

			if (txOffset > 0) {
				txids.push(block.tx[0]);
			}

			for (var i = txOffset; i < Math.min(txOffset + txLimit, block.tx.length); i++) {
				txids.push(block.tx[i]);
            }

            getRawTransactions(txids).then(transactions => {
				if (transactions.length == txids.length) {
					block.coinbaseTx = transactions[0];
					// block.totalFees = utils.getBlockTotalFeesFromCoinbaseTxAndBlockHeight(block.coinbaseTx, block.height);
					// block.miner = utils.getMinerFromCoinbaseTx(block.coinbaseTx);
				}

				// if we're on page 2, we don't really want it anymore...
				if (txOffset > 0) {
					transactions.shift();
				}

				var maxInputsTracked = 15;
				var vinTxids = [];
				for (var i = 0; i < transactions.length; i++) {
                    var transaction = transactions[i];

					if (transaction && transaction.vin) {
						for (var j = 0; j < Math.min(maxInputsTracked, transaction.vin.length); j++) {
							if (transaction.vin[j].txid) {
								vinTxids.push(transaction.vin[j].txid);
							}
						}
					}
				}

				var txInputsByTransaction = {};
				getRawTransactions(vinTxids).then(vinTransactions => {
					var vinTxById = {};

					vinTransactions.forEach(tx => {
                        vinTxById[tx.txid] = tx;
					});

					transactions.forEach(tx => {
						txInputsByTransaction[tx.txid] = {};

						if (tx && tx.vin) {
							for (var i = 0; i < Math.min(maxInputsTracked, tx.vin.length); i++) {
								if (vinTxById[tx.vin[i].txid]) {
									txInputsByTransaction[tx.txid][i] = vinTxById[tx.vin[i].txid];
								}
							}
						}
                    });
                    resolve({ getblock:block, transactions:transactions, txInputsByTransaction:txInputsByTransaction});
				});
			});

        })
        .catch(err => {
            console.log(err);
            reject(err);
		});
    });
}

function getRawTransactions(txids) {
	return new Promise((resolve, reject) =>  {
		var promises = [];
		for (var i = 0; i < txids.length; i++) {
			promises.push(getRawTransaction(txids[i]));
		}

		Promise.all(promises).then(results => {
			resolve(results);

		}).catch(function(err) {
			reject(err);
		});
	});
}

function getRawTransaction(txid) {
	return rpcApi.getRawTransaction(txid);
}

function getTxUtxos(tx) {
	return new Promise((resolve, reject) => {
		var promises = [];

		for (var i = 0; i < tx.vout.length; i++) {
			promises.push(getUtxo(tx.txid, i));
		}

		Promise.all(promises).then(results => {
			resolve(results);

		}).catch(err => {
			reject(err);
		});
	});
}

function getUtxo(txid, outputIndex) {
	return rpcApi.getUtxo(txid, outputIndex);
}

function getAddress(address) {
	return rpcApi.getAddress(address);
}

function getRawTransactionsWithInputs(txids) {
	return new Promise(function(resolve, reject) {
		getRawTransactions(txids).then(transactions => {
			var maxInputsTracked = 10;
			var vinTxids = [];
			for (var i = 0; i < transactions.length; i++) {
				var transaction = transactions[i];
				if (transaction && transaction.vin) {
					for (var j = 0; j < Math.min(maxInputsTracked, transaction.vin.length); j++) {
						if (transaction.vin[j].txid) {
							vinTxids.push(transaction.vin[j].txid);
						}
					}
				}
			}
            console.log('vinTxids', vinTxids.length)
			var txInputsByTransaction = {};
			getRawTransactions(vinTxids).then(vinTransactions => {
				var vinTxById = {};

				vinTransactions.forEach(tx => {
					vinTxById[tx.txid] = tx;
				});

				transactions.forEach(tx => {
					txInputsByTransaction[tx.txid] = {};

					if (tx && tx.vin) {
						for (var i = 0; i < Math.min(maxInputsTracked, tx.vin.length); i++) {
							if (vinTxById[tx.vin[i].txid]) {
								txInputsByTransaction[tx.txid][i] = vinTxById[tx.vin[i].txid];
							}
						}
					}
				});

				resolve({ transactions:transactions, txInputsByTransaction:txInputsByTransaction });
			});
		});
	});
}

function getBlocksByHash(blockHashes) {
	return new Promise(function(resolve, reject) {
		var promises = [];
		for (var i = 0; i < blockHashes.length; i++) {
			promises.push(getBlockByHash(blockHashes[i]));
		}

		Promise.all(promises).then(results => {
			var result = {};

			results.forEach(item => {
				result[item.hash] = item;
			});

			resolve(result);

		}).catch(err => {
			reject(err);
		});
	});
}

module.exports = {
    getBlockByHeight: getBlockByHeight,
    getBlocksByHeight: getBlocksByHeight,
    getBlockchainInfo: getBlockchainInfo,
    getBlockByHash: getBlockByHash,
    getRawTransactions: getRawTransactions,
    getRawTransaction: getRawTransaction,
    getBlockByHashWithTransactions: getBlockByHashWithTransactions,
    getTxUtxos: getTxUtxos,
    getAddress: getAddress,
    getRawTransactionsWithInputs: getRawTransactionsWithInputs,
    getBlocksByHash: getBlocksByHash
}

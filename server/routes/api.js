var express = require('express');
var bitcoinjs = require('bitcoinjs-lib')
var cryptoJs = require('crypto-js')
var Decimal = require("decimal.js");
var qrcode = require('qrcode');

var coreApi = require('../app/api/coreApi')
var addressApi = require("../app/api/addressApi")


var router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    console.log('ok');
    // coreApi.getBlockByHash(["00000000001c011c319781b9652027ca68a8f47617dfb2b29f467ddce0fe5a4d"])
    // .then(blocks => {
    //     res.locals.blocks = blocks;
    //     res.send(blocks);
    //     // next();
    // })
    // .catch(err => {
    //     res.locals.userMessage = "Error22: " + err;
    //     res.send(res.locals.userMessage);
    // });

    // var client = global.rpcClient;
    // client.command([{method: 'validateaddress', parameters: ["tb1qmyt6ftp345kwydvvzzljn3x535c5v5e73ck0yq"]}])
    // // client.command('getblockchaininfo')
    // .then(result => {
    //     res.send(result);
    // })
    // .catch(err => {
    //     console.log(err);
    //     res.locals.userMessage = "Error1: " + err;
    //     res.send(res.locals.userMessage);
    // });

    var txids = ["212c9049172b373300e2611d2872d9851e69a4a77177c7db811efaa624f1e5bd", "06e1d5870c2360020905cdcad53cc5972c0525991f51a73afdecdd104f8714e7"]
    coreApi.getRawTransactionsWithInputs(txids)
    .then(function(rawTxResult) {
        res.send(rawTxResult)
    })
    .catch(function(err) {
        res.locals.userMessage = "Error1: " + err;
        res.send(res.locals.userMessage);
    });
    console.log('finshed');
});

router.get('/test', function (req, res, next) {
    console.log('ok2');
    var client = global.rpcClient;
    client.command([{method: 'getblockhash', parameters: [1]}])
    // client.command('getblockchaininfo')
    .then(result => {
        res.send(result);
    })
    .catch(err => {
        console.log(err);
        res.locals.userMessage = "Error1: " + err;
        res.send(res.locals.userMessage);
    });
    console.log('finshed2');
});

router.get('/blockchaininfo', function (req, res, next) {
    coreApi.getBlockchainInfo().then(getblockchaininfo => {
        res.send(getblockchaininfo);
    })
    .catch(err => {
        res.locals.userMessage = "Error: " + err;
        res.send(res.locals.userMessage);
    });
});


router.get("/blocks", function(req, res, next) {
	var limit = 20;
	var offset = 0;
	var sort = "desc";

	if (req.query.limit) {
		limit = parseInt(req.query.limit);
	}

	if (req.query.offset) {
		offset = parseInt(req.query.offset);
	}

	if (req.query.sort) {
		sort = req.query.sort;
	}

	res.locals.limit = limit;
	res.locals.offset = offset;
	res.locals.sort = sort;
	res.locals.paginationBaseUrl = "/blocks";

	coreApi.getBlockchainInfo().then(getblockchaininfo => {
		res.locals.blockCount = getblockchaininfo.blocks;
		res.locals.blockOffset = offset;

		var blockHeights = [];
		if (sort == "desc") {
			for (var i = (getblockchaininfo.blocks - offset); i > (getblockchaininfo.blocks - offset - limit); i--) {
				if (i >= 0) {
					blockHeights.push(i);
				}
			}
		} else {
			for (var i = offset; i < (offset + limit); i++) {
				if (i >= 0) {
					blockHeights.push(i);
				}
			}
		}

        coreApi.getBlocksByHeight(blockHeights)
        .then(blocks => {
            res.locals.blocks = blocks;
            res.send(blocks);
			// next();
        })
        .catch(err => {
            console.log(blockHeights);
            res.locals.userMessage = "Error: " + err;
            res.send(res.locals.userMessage);
        });
	}).catch(err => {
		res.locals.userMessage = "Error: " + err;
        res.send(res.locals.userMessage);
	});
});

router.get("/block-height", function(req, res, next) {
    var blockHeight = parseInt(req.query.blockHeight);
    var limit = 5;
    var offset = 0;
    res.locals.result = {};

    if (req.query.offset) {
		offset = parseInt(req.query.offset);
    }
    coreApi.getBlockByHeight(blockHeight).then(result => {
		res.locals.result.getblockbyheight = result;
		coreApi.getBlockByHashWithTransactions(result.hash, limit, offset).then(result => {
			res.locals.result.getblock = result.getblock;
			res.locals.result.transactions = result.transactions;
			res.locals.result.txInputsByTransaction = result.txInputsByTransaction;
            res.send(result);

			next();
        })
        .catch(err => {
            res.locals.userMessage = "Error: " + err;
            res.send(res.locals.userMessage);
        });
    })
    .catch(err => {
		res.locals.userMessage = "Error: " + err;
        res.send(res.locals.userMessage);
	});
});

router.get("/tx", function(req, res, next) {
	var txid = req.query.txid;

	// var output = -1;
	// if (req.query.output) {
	// 	output = parseInt(req.query.output);
	// }

	res.locals.txid = txid;
	// res.locals.output = output;

    res.locals.result = {};

    coreApi.getRawTransaction(txid)
    .then(rawTxResult => {
        res.locals.result.getrawtransaction = rawTxResult;
		var promises = [];

		promises.push(new Promise((resolve, reject) => {
            coreApi.getTxUtxos(rawTxResult)
            .then(utxos => {
				res.locals.utxos = utxos;

				resolve();

            })
            .catch(err => {
				reject(err);
			});
		}));

		// if (rawTxResult.confirmations == null) {
		// 	promises.push(new Promise((resolve, reject) => {
		// 		coreApi.getMempoolTxDetails(txid).then(mempoolDetails => {
		// 			res.locals.mempoolDetails = mempoolDetails;

		// 			resolve();

		// 		}).catch(err => {
        //             res.locals.userMessage = "Error: " + err;
        //             res.send(res.locals.userMessage);
		// 			reject(err);
		// 		});
		// 	}));
		// }

		promises.push(new Promise((resolve, reject) => {
            coreApi.getBlockByHash(rawTxResult.blockhash)
            .then(block => {
                res.locals.result.getblock = block;

                var txids = [];
				for (var i = 0; i < rawTxResult.vin.length; i++) {
					if (!rawTxResult.vin[i].coinbase) {
						txids.push(rawTxResult.vin[i].txid);
					}
				}
				coreApi.getRawTransactions(txids).then(txInputs => {
                    res.locals.result.txInputs = txInputs;
					resolve();
				});
            })
            .catch(err => {
                res.locals.userMessage = "Error: " + err;
                res.send(res.locals.userMessage);
                next();
            });
		}));

		Promise.all(promises).then(function() {
            res.send(res.locals.result)
			next();

		}).catch(err => {
            res.locals.userMessage = "Error: " + err;
            res.send(res.locals.userMessage);
			next();
		});


	}).catch(err => {
		res.locals.userMessage = "Error: " + err;
        res.send(res.locals.userMessage);
		next();
	});
});

router.get("/address", function(req, res, next) {
    var address = req.query.address;
    var limit = 5;
	var offset = 0;
    var sort = "desc";
    res.locals.result = {};

    if (req.query.limit) {
		limit = parseInt(req.query.limit);
	}

	if (req.query.offset) {
		offset = parseInt(req.query.offset);
	}

	if (req.query.sort) {
		sort = req.query.sort;
    }

    var address = req.query.address;
    res.locals.result.address = address
    try{
        addressObj = bitcoinjs.address.fromBase58Check(address);
        console.log('fromBase58Check');
    } catch (err) {
        try {
			addressObj = bitcoinjs.address.fromBech32(address);
            console.log('fromBech32');
		} catch (err2) {
            res.locals.userMessage = "Error: " + err;
            res.locals.userMessage += "===Error2" + err2
            res.send(res.locals.userMessage);
		}
    }
    res.locals.result.addressObj = addressObj
    if (addressObj.hash) {
        addressObj['toString'] = addressObj.hash.toString("hex")
    }
    coreApi.getAddress(address)
    .then(validateaddressResult => {
        res.locals.result.validateaddress = validateaddressResult;
        var promises = [];

        tmp = validateaddressResult.scriptPubKey
        tmp = cryptoJs.enc.Hex.parse(tmp)
        tmp = cryptoJs.SHA256(tmp)
        tmp = cryptoJs.enc.Hex.stringify(tmp)
        tmp = tmp.match(/.{2}/g).reverse().join("");

        promises.push(new Promise(function(resolve, reject) {
            addressApi.getAddressDetails(address, validateaddressResult.scriptPubKey, sort, limit, offset)
            .then(addressDetailsResult => {
                var addressDetails = addressDetailsResult.addressDetails;
                if (addressDetails) {
                    res.locals.result.addressDetails = addressDetails;
                    if (addressDetails.txids) {
                        var blockHeightsByTxid = {};
                        var txids = addressDetails.txids;
                        coreApi.getRawTransactionsWithInputs(txids)
                        .then(rawTxResult => {
                            res.locals.result.transactions = rawTxResult.transactions;
                            res.locals.result.txInputsByTransaction = rawTxResult.txInputsByTransaction;

                            var coinbaseTxs = [];
                            for (var i = 0; i < rawTxResult.transactions.length; i++) {
                                var tx = rawTxResult.transactions[i];

                                for (var j = 0; j < tx.vin.length; j++) {
                                    if (tx.vin[j].coinbase) {
                                        coinbaseTxs.push(tx);
                                    }
                                }
                            }

                            var coinbaseTxBlockHashes = [];
                            var blockHashesByTxid = {};
                            coinbaseTxs.forEach(tx => {
                                coinbaseTxBlockHashes.push(tx.blockhash);
                                blockHashesByTxid[tx.txid] = tx.blockhash;
                            });

                            var blockHeightsPromises = [];
                            if (coinbaseTxs.length > 0) {
                                blockHeightsPromises.push(new Promise(function(resolve, reject) {
                                    coreApi.getBlocksByHash(coinbaseTxBlockHashes).then(blocksByHashResult => {
                                        for (var txid in blockHashesByTxid) {
                                            if (blockHashesByTxid.hasOwnProperty(txid)) {
                                                blockHeightsByTxid[txid] = blocksByHashResult[blockHashesByTxid[txid]].height;
                                            }
                                        }
                                        resolve();

                                    }).catch(err => {
                                        reject(err);
                                    });
                                }));
                            }

                            Promise.all(blockHeightsPromises).then(function() {
                                var addrGainsByTx = {};
                                var addrLossesByTx = {};

                                res.locals.result.addrGainsByTx = addrGainsByTx;
                                res.locals.result.addrLossesByTx = addrLossesByTx;

                                var handledTxids = [];

                                for (var i = 0; i < rawTxResult.transactions.length; i++) {
                                    var tx = rawTxResult.transactions[i];
                                    var txInputs = rawTxResult.txInputsByTransaction[tx.txid];

                                    if (handledTxids.includes(tx.txid)) {
                                        continue;
                                    }

                                    handledTxids.push(tx.txid);

                                    for (var j = 0; j < tx.vout.length; j++) {
                                        if (tx.vout[j].value > 0 && tx.vout[j].scriptPubKey && tx.vout[j].scriptPubKey.addresses && tx.vout[j].scriptPubKey.addresses.includes(address)) {
                                            if (addrGainsByTx[tx.txid] == null) {
                                                addrGainsByTx[tx.txid] = new Decimal(0);
                                            }

                                            addrGainsByTx[tx.txid] = addrGainsByTx[tx.txid].plus(new Decimal(tx.vout[j].value));
                                        }
                                    }

                                    for (var j = 0; j < tx.vin.length; j++) {
                                        var txInput = txInputs[j];
                                        var vinJ = tx.vin[j];

                                        if (txInput != null) {
                                            if (txInput.vout[vinJ.vout] && txInput.vout[vinJ.vout].scriptPubKey && txInput.vout[vinJ.vout].scriptPubKey.addresses && txInput.vout[vinJ.vout].scriptPubKey.addresses.includes(address)) {
                                                if (addrLossesByTx[tx.txid] == null) {
                                                    addrLossesByTx[tx.txid] = new Decimal(0);
                                                }

                                                addrLossesByTx[tx.txid] = addrLossesByTx[tx.txid].plus(new Decimal(txInput.vout[vinJ.vout].value));
                                            }
                                        }
                                    }
                                }

                                res.locals.result.blockHeightsByTxid = blockHeightsByTxid;

                                resolve();

                            }).catch(err => {
                                reject(err);
                            });
                        })
                        .catch(err => {
                            reject(err);
                        });
                    } else {
                        resolve();
                    }
                } else {
                    resolve();
                }
            })
            .catch(err => {
                reject(err);
            });
        }));

        promises.push(new Promise(function(resolve, reject) {
            coreApi.getBlockchainInfo()
            .then(getblockchaininfo => {
                res.locals.result.getblockchaininfo = getblockchaininfo;

                resolve();

            })
            .catch(err => {
                reject(err);
            });
        }));

        promises.push(new Promise(function(resolve, reject) {
			qrcode.toDataURL(address, function(err, url) {
				if (err) {
					reject(err);
				}

				res.locals.result.addressQrCodeUrl = url;

				resolve();
			});
		}));

        Promise.all(promises).then(function() {
			res.send(res.locals.result)
			next();

		}).catch(err => {
            res.locals.userMessage = "Failed to load address " + address + " (" + err + ")";
            res.send(res.locals.userMessage);
			next();
		});
    })
    .catch(err => {
		res.locals.userMessage = "Error: " + err;
        res.send(res.locals.userMessage);
		next();
	});

})

module.exports = router;

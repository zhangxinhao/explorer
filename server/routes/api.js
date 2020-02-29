var express = require('express');
var router = express.Router();

var coreApi = require('../app/api/coreApi')

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log('ok');
    coreApi.getBlockByHash("00000000001c011c319781b9652027ca68a8f47617dfb2b29f467ddce0fe5a4d")
    .then(blocks => {
        res.locals.blocks = blocks;
        res.send(blocks);
        // next();
    })
    .catch(err => {
        res.locals.userMessage = "Error22: " + err;
        res.send(res.locals.userMessage);
    });

    // var client = global.rpcClient;
    // client.command([{method: 'getblock', parameters: ["00000000b873e79784647a6c82962c70d228557d24a747ea4d1b8bbe878e1206"]}])
    // // client.command('getblockchaininfo')
    // .then(result => {
    //     res.send(result);
    // })
    // .catch(err => {
    //     console.log(err);
    //     res.locals.userMessage = "Error1: " + err;
    //     res.send(res.locals.userMessage);
    // });
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
    var limit = 10;
    var offset = 0;
    res.locals.result = {};

    if (req.query.offset) {
		offset = parseInt(req.query.offset);
    }

    coreApi.getBlockByHeight(blockHeight).then(result => {
		res.locals.result.getblockbyheight = result;
		coreApi.getBlockByHashWithTransactions(result[0].hash, limit, offset).then(result => {
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
        rawTxResult = rawTxResult[0];
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
            coreApi.getBlockByHash([rawTxResult.blockhash])
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

module.exports = router;

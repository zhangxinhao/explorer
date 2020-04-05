var request = require("request");
var redis   = require('redis');

var redisClient  = redis.createClient('6379', '127.0.0.1');

var redisCache = {
	get:function(key) {
		return new Promise(function(resolve, reject) {
			redisClient.getAsync(key).then(function(result) {
				if (result == null) {
					resolve(null);
					return;
				}
				resolve(JSON.parse(result));
			}).catch(function(err) {

				reject(err);
			});
		});
	},
	set:function(key, obj) {
		redisClient.set(key, JSON.stringify(obj));
	}
};

function getAddressDetails(address, scriptPubkey, sort, limit, offset) {
	return new Promise(function(resolve, reject) {
		var options = {
			url: `https://api.blockchair.com/bitcoin/testnet/dashboards/address/${address}/?offset=${offset}`,
			headers: {
				'User-Agent': 'request'
			}
		};

		request(options, function(error, response, body) {
			if (error == null && response && response.statusCode && response.statusCode == 200) {
				var responseObj = JSON.parse(body);
				responseObj = responseObj.data[address];

				var result = {};

				result.txids = [];

				for (var i = 0; i < Math.min(responseObj.transactions.length, limit); i++) {
					var txid = responseObj.transactions[i];

					result.txids.push(txid);
				}

				result.txCount = responseObj.address.transaction_count;
				result.totalReceivedSat = responseObj.address.received;
				result.totalSentSat = responseObj.address.spent;
				result.balanceSat = responseObj.address.balance;
				result.source = "blockchair.com";

				resolve({addressDetails:result});

			} else {
				var fullError = {error:error, response:response, body:body};
				reject(fullError);
			}
		});
	});
}

function my_getAddressDetails(address, scriptPubkey, sort, limit, offset) {
    return new Promise(function(resolve, reject) {
		var cacheResult = null;

		var finallyFunc = function() {
			if (cacheResult != null) {
				resolve(cacheResult);
			} else {
                getAddressDetails(address, scriptPubkey, sort, limit, offset)
                .then(result => {
                    if (result != null) {
						redisCache.set(address, result);
					}
					resolve(result);
                }).catch(err => {
					reject(err);
				});
			}
		};

		redisCache.get(address).then(result => {
			cacheResult = result;

			finallyFunc();

		}).catch(err => {
			finallyFunc();
		});
	});
}


module.exports = {
	getAddressDetails: my_getAddressDetails
};

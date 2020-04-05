var blockchairAddressApi = require("./blockchairAddressApi.js");


function getAddressDetails(address, scriptPubkey, sort, limit, offset) {
    return blockchairAddressApi.getAddressDetails(address, scriptPubkey, sort, limit, offset);
}



module.exports = {
	getAddressDetails: getAddressDetails
};

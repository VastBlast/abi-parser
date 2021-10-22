const { BN } = require("web3-utils");
const abiCoder = require("web3-eth-abi");

module.exports.decodeMethod = function (data, singleKeys = false) {
	const methodID = data.slice(2, 10);
	const abiItem = this.state.methodIDs[methodID];
	if (abiItem) {
		const decoded = abiCoder.decodeParameters(abiItem.inputs, data.slice(10));

		const retData = {
			name: abiItem.name,
			params: [],
		};

		for (let i = 0; i < decoded.__length__; i++) {
			const param = decoded[i];
			let parsedParam = param;
			const isUint = abiItem.inputs[i].type.indexOf("uint") === 0;
			const isInt = abiItem.inputs[i].type.indexOf("int") === 0;
			const isAddress = abiItem.inputs[i].type.indexOf("address") === 0;

			if (isUint || isInt) {
				const isArray = Array.isArray(param);

				if (isArray) {
					parsedParam = param.map(val => new BN(val).toString());
				} else {
					parsedParam = new BN(param).toString();
				}
			}

			// Addresses returned by web3 are randomly cased so we need to standardize and lowercase all
			if (isAddress) {
				const isArray = Array.isArray(param);

				if (isArray) {
					parsedParam = param.map(_ => _.toLowerCase());
				} else {
					parsedParam = param.toLowerCase();
				}
			}

			parsedParam = {
				name: abiItem.inputs[i].name,
				value: parsedParam,
				type: abiItem.inputs[i].type,
			}
			if (singleKeys) {
				retData.params[parsedParam.name] = parsedParam.value;
			} else {
				retData.params.push(parsedParam);
			}

		}

		return retData;
	}
}

module.exports.decodeMethods = function (methods, singleKeys) {
	return methods.map((method) => {
		return this.decodeMethod(method, singleKeys);
	});
}
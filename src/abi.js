const { sha3 } = require("web3-utils");

module.exports.getABIs = function () {
	return this.state.savedABIs;
}

module.exports.addABI = function (abiArray) {

	if (Array.isArray(abiArray)) {
		// Iterate new abi to generate method id"s
		const _typeToString = this._typeToString;
		const state = this.state;
		abiArray.map(function (abi) {
			if (abi.name) {
				const signature = sha3(
					abi.name +
					"(" +
					abi.inputs
						.map(_typeToString)
						.join(",") +
					")"
				);
				if (abi.type === "event") {
					state.methodIDs[signature.slice(2)] = abi;
				} else {
					state.methodIDs[signature.slice(2, 10)] = abi;
				}
			}
		});

		this.state.savedABIs = this.state.savedABIs.concat(abiArray);
	} else {
		throw new Error("Expected ABI array, got " + typeof abiArray);
	}
}

module.exports.removeABI = function (abiArray) {
	if (Array.isArray(abiArray)) {
		// Iterate new abi to generate method id"s
		const state = this.state;
		abiArray.map(function (abi) {
			if (abi.name) {
				const signature = sha3(
					abi.name +
					"(" +
					abi.inputs
						.map(function (input) {
							return input.type;
						})
						.join(",") +
					")"
				);
				if (abi.type === "event") {
					if (state.methodIDs[signature.slice(2)]) {
						delete state.methodIDs[signature.slice(2)];
					}
				} else {
					if (state.methodIDs[signature.slice(2, 10)]) {
						delete state.methodIDs[signature.slice(2, 10)];
					}
				}
			}
		});
	} else {
		throw new Error("Expected ABI array, got " + typeof abiArray);
	}
}


module.exports.getMethodIDs = function () {
	return this.state.methodIDs;
}
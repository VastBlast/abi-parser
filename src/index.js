const abiMethods = require('./abi.js');
const methodMethods = require('./methods.js');
const logMethods = require('./logs.js');

AbiParser = class {
	constructor(abiArray = []) {
		this.state = {
			savedABIs: [],
			methodIDs: {},
		}
		this.addABI(abiArray)
	}

	_typeToString(input) {
		if (input.type === "tuple") {
			return "(" + input.components.map(this._typeToString).join(",") + ")";
		}
		return input.type;
	}


	addABI = abiMethods.addABI;
	removeABI = abiMethods.removeABI;
	getABIs = abiMethods.getABIs;
	getMethodIDs = abiMethods.getMethodIDs;

	decodeMethod = methodMethods.decodeMethod;
	decodeMethods = methodMethods.decodeMethods;

	decodeLog = logMethods.decodeLog;
	decodeLogs = logMethods.decodeLogs;
}

module.exports = AbiParser;

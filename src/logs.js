const { BN } = require("web3-utils");
const abiCoder = require("web3-eth-abi");

module.exports.decodeLog = function (logItem, singleKeys = false) {
	const methodID = logItem.topics[0].slice(2);
	const method = this.state.methodIDs[methodID];
	if (!method) return;

	const logData = logItem.data;
	const decodedParams = [];
	let dataIndex = 0;
	let topicsIndex = 1;

	const dataTypes = [];
	method.inputs.map(function (input) {
		if (!input.indexed) {
			dataTypes.push(input.type);
		}
	});

	const decodedData = abiCoder.decodeParameters(
		dataTypes,
		logData.slice(2)
	);

	// Loop topic and data to get the params
	method.inputs.map(function (param) {
		const decodedP = {
			name: param.name,
			type: param.type,
		};

		if (param.indexed) {
			decodedP.value = logItem.topics[topicsIndex];
			topicsIndex++;
		} else {
			decodedP.value = decodedData[dataIndex];
			dataIndex++;
		}

		if (param.type === "address") {
			decodedP.value = decodedP.value.toLowerCase();
			// 42 because len(0x) + 40
			if (decodedP.value.length > 42) {
				const toRemove = decodedP.value.length - 42;
				const temp = decodedP.value.split("");
				temp.splice(2, toRemove);
				decodedP.value = temp.join("");
			}
		}

		if (
			param.type === "uint256" ||
			param.type === "uint8" ||
			param.type === "int"
		) {
			// ensure to remove leading 0x for hex numbers
			if (typeof decodedP.value === "string" && decodedP.value.startsWith("0x")) {
				decodedP.value = new BN(decodedP.value.slice(2), 16).toString(10);
			} else {
				decodedP.value = new BN(decodedP.value).toString(10);
			}

		}

		if (singleKeys) {
			decodedParams[decodedP.name] = decodedP.value;
		} else {
			decodedParams.push(decodedP);
		}

	});

	return {
		name: method.name,
		events: decodedParams,
		address: logItem.address,
	};
}

module.exports.decodeLogs = function (logs, singleKeys) {
	return logs.filter(log => log.topics.length > 0).map((logItem) => {
		return this.decodeLog(logItem, singleKeys);
	});
}
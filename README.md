# abi-parser
NodeJS/JS library for parsing ethereum/web3 logs, events, and methods.

This library is a fork of [abi-decoder](https://github.com/ConsenSys/abi-decoder).

## Installation

### Node

```bash
npm install abi-parser
```

### In the Browser

Use the prebuilt `dist/abi-parser.js`, or build using `npm run build`

```bash
npm run build
```

## Usage Example

```js
const AbiParser = require('abi-parser');
const abiParser = new AbiParser();

// Add the abis
const testABI1 = [{ "inputs": [{ "type": "address", "name": "" }], "constant": true, "name": "isInstantiation", "payable": false, "outputs": [{ "type": "bool", "name": "" }], "type": "function" }, { "inputs": [{ "type": "address[]", "name": "_owners" }, { "type": "uint256", "name": "_required" }, { "type": "uint256", "name": "_dailyLimit" }], "constant": false, "name": "create", "payable": false, "outputs": [{ "type": "address", "name": "wallet" }], "type": "function" }, { "inputs": [{ "type": "address", "name": "" }, { "type": "uint256", "name": "" }], "constant": true, "name": "instantiations", "payable": false, "outputs": [{ "type": "address", "name": "" }], "type": "function" }, { "inputs": [{ "type": "address", "name": "creator" }], "constant": true, "name": "getInstantiationCount", "payable": false, "outputs": [{ "type": "uint256", "name": "" }], "type": "function" }, { "inputs": [{ "indexed": false, "type": "address", "name": "sender" }, { "indexed": false, "type": "address", "name": "instantiation" }], "type": "event", "name": "ContractInstantiation", "anonymous": false }];
const testABI2 = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }];

abiParser.addABI(testABI1);
abiParser.addABI(testABI2);

// Decode an encoded method
const testMethod = "0x53d9d9100000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a6d9c5f7d4de3cef51ad3b7235d79ccc95114de5000000000000000000000000a6d9c5f7d4de3cef51ad3b7235d79ccc95114daa";
const decodedMethod = abiParser.decodeMethod(testMethod, true);
console.log('Decoded Method:', decodedMethod);

//Decode an encoded log
const testLog = { "address": "0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3", "topics": ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "0x000000000000000000000000ff3dd404afba451328de089424c74685bf0a43c9", "0x0000000000000000000000008591aa322b6ce54a781b025a594fcf5b0cc20d22"], "data": "0x000000000000000000000000000000000000000000000000005af314c8ef9900", "blockNumber": 11951393, "transactionHash": "0x7a125d37e18a3f37924970a08f0449a82be1cf15fabdf7631dbdc221330fba41", "transactionIndex": 67, "blockHash": "0x5a0837ffcd732c23974878d70e4e3742299b34e05f1e1e4c14cf12fd5b4431ef", "logIndex": 155, "removed": false, "id": "log_bd721dfd" };
const decodedLog = abiParser.decodeLog(testLog, true);
console.log('Decoded Log:', decodedLog);
```

### Result:
```js
Decoded Method: {
  name: 'create',
  params: [
    _owners: [
      '0xa6d9c5f7d4de3cef51ad3b7235d79ccc95114de5',
      '0xa6d9c5f7d4de3cef51ad3b7235d79ccc95114daa'
    ],
    _required: '1',
    _dailyLimit: '0'
  ]
}

Decoded Log: {
  name: 'Transfer',
  events: [
    from: '0xff3dd404afba451328de089424c74685bf0a43c9',
    to: '0x8591aa322b6ce54a781b025a594fcf5b0cc20d22',
    value: '25600018500000000'
  ],
  address: '0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3'
}
```
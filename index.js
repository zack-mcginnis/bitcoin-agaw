const bitcoin = require('bitcoinjs-lib');
const bip39 = require('bip39');
const xpub = `xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8`;

const hdNode = bitcoin.HDNode.fromBase58(xpub);
console.log(`Generating addresses for pubkey: `+ xpub);

for(let i = 1; i < 10; i++) { 
    const path = '0/'+i;
    const key1 = hdNode.derivePath(path);
    console.log(path + ": "+key1.keyPair.getAddress());
}

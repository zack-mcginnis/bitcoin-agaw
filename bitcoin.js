const bitcoin = require('bitcoinjs-lib');
const bip39 = require('bip39');

class Bitcoin {

    constructor(newXpub) {
        this.setXpub(newXpub);
        this.setHdNode(bitcoin.HDNode.fromBase58(newXpub))
    }

    setXpub(newXpub) {
        this.xpub = newXpub
    }

    setHdNode(newHdNode) {
        this.hdNode = newHdNode
    }

    updatePubKey(newXpub) {
        this.setXpub(newXpub);
        this.setHdNode(bitcoin.HDNode.fromBase58(newXpub))
    }

    generate(n) {
        const path = '0/' + n;
        const key = this.hdNode.derivePath(path);
        console.log(path + ": " + key.keyPair.getAddress());
    }
}

module.exports = Bitcoin;
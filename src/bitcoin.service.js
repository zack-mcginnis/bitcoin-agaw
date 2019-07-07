const bitcoin = require('bitcoinjs-lib');
const listenForBtcPayment = require('./socket.service')

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
        const address = key.keyPair.getAddress()
        console.log(path + ": " + address);
        listenForBtcPayment(address)
        return address;
    }
}

module.exports = Bitcoin;
const bitcoin = require('bitcoinjs-lib');
const WebSocket = require('ws');
const url = `wss://ws.blockchain.info/inv`;

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

const listenForBtcPayment = (address) => {
    const websocket = new WebSocket(url);
    let count = 0;

    websocket.onopen = () => {
        console.log(`Blockchain.info Websocket Connected...`);
        websocket.send(`{"op":"ping"}`);
        websocket.send(`{"op":"addr_sub", "addr":"${address}"}`);
    };

    websocket.onerror = (error) => {
        console.error(`Blockchain.info Websocket error:`);
        console.log(error);
    };

    websocket.onclose = (event) => {
        console.log(`Blockchain.info Websocket closed: `);
        console.log(`Attempting to reconnect in 20 seconds...`);
        count++;
        setTimeout(() => {
            reconnectOne(address, count);
        }, 20000);
    };

    websocket.onmessage = (event) => {
        console.log(`Blockchain.info Websocket Message received `);
        // console.log(event.data)
        const data = JSON.parse(event.data);
        console.log(`${JSON.stringify(data)}`);
        if (data.op == 'utx') {
            console.log(`New payment received at address: ${address}.  ***  `);
            // alert client about receipt of payment
            alertClientOfReceipt(address, data.x);
            // close websocket connection
            websocket.send(`{"op":"addr_unsub", "addr":"${address}"}`);
        }
    };
};

const alertClientOfReceipt = async(address, { time, vout_sz, out }) => {
    //console.log(`sending txn data to client : ${address}, ${time}, ${vout_sz}, ${JSON.stringify(out)}`);
    console.log(`returning address and txn data`)
    return { address, time, vout_sz, out }
};

const reconnectOne = async(address, count) => {
    console.log(`In reconnecting after unexpected WS disconnect`);

    if (count > 50) {
        console.error(`Number of WS retries has been exceeded ( ${count} > 50)`);
        return Error(`Number of WS retries has been exceeded ( ${count} > 50)`);
    }
    const websocket = new WebSocket(url);

    websocket.onopen = () => {
        console.log(`Blockchain.info Websocket Connected (count = ${count})...`);
        websocket.send(`{"op":"ping"}`);
        websocket.send(`{"op":"addr_sub", "addr":"${address}"}`);
    };

    websocket.onerror = (error) => {
        console.error(`Blockchain.info Websocket error:`);
        console.log(error);
    };

    websocket.onclose = (event) => {
        console.log(`Blockchain.info Websocket closed: `);
        console.log(`Attempting to reconnect in 10 seconds...`);
        // console.log(`${JSON.stringify(event)}`);
        // console.log(event);
        count++;
        // attempt WS reconnect after 20sec
        setTimeout(() => {
            reconnectOne(address, count);
        }, 20000);
    };

    websocket.onmessage = (event) => {
        console.log(`Blockchain.info Websocket Message received `);
        // console.log(event.data)
        const data = JSON.parse(event.data);
        console.log(`${JSON.stringify(data)}`);
        if (data.op == 'utx') {
            console.log(`New payment received at address: ${address}.  ***  `);
            // alert client about receipt of payment
            alertClientOfReceipt(address, data.x);
            // close websocket connection
            websocket.send(`{"op":"addr_unsub", "addr":"${address}"}`);
        }
    };
    console.log(`reconnected previous connection...`);
};

module.exports = Bitcoin;
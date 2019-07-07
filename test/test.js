const Bitcoin = require(`../src/bitcoin.service`)
const expect = require("chai").expect;

describe("Address generation", () => {
    describe("With valid xpub", () => {
        it("should generate 2 addresses", () => {

            const btc = new Bitcoin(`xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8`)
            let count = 1

            const address1 = btc.generate(count++)
            const address2 = btc.generate(count++)

            expect(address1).to.not.equal(address2);
        });
    });
});
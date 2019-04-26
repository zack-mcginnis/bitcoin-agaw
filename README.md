# bitcoin-agaw
JS module for bitcoin address generation and watching (agaw)
- Can be used by server or client

## step 1
- The xPubkey of your wallet must be passed in to the constructor of `bitcoin-agaw`

## step 2
- Whenever your code needs a fresh bitcoin address, you can call the `generate` method, and a new address will be returned
    - The generate method must receive an integer greater than `0`.  This integer will be used to derive a new key pair, which is then used to generate a new address.
    - If you are a merchant expecting to receive payments from customers, you should be storing this address along with the `userId` (or some other identifier) of the expected customer.
    - You must keep track of which integers you have used to generate your addresses.
        - It may make sense to store this in your DB somewhere
            - (e.g. increment the integer by one everytime you call `generate()`)


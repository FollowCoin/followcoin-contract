# Follow Coin v2

## Getting started

Install the Truffle if havent yet, run:
```sh
# npm install -g truffle
# npm install -g ethereumjs-testrpc
```

Install the OpenZeppelin library, run:
```sh
# npm install zeppelin-solidity
# npm install chai
# npm install chai-as-promised
# npm install chai-bignumber
```

Compile
```sh
# truffle compile
```

Run tests
```sh
# truffle test
```

## Deploy

To deploy manually can use truffle-flattener
```sh
# truffle-flattener contracts/FollowCoin.sol
```


# Follow Coin Contract

## FLLW Token Sale Details

Token Sale start date: 27th Oct 16:00 UTC 1509120000

Token Sale latest closing data: 24th Nov 16:00:00 UTC 1511539200

Duration: 28 days (4 weeks)

Min Cap: 0 ETH 

Max Cap: 49,000 ETH

Rate: 10000 FLLW per 1 ETH

Total supply: 1 billion (1,000,000,000) 

Sold during ICO: 49% (490,000,000)

Retained by team: 33% (330,000,000)

Platform maintenance: 18% (18,000,000)

Max purchase per wallet during token sale: 1000 ETH

FLLW tokens purchased during the token sale will be sent directly to the purchasing wallet address. All tokens will be locked until 21 days after the closing of the Token Sale.

The contracts were externally reviewed and tested by Yshurik, Bitcoinbrisbane and Skygate. Reviews can be found here:
[FollowCoin contracts audit report 01-05.02.2018](audit.md)
https://gist.github.com/yshurik/521ec2bcbf5ca397367bcc297b85a921
https://github.com/bitcoinbrisbane/followcoin-contract/blob/master/notes.md



## Local testing 

### start testrpc

npm install

```
testrpc --account="0x401c856b9b2b12334d391ebc9499857cc42e99acd089585fd916b19dab11c1fd, 100000000000000000000000000000000" --unlock 0 --account="0xc6bd287de65a06f3d428f7fd4d034bcb7301ab43fd9f71cecb2de0d106d9294d, 100000000000000000000000000000000" --unlock 1 --account="0x5de9870a557d0d7b991ea310a526f2bc368f987c90d86ec1a389636ffd5c1948, 100000000000000000000000000000000" --unlock 2 --account="0xc85fb67429a7183aa08bba6d8dd1460f8eaa04a37c3114bcf28422d211f3f7cc, 100000000000000000000000000000000" --unlock 3 --account="0xdd0eca4831c4d705f95f2eefb805025a75466460bed47c0a63d7761fc1aad06e, 100000000000000000000000000000000" --unlock 4 --gasPrice 0 --debug
```

## Truffle tests
Note:  Must upgrade 

## .net core tests
Download the 2.0 sdk
```
cd into \coretests
dotnet restore
dotnet test
```

### Ropsten network testing

```
geth --fast --cache=1048 --testnet --unlock "[your_ropsten_address]" --rpc --rpcapi "eth,net,web3" --rpccorsdomain '*' --rpcaddr localhost --rpcport 8545

truffle deploy --network ropsten
```

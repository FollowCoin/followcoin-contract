# FollowCoin PRE ICO

## FLLW Pre Sale Details

Pre-ICO date: 27th Oct 12:00 GMT 1509105600

Duration: 4 weeks
Min Cap: 0 ETH 

Max Cap: 330 000 000 ETH

Amount of tokens: 330 000 000 FLLW (33% from total 1 000 000 000 supply)

Rate: 7777 FLLW per 1 ETH

Presale FLLW token discount: 

30% BONUS: 0 - 10% FLLW SOLD

20% BONUS: 10% - 20% FLLW SOLD

10% BONUS: 20% - 70% FLLW SOLD

Max. investment on pre-ICO: 1000 ETH

FLLW tokens sold during pre-ICO and ICO will be automatically sent to investors wallets from which funds are received.


## Local testing 

### start testrpc

npm install

```
testrpc --account="0x401c856b9b2b12334d391ebc9499857cc42e99acd089585fd916b19dab11c1fd, 100000000000000000000000000000000" --unlock 0 --account="0xc6bd287de65a06f3d428f7fd4d034bcb7301ab43fd9f71cecb2de0d106d9294d, 100000000000000000000000000000000" --unlock 1 --account="0x5de9870a557d0d7b991ea310a526f2bc368f987c90d86ec1a389636ffd5c1948, 100000000000000000000000000000000" --unlock 2 --account="0xc85fb67429a7183aa08bba6d8dd1460f8eaa04a37c3114bcf28422d211f3f7cc, 100000000000000000000000000000000" --unlock 3 --account="0xdd0eca4831c4d705f95f2eefb805025a75466460bed47c0a63d7761fc1aad06e, 100000000000000000000000000000000" --unlock 4 --gasPrice 0 --debug
```

## Truffle tests
Note, issues with assertJump

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
<<<<<<< HEAD
```
=======

## Notes recommendations

Buy function, and a fall back function
>>>>>>> f73851070d69de5b8adb8a0444b107a34fb808b1

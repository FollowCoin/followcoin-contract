/// utility methods
const writeValue = (elementId, value) => document.getElementById(elementId).textContent = value;
const toEthString = wei => wei / 10**18 + ' ETH';
const toFlwwString = wei => wei / 10**18 + ' FLLW';
const hexSecondsToMillis = hexSeconds => web3.toBigNumber(hexSeconds).toNumber() * 1000;

/// constants
const abi = [
    {
      "constant": true,
      "inputs": [],
      "name": "deadline",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "beneficiary",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        }
      ],
      "name": "getTokenBalance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "tokens",
          "type": "uint256"
        }
      ],
      "name": "setSold",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "tokensSold",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "halt",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "tokenReward",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "amountRaised",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalTokens",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "softCap",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "tokens",
          "type": "uint256"
        }
      ],
      "name": "calculateTokenAmount",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "halted",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "tokenLimitPerWallet",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "unhalt",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "investorCount",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "MAX_GAS_PRICE",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "startTimestamp",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "tokensPerEther",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "hardCap",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "type": "constructor"
    },
    {
      "payable": true,
      "type": "fallback"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "_beneficiary",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "_amountRaised",
          "type": "uint256"
        }
      ],
      "name": "GoalReached",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "backer",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "isContribution",
          "type": "bool"
        }
      ],
      "name": "FundTransfer",
      "type": "event"
    }
  ];
const targetApi = 'https://rinkeby.infura.io/';
const contractAddress = '0xCf50C78D098811f02cb069fD8a09f508D1CaC58d';

/// getting contract
const web3 = new Web3(new Web3.providers.HttpProvider(targetApi));
const espeoTokenIco = web3.eth.contract(abi).at(contractAddress);

/// read and display values
writeValue('contractAddress', contractAddress);
writeValue('totalRaised', toEthString(espeoTokenIco.amountRaised()));

const startDate = hexSecondsToMillis(espeoTokenIco.startTimestamp());
const endDate = hexSecondsToMillis(espeoTokenIco.deadline());
writeValue('startDate', new Date(startDate).toLocaleString());
writeValue('endDate', new Date(endDate).toLocaleString());

writeValue('maxCap', toFlwwString(espeoTokenIco.hardCap()));
writeValue('tokensPerEther', espeoTokenIco.tokensPerEther()+' FLLW');
writeValue('investorCount', espeoTokenIco.investorCount());
writeValue('tokenLimitPerWallet', toEthString(espeoTokenIco.tokenLimitPerWallet()));

writeValue('totalSupply', toFlwwString(espeoTokenIco.totalTokens()));
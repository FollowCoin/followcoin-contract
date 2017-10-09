var FollowCoin = artifacts.require("./FollowCoin.sol");
var FollowCoinTokenSale = artifacts.require("./FollowCoinTokenSale.sol");

module.exports = function(deployer) {
  const initialSupply = web3.toWei(1000000000, "ether")
  const tokenName = 'Follow Coin';
  const decimalUnits = 18;
  const tokenSymbol = 'FLLW';
  deployer.deploy(FollowCoin, initialSupply, tokenName, decimalUnits, tokenSymbol).then(function() {
    const hardCap = web3.toWei(330000000, "ether");
    const softCap = 0;
    const token = FollowCoin.address;
    const totalTokens = web3.toWei(330000000, "ether");
    const limitPerWallet = web3.toWei(1000, "ether"); //in Ether
    const beneficiary = web3.eth.accounts[0];
    const startTimestamp =  web3.eth.getBlock(web3.eth.blockNumber).timestamp;
    const durationTime = 28; //4 weeks
    const tokensPerEther = 7777;
    deployer.deploy(FollowCoinTokenSale, beneficiary, limitPerWallet, hardCap, softCap, startTimestamp,  durationTime, totalTokens, tokensPerEther, token);
  });
};
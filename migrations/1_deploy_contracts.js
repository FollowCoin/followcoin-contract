var Factory = artifacts.require("./FollowCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(FollowCoin);
};

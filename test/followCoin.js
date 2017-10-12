const FollowCoin = artifacts.require("FollowCoin");
//const assertJump = require("zeppelin-solidity/test/helpers/assertJump.js");
//const assertJump = require("./assertJump.js");

const initialSupply = web3.toWei(1000000000, "ether")
const tokenName = 'Follow Coin';
const decimalUnits = 18;
const tokenSymbol = 'FLLW';

contract('Follow Coin Token', function(accounts) {
  beforeEach(async function () {
    this.token = await FollowCoin.new(initialSupply, tokenName, decimalUnits, tokenSymbol);
  });

  it("should put 1 000,000,000 FLLW to supply and in the first account", async function () {
    const balance = await this.token.balanceOf(accounts[0]);
    const supply = await this.token.totalSupply();

    assert.equal(balance.valueOf(), 1000000000 * 10 ** 18, "First account (owner) balance must be 1000000000");
    assert.equal(supply.valueOf(), 1000000000 * 10 ** 18, "Supply must be 1000000000");
  });

  it("should allow to burn by owner", async function() {
    
    await this.token.burn(web3.toWei(100, "ether"));

    const balance = await this.token.balanceOf(accounts[0]).valueOf();
    var num = (1000000000 - 100) * 10 ** 18;
    assert.equal(balance, num);

    const supply = await this.token.totalSupply().valueOf();
    assert.equal(supply, num);
  });
});
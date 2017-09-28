const FollowCoin = artifacts.require("FollowCoin");
const assertJump = require("zeppelin-solidity/test/helpers/assertJump.js");

const initialSupply = web3.toWei(1000000000, "ether")
const tokenName = 'Follow Coin';
const decimalUnits = 18;
const tokenSymbol = 'FLLW';

contract('Follow Coin Token', function(accounts) {
  beforeEach(async function () {
    this.token = await FollowCoin.new(accounts[0], initialSupply, tokenName, decimalUnits, tokenSymbol);
  });

  it("should put 1 000,000,000 FLLW to supply and in the first account", async function () {
    const balance = await this.token.balanceOf(accounts[0]);
    const supply = await this.token.totalSupply();
    assert.equal(balance.valueOf(), 1000000000 * 10 ** 18, "First account (owner) balance must be 1000000000");
    assert.equal(supply.valueOf(), 1000000000 * 10 ** 18, "Supply must be 1000000000");
  });

  it("should allow to mint by owner", async function() {
    
    await this.token.mint(web3.toWei(100, "ether"));

    const balance = await this.token.balanceOf(accounts[0]).valueOf();
    var num = (1000000000 + 100) * 10 ** 18;
    assert.equal(balance, num);

    const supply = await this.token.totalSupply().valueOf();
    assert.equal(supply, num);
  });

  it("should allow to mintFrom by owner", async function() {
    await this.token.mintFrom(accounts[2], web3.toWei(100, "ether"));

    const balance = await this.token.balanceOf(accounts[2]).valueOf();
    var num = 100 * 10 ** 18;
    
    assert.equal(balance, num);
    const supply = await this.token.totalSupply().valueOf();
    assert.equal(supply, 1000000100 * 10 ** 18);
  });

  it("should not allow to mint by not owner", async function() {    
    try {
      await this.token.mint(web3.toWei(100, "ether"), {from: accounts[1]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it("should not allow to mintFrom by not owner", async function() {  
    await this.token.transfer(accounts[2], 100 * 10 ** 18);  
    try {
      await this.token.mintFrom(accounts[2],web3.toWei(100, "ether"), {from: accounts[1]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it("should allow to burn by owner", async function() {
    
    await this.token.burn(web3.toWei(100, "ether"));

    const balance = await this.token.balanceOf(accounts[0]).valueOf();
    var num = (1000000000 - 100) * 10 ** 18;
    assert.equal(balance, num);

    const supply = await this.token.totalSupply().valueOf();
    assert.equal(supply, num);
  });

  it("should not allow to burn by not owner", async function() {
    await this.token.transfer(accounts[1], 1000000 * 10 ** 18);

    try {
      await this.token.burn(1000000 * 10 ** 18, {from: accounts[1]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it("should not allow to burn more than balance", async function() {
    try {
      await this.token.burn(1000000001 * 10 ** 18);
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it("should allow to burnFrom by owner", async function() {
    await this.token.transfer(accounts[1], 1000000 * 10 ** 18);
    await this.token.burnFrom(accounts[1], 500000 * 10 ** 18, {from: accounts[0]});

    const balance = await this.token.balanceOf(accounts[1]).valueOf();
    assert.equal(balance, 500000 * 10 ** 18);

    const supply = await this.token.totalSupply().valueOf();
    assert.equal(supply, 999500000 * 10 ** 18);
  });

  it("should not allow to burnFrom by not owner", async function() {
    await this.token.transfer(accounts[1], 1000000 * 10 ** 18);
    
    try {
      await this.token.burnFrom(accounts[1], 500000 * 10 ** 18, {from: accounts[2]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it("should not allow to burn from more than balance", async function() {
    await this.token.transfer(accounts[1], 500000 * 10 ** 18);
    
    try {
      await this.token.burnFrom(accounts[1], 500001 * 10 ** 18);
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });
});
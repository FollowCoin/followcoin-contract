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

  it("should have set token name", async function () {
    const actual = await this.token.name();
    assert.equal(actual, tokenName, "token name has wrong value");
  });

  it("should have set token symbol", async function () {
    const actual = await this.token.symbol();
    assert.equal(actual, tokenSymbol, "token symbole has wrong value");
  });

  it("should have contributorsLockdown set to true", async function () {
    const lockdown = await this.token.contributorsLockdown();
    assert.equal(lockdown, 1, "contributorsLockdown has wrong initial value");
  });

  it("should put 1 000,000,000 FLLW to supply and in the first account", async function () {
    const balance = await this.token.balanceOf(accounts[0]);
    const supply = await this.token.totalSupply();
    assert.equal(balance.valueOf(), 1000000000 * 10 ** 18, "First account (owner) balance must be 1000000000");
    assert.equal(supply.valueOf(), 1000000000 * 10 ** 18, "Supply must be 1000000000");
  });

  it('should not allow to transferFrom from not approved (lockdown is on)', async function () {
    await this.token.transfer(accounts[2], 10 * 10 ** 18);  
    try {
      await this.token.transferFrom(accounts[2], accounts[1], 2 * 10 ** 18);
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it('should not allow to transferFrom from approved (lockdown is on)', async function () {
    await this.token.transfer(accounts[2], 10 * 10 ** 18);  
    try {
      await this.token.transferFrom(accounts[2], accounts[1], 2 * 10 ** 18);
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it('should not allow to transferFrom from not approved (lockdown is off)', async function () {
    await this.token.disableLockDown();
    await this.token.transfer(accounts[2], 10 * 10 ** 18);  
    try {
      await this.token.transferFrom(accounts[2], accounts[1], 2 * 10 ** 18);
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it('should allow to transferFrom from approved account (lockdown is off)', async function () {
    await this.token.disableLockDown();
    await this.token.transfer(accounts[1], 10 * 10 ** 18);  
    const balance = await this.token.balanceOf(accounts[1]);
    await this.token.approve(accounts[2], 2 * 10 ** 18, {from: accounts[1]});

    await this.token.transferFrom(accounts[1], accounts[2], 2 * 10 ** 18, {from: accounts[2]});
    const balance2 = await this.token.balanceOf(accounts[1]);
 
    assert.equal(balance - 2 * 10 ** 18, balance2);
  });

  it("should allow to mint by owner", async function() {
    
    await this.token.mint(web3.toWei(100, "ether"));

    const balance = await this.token.balanceOf(accounts[0]).valueOf();
    var num = (1000000000 + 100) * 10 ** 18;
    assert.equal(balance, num);

    const supply = await this.token.totalSupply().valueOf();
    assert.equal(supply, num);
  });

  it("should not allow to mint by not owner", async function() {    
    try {
      await this.token.mint(web3.toWei(100, "ether"), {from: accounts[1]});
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
});
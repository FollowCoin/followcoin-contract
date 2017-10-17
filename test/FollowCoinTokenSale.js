const FollowCoin = artifacts.require("FollowCoin");
const FollowCoinPreSale = artifacts.require("FollowCoinTokenSale");
const assertJump = require("zeppelin-solidity/test/helpers/assertJump.js");


const initialSupply = web3.toWei(1000000000, "ether")
const tokenName = 'Follow Coin';
const decimalUnits = 18;
const tokenSymbol = 'FLLW';
const hardCap = web3.toWei(330000000, "ether");
const softCap = 0;
const totalTokens = web3.toWei(330000000, "ether");
const limitPerWallet = web3.toWei(1000, "ether"); //in Ether
const beneficiary = web3.eth.accounts[0];
const startTimestamp =  web3.eth.getBlock(web3.eth.blockNumber).timestamp;
const durationTime = 28; //4 weeks
const tokensPerEther = 7777;
const crowdsaleTotal =380000000;

const timeController = (() => {

  const addSeconds = (seconds) => new Promise((resolve, reject) =>
    web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [seconds],
      id: new Date().getTime()
    }, (error, result) => error ? reject(error) : resolve(result.result)));

  const addDays = (days) => addSeconds(days * 24 * 60 * 60);

  const currentTimestamp = () => web3.eth.getBlock(web3.eth.blockNumber).timestamp;

  return {
    addSeconds,
    addDays,
    currentTimestamp
  };
})();

async function advanceToBlock(number) {
  await timeController.addDays(number);
}

contract('Follow Coin ICO', function (accounts) {
  beforeEach(async function () {
    this.token = await FollowCoin.new(accounts[0],initialSupply, tokenName, decimalUnits, tokenSymbol);
    const token = this.token.address;

    this.crowdsale = await FollowCoinPreSale.new(accounts[0], limitPerWallet, hardCap, softCap, startTimestamp,  durationTime, totalTokens, tokensPerEther, token);
    
    //transfer more than totalTokens to test hardcap reach properly
    this.token.allowAccount(this.crowdsale.address, 1);

    //this.token.approve(this.crowdsale.address, web3.toWei(crowdsaleTotal, "ether"), {from: accounts[0]});
    this.token.transfer(this.crowdsale.address, web3.toWei(crowdsaleTotal, "ether")); //380000000
  });

  it('should allow multisig change by owner', async function () {
    await this.crowdsale.changeMultisigWallet('0xc3a37e0f0f1288c4bf4ab5a5b60957dac0f4dd4c');
    const actual = await this.crowdsale.multisig();
    assert.equal(actual, '0xc3a37e0f0f1288c4bf4ab5a5b60957dac0f4dd4c');
  });

  it('should allow to halt by owner', async function () {
    await this.crowdsale.halt();
    const halted = await this.crowdsale.halted();
    assert.equal(halted, true);
  });

  it('should not allow to halt by not owner', async function () {
    try {
      await this.crowdsale.halt({from: accounts[2]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it('should not allow to halt if already halted', async function () {
    await this.crowdsale.halt();

    try {
      await this.crowdsale.halt();
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it('should allow to unhalt by owner', async function () {
    await this.crowdsale.halt();

    await this.crowdsale.unhalt();
    const halted = await this.crowdsale.halted();

    assert.equal(halted, false);
  });

  it('should not allow to unhalt when not halted', async function () {
    try {
      await this.crowdsale.unhalt();
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it('should not allow to unhalt by not owner', async function () {
    await this.crowdsale.halt();

    try {
      await this.crowdsale.unhalt({from: accounts[2]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it('should send tokens to purchaser', async function () {
    const initialbalance = await this.token.balanceOf(this.crowdsale.address);

    await this.crowdsale.sendTransaction({value: web3.toWei(1, "ether"), from: accounts[2]});

    const balance = await this.token.balanceOf(accounts[2]);
    var pay = tokensPerEther * 1.3 * 10 ** 18;
    assert.equal(balance.valueOf(), pay);

    const crowdsaleBalance = await this.crowdsale.totalTokens();
    var paid = 330000000 - (tokensPerEther * 13 / 10);
    assert.equal(crowdsaleBalance.valueOf(), (paid * 10) * 10 ** 17);
    
    const collected = await this.crowdsale.amountRaised();
    assert.equal(collected.valueOf(), web3.toWei(1, "ether"));

    const investorCount = await this.crowdsale.investorCount();
    assert.equal(investorCount, 1);

    const tokensSold = await this.crowdsale.tokensSold();
    assert.equal(tokensSold.valueOf(), pay);
  });

  it('should allow owner to send out FLLW when lockdown is set', async function () {
    const initialbalance = await this.token.balanceOf(accounts[0]);
    
    await this.token.setLockDown(1, {from: accounts[0]});
    await this.token.transfer(accounts[2], 4 * 10 ** 18, {from: accounts[0]});
    
    const balance = await this.token.balanceOf(accounts[0]);
    var pay = 4 * 10 ** 18;
    assert.equal(balance.valueOf(), initialbalance.valueOf() - pay);
  });

  it('should not allow purchaser to send out FLLW when lockdown is set', async function () {
    await this.token.setLockDown(0, {from: accounts[0]});
    await this.token.transfer(accounts[2], 4 * 10 ** 18, {from: accounts[0]});
    
    const initialbalance = await this.token.balanceOf(accounts[2]);
    var pay = 4 * 10 ** 18;
    assert.equal(initialbalance.valueOf(), pay);

    await this.token.transfer(accounts[1], 1 * 10 ** 18, {from: accounts[2]});
    const balance = await this.token.balanceOf(accounts[2]);
    var pay = 3 * 10 ** 18;
    assert.equal(balance.valueOf(), pay);


    await this.token.setLockDown(1, {from: accounts[0]});
   
    try {
       await this.token.transfer(accounts[1], 1 * 10 ** 18, {from: accounts[2]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it('should not allow purchase when pre sale is halted', async function () {
    await this.crowdsale.halt();

    try {
      await this.crowdsale.sendTransaction({value: 0.11 * 10 ** 18, from: accounts[2]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it('should not allow to send less than or 0 ETH', async function () {
    try {
      await this.crowdsale.sendTransaction({value: 0 * 10 ** 18, from: accounts[2]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it('should be sold with +30% bonus if totalSold <=10%', async function () {
      await this.crowdsale.sendTransaction({value: web3.toWei(1, 'ether'), from: accounts[2]});
      var num = tokensPerEther * 1.3 * 10 ** 18;
      const balance = await this.token.balanceOf(accounts[2]).valueOf();
      assert.equal(balance, num, 'Buyer one token balance mismatch');
  });

  it('should be sold with +20% bonus if totalSold 10%, 20%', async function () {
    var _totalTokens = 0.15 * 330000000 * 10 ** 18;
    await this.crowdsale.setSold(_totalTokens);

    await this.crowdsale.sendTransaction({value: web3.toWei(1, 'ether'), from: accounts[2]});
    var num = (tokensPerEther * 12 / 100) * 10 ** 19;
    const balance = await this.token.balanceOf(accounts[2]).valueOf();
    assert.equal(balance.toNumber(), num, 'Buyer one token balance mismatch');
  });

  it('should be sold with +10% bonus if totalSold 20%, 70%', async function () {
    var _totalTokens = 0.30 * 330000000 * 10 ** 18;
    await this.crowdsale.setSold(_totalTokens);

    await this.crowdsale.sendTransaction({value: web3.toWei(1, 'ether'), from: accounts[2]});
    var num = (tokensPerEther * 11 / 100) * 10 ** 19;

    const balance = await this.token.balanceOf(accounts[2]).valueOf();
  
    assert.equal(balance.toNumber(), num, 'Buyer one token balance mismatch');
  });

  it('should not allow to exceed purchase limit with '+(limitPerWallet / 10 ** 18)+' ETH purchases', async function () {

    await this.crowdsale.sendTransaction({value: limitPerWallet, from: accounts[2]});

    try {
      await this.crowdsale.sendTransaction({value: 1 * 10 ** 18, from: accounts[2]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });


  it('should not allow to exceed hard cap', async function () {
    await this.crowdsale.setSold(crowdsaleTotal * 10 ** 18);
    
    try {
      await this.crowdsale.sendTransaction({value: web3.toWei(2, 'ether'), from: accounts[4]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it('should not allow purchase if pre sale is ended', async function () {
    advanceToBlock(durationTime+1);

    try {
      await this.crowdsale.sendTransaction({value: 0.1 * 10 ** 18, from: accounts[2]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it('should allow send FLLW back to the wallet', async function () {
    await this.crowdsale.sendTokensBackToWallet(crowdsaleTotal * 10 ** 18);
    const balance = await this.token.balanceOf(this.crowdsale.address);
    assert.equal(balance.toNumber(), 0, 'Incorrect balance');
  });
});

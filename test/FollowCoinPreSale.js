const FollowCoin = artifacts.require("FollowCoin");
const FollowCoinPreSale = artifacts.require("FollowCoinPreSale");
const assertJump = require("zeppelin-solidity/test/helpers/assertJump.js");


const initialSupply = web3.toWei(10000000, "ether")
const tokenName = 'Follow Coin';
const decimalUnits = 18;
const tokenSymbol = 'FLLW';
const hardCap = web3.toWei(50, "ether");
const softCap = 0;
const totalTokens = web3.toWei(100000, "ether");
const limitPerWallet = web3.toWei(50, "ether"); //in Ether
const beneficiary = web3.eth.accounts[0];
const startTimestamp =  web3.eth.getBlock(web3.eth.blockNumber).timestamp;
const durationTime = 28; //4 weeks
const tokensPerEther = 7777;

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
  await timeController.addSeconds(number);
}

contract('Follow Coin ICO', function (accounts) {
  beforeEach(async function () {


    this.token = await FollowCoin.new(initialSupply, tokenName, decimalUnits, tokenSymbol);
    const token = this.token.address;

    this.crowdsale = await FollowCoinPreSale.new(beneficiary, limitPerWallet, hardCap, softCap, startTimestamp,  durationTime, totalTokens, tokensPerEther, token);
    
    //transfer more than totalTokens to test hardcap reach properly
    this.token.transfer(this.crowdsale.address, web3.toWei(500000, "ether")); //380 0000
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

  // it('should send tokens to purchaser', async function () {
  //   const initialbalance = await this.token.balanceOf(this.crowdsale.address);

  //   await this.crowdsale.sendTransaction({value: web3.toWei(1, "ether"), from: accounts[2]});

  //   const balance = await this.token.balanceOf(accounts[2]);
  //   var pay = tokensPerEther * 1.3 * 10 ** 18;
  //   assert.equal(balance.valueOf(), pay);

  //   const crowdsaleBalance = await this.token.balanceOf(this.crowdsale.address);
  //   assert.equal(crowdsaleBalance.valueOf(), initialbalance.valueOf() - pay);

  //   const collected = await this.crowdsale.collected();
  //   assert.equal(collected.valueOf(), web3.toWei(1, "ether"));

  //   const investorCount = await this.crowdsale.investorCount();
  //   assert.equal(investorCount, 1);

  //   const tokensSold = await this.crowdsale.tokensSold();
  //   assert.equal(tokensSold.valueOf(), pay);
  // });
/*
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
      var pay = web3.toWei(1);

      await this.crowdsale.sendTransaction({value: pay, from: accounts[2]});
      var num = (tokensPerEther * pay) * 1.3;
      const balance = await this.token.balanceOf(accounts[2]).valueOf();
      assert.equal(balance, num, 'Buyer one token balance mismatch');
  });

  it('should be sold with +20% bonus if totalSold 10%, 20%', async function () {
    var pay = web3.toWei(((0.13 * totalTokens) / followCoinPerEth).toPrecision(2));
    await this.crowdsale.sendTransaction({value: pay, from: accounts[2]});
    await this.crowdsale.sendTransaction({value: web3.toWei(1, 'ether'), from: accounts[3]});
    var num = followCoinPerEth * 1.2 * 10 ** 18;
    const balance = await this.token.balanceOf(accounts[3]).valueOf();
    assert.equal(balance.toPrecision(5), num.toPrecision(5), 'Buyer token balance mismatch');
  });

  it('should be sold with +10% bonus if totalSold 20%, 70%', async function () {
    var pay = web3.toWei(((0.35 * totalTokens) / followCoinPerEth).toPrecision(2));
    await this.crowdsale.sendTransaction({value: pay, from: accounts[2]});
    await this.crowdsale.sendTransaction({value: web3.toWei(1, 'ether'), from: accounts[3]});
    var num = followCoinPerEth * web3.toWei(1, 'ether') * 1.1;
    const balance = await this.token.balanceOf(accounts[3]).valueOf();

    assert.equal(balance, num, 'Buyer token balance mismatch');
  });

  // it('should not allow to exceed purchase limit with '+(limit / 10 ** 18)+' ETH purchases', async function () {

  //   await this.crowdsale.sendTransaction({value: limit, from: accounts[2]});


  //   try {
  //     await this.crowdsale.sendTransaction({value: 1 * 10 ** 18, from: accounts[2]});
  //   } catch (error) {
  //     console.log(error);
  //     return assertJump(error);
  //   }
  //   assert.fail('should have thrown before');
  // });

  it('should set flag "softCapReached" when softcap is reached', async function () {
    await this.crowdsale.sendTransaction({value: softCap, from: accounts[1]});
    await this.crowdsale.sendTransaction({value: web3.toWei(1, 'ether'), from: accounts[2]});

    const softCapReached = await this.crowdsale.softCapReached();
    assert.equal(softCapReached, true);
  });

  // TOO BIG TRANSACTION
  // it('should not allow to exceed hard cap', async function () {
  //   await this.crowdsale.sendTransaction({value: limit, from: accounts[1]});
  //   await this.crowdsale.sendTransaction({value: limit, from: accounts[2]});
  //   await this.crowdsale.sendTransaction({value: limit, from: accounts[3]});

  //   try {
  //     await this.crowdsale.sendTransaction({value: web3.toWei(2, 'ether'), from: accounts[4]});
  //   } catch (error) {
  //     return assertJump(error);
  //   }
  //   assert.fail('should have thrown before');
  // });

  it('should allow withdraw only for owner', async function () {
    try {
      await this.crowdsale.withdraw({from: accounts[1]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  // SOFT CAP IS 0
  // it('should not allow withdraw when softcap is not reached', async function () {
  //   await this.crowdsale.sendTransaction({value: softCap - 0.1 * 10 ** 18, from: accounts[1]});

  //   try {
  //     await this.crowdsale.withdraw();
  //   } catch (error) {
  //     return assertJump(error);
  //   }
  //   assert.fail('should have thrown before');
  // });
  /*
  it('should withdraw - send all not distributed tokens and collected ETH to beneficiary', async function () {
    await this.crowdsale.sendTransaction({value: 1 * 10 ** 18, from: accounts[1]});
    await this.crowdsale.sendTransaction({value: 1 * 10 ** 18, from: accounts[2]});

    const oldBenBalanceEth = web3.eth.getBalance(beneficiary);
    const oldBenBalanceJcr = await this.token.balanceOf(beneficiary).valueOf();

    await this.crowdsale.withdraw();

    const newBenBalanceEth = web3.eth.getBalance(beneficiary);
    const newBenBalanceJcr = await this.token.balanceOf(beneficiary).valueOf();
    const preSaleContractBalanceJcr = await this.token.balanceOf(this.crowdsale.address).valueOf();
    const preSaleContractBalanceEth = web3.eth.getBalance(this.crowdsale.address);

    assert.equal(newBenBalanceEth > oldBenBalanceEth, true);
    assert.equal(newBenBalanceJcr > oldBenBalanceJcr, true);
    assert.equal(preSaleContractBalanceJcr, 0);
    assert.equal(preSaleContractBalanceEth, 0);
  });

  it('should not allow purchase if pre sale is ended', async function () {
    advanceToBlock(this.durationTime);

    try {
      await this.crowdsale.sendTransaction({value: 0.1 * 10 ** 18, from: accounts[2]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it('should not allow refund if pre sale is not ended', async function () {
    await this.crowdsale.sendTransaction({value: 1 * 10 ** 18, from: accounts[2]});

    try {
      await this.crowdsale.refund({from: accounts[2]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it('should not allow refund if softCap is reached', async function () {
    await this.crowdsale.sendTransaction({value: softCap, from: accounts[1]});
    await this.crowdsale.sendTransaction({value: 1 * 10 ** 18, from: accounts[3]});

    await advanceToBlock(this.durationTime);

    try {
      await this.crowdsale.refund({from: accounts[2]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });
  
  it('should not allow refund if pre sale is halted', async function () {
    await this.crowdsale.sendTransaction({value: 1 * 10 ** 18, from: accounts[1]});

    await advanceToBlock(this.durationTime);

    await this.crowdsale.halt();

    try {
      await this.crowdsale.refund({from: accounts[1]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it('should refund if softCap is not reached and pre sale is ended', async function () {
    await this.crowdsale.sendTransaction({value: 0.1 * 10 ** 18, from: accounts[2]});

    await advanceToBlock(this.durationTime);

    const balanceBefore = web3.eth.getBalance(accounts[2]);
    await this.crowdsale.refund({from: accounts[2]});

    const balanceAfter = web3.eth.getBalance(accounts[2]);

    assert.equal(balanceAfter > balanceBefore, true);

    const weiRefunded = await this.crowdsale.weiRefunded();
    assert.equal(weiRefunded, 0.1 * 10 ** 18);

    //should not refund 1 more time
    try {
      await this.crowdsale.refund({from: accounts[2]});
    } catch (error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });
  */
});

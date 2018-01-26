'use strict';

var chaiAsPromised = require("chai-as-promised");
var chai = require('chai');
chai.use(chaiAsPromised);

var should = chai.should();
var expect = chai.expect;

var CoinReceiverTest = artifacts.require("./contracts/CoinReceiverTest.sol");
var FollowCoin = artifacts.require('../contracts/FollowCoin.sol');
var FLLWaCoin = artifacts.require("./contracts/FLLWa.sol");
var FLLWcCoin = artifacts.require("./contracts/FLLWc.sol");

const tokenName = 'FollowCoin';
const tokenSymbol = 'FLLW';

function ether(n) {
	return new web3.BigNumber(web3.toWei(n, 'ether'))
}
function coin(n) {
	return new web3.BigNumber(web3.toWei(n, 'ether'))
}

contract('FollowCoin', function(accounts) {
	let token;

	beforeEach(async function() {
		this.token = await FollowCoin.new();
		this.token2 = await FollowCoin.new();
		this.token3 = await FollowCoin.new();
		this.token_receiver = await CoinReceiverTest.new();
		this.tokenc = await FLLWcCoin.new();
	});

	it("should have set token name", async function() {
		const actual = await this.token.name();
		assert.equal(actual, tokenName, "token name has wrong value");
	});

	it("should have set token symbol", async function() {
		const actual = await this.token.symbol();
		assert.equal(actual, tokenSymbol, "symbol is wrong");
	});

	describe('check the transfers', function() {

		it("should have transfer ok", async function() {
			await this.token.transfer(accounts[1], coin(100));
			const ok1 = await this.token.transfer.call(accounts[1], coin(100));
			await this.token.transfer(accounts[0], coin(100), {from: accounts[1]});
			const b0 = await this.token.balanceOf(accounts[0]);
			const b1 = await this.token.balanceOf(accounts[1]);
			assert.equal(ok1, true, "returns not true");
			assert.equal(b0.valueOf(), coin(1e9).valueOf(), "balance is wrong");
			assert.equal(b1.valueOf(), coin(0).valueOf(), "balance is wrong");
		});

		it("should have transferFrom ok with allowance", async function() {
			await this.token.approve(accounts[1], coin(100));
			await this.token.transferFrom(accounts[0], accounts[2], coin(50), {from: accounts[1]});
			await this.token.transferFrom(accounts[0], accounts[2], coin(40), {from: accounts[1]});
			await this.token.transferFrom(accounts[0], accounts[2], coin(20), {from: accounts[1]}).should.be.rejected;
			await this.token.transferFrom(accounts[0], accounts[2], coin(10), {from: accounts[1]});
			const actual1 = await this.token.balanceOf(accounts[2]);
			assert.equal(actual1.valueOf(), coin(100).valueOf(), "balance is wrong");
		});

		it("should have transferMulti ok", async function() {
			await this.token.transferMulti([accounts[1],accounts[2]], [coin(100),coin(200)]);
			const ret1 = await this.token.transferMulti.call([accounts[1],accounts[2]], [coin(100),coin(200)]);
			const b1 = await this.token.balanceOf(accounts[1]);
			const b2 = await this.token.balanceOf(accounts[2]);
			assert.equal(ret1, "11", "returns not true");
			assert.equal(b1.valueOf(), coin(100).valueOf(), "balance is wrong");
			assert.equal(b2.valueOf(), coin(200).valueOf(), "balance is wrong");
			await this.token.transfer(accounts[0], coin(100), {from: accounts[1]});
			await this.token.transfer(accounts[0], coin(200), {from: accounts[2]});
			const b0 = await this.token.balanceOf(accounts[0]);
			assert.equal(b0.valueOf(), coin(1e9).valueOf(), "balance is wrong");
		});

		it("should have transferMulti partial ok", async function() {
			await this.token.transferMulti([accounts[1],accounts[2]], [coin(100),coin(200)]);
			const ret1 = await this.token.transferMulti.call([accounts[0],accounts[1]], [coin(100),coin(200)], {from: accounts[2]});
			await this.token.transferMulti([accounts[0],accounts[1]], [coin(100),coin(200)], {from: accounts[2]});
			const b1 = await this.token.balanceOf(accounts[1]);
			const b2 = await this.token.balanceOf(accounts[2]);
			assert.equal(ret1, "10", "returns not true");
			assert.equal(b1.valueOf(), coin(100).valueOf(), "balance is wrong");
			assert.equal(b2.valueOf(), coin(100).valueOf(), "balance is wrong");
		});

	});

	it("should not accept ether", async function() {
		await this.token.send(ether(1)).should.be.rejected;
	});

	describe('check the erc223', function() {

		it("should have token transfer to contract ok by default", async function() {
			await this.token.transfer(this.token2.address, coin(100));
			const ok1 = await this.token.transfer.call(this.token2.address, coin(100));
			const b1 = await this.token.balanceOf(this.token2.address);
			assert.equal(ok1, true, "returns not true");
			assert.equal(b1.valueOf(), coin(100).valueOf(), "balance is wrong");
		});

		it("should have token transfer to contract fail after erc223 activated", async function() {
			await this.token.setERC223Activated(true);
			await this.token.transfer(this.token2.address, coin(100)).should.be.rejected;
			await this.token.transfer(accounts[1], coin(100)); // still ok
			await this.token.transfer(accounts[0], coin(100), {from: accounts[1]});
			const b0 = await this.token.balanceOf(accounts[0]);
			assert.equal(b0.valueOf(), coin(1e9).valueOf(), "balance is wrong");
		});

		it("should have token transfer to erc223 receiver contract ok after erc223 activated", async function() {
			await this.token.setERC223Activated(true);
			await this.token.transfer(this.token_receiver.address, coin(200));
			const b0 = await this.token.balanceOf(this.token_receiver.address);
			assert.equal(b0.valueOf(), coin(100).valueOf(), "balance is wrong");
		});

		it("should have token transfer to contract ok after erc223 activated and whitelisted", async function() {
			await this.token.setERC223Activated(true);
			await this.token.setWhiteListContract(this.token2.address, true);
			await this.token.transfer(this.token2.address, coin(100));
			await this.token.transfer(this.token3.address, coin(100)).should.be.rejected;
			const ok1 = await this.token.transfer.call(this.token2.address, coin(100));
			const b1 = await this.token.balanceOf(this.token2.address);
			assert.equal(ok1, true, "returns not true");
			assert.equal(b1.valueOf(), coin(100).valueOf(), "balance is wrong");
		});

		it("should have token transfer to contract ok after erc223 activated and user whitelisted", async function() {
			await this.token.setERC223Activated(true);
			await this.token.setUserWhiteListContract(this.token2.address, true);
			await this.token.transfer(this.token2.address, coin(100));
			await this.token.transfer(this.token3.address, coin(100)).should.be.rejected;
			await this.token.transfer(accounts[1], coin(100));
			await this.token.transfer(this.token2.address, coin(100), {from: accounts[1]}).should.be.rejected;
			const ok1 = await this.token.transfer.call(this.token2.address, coin(100));
			const b1 = await this.token.balanceOf(this.token2.address);
			assert.equal(ok1, true, "returns not true");
			assert.equal(b1.valueOf(), coin(100).valueOf(), "balance is wrong");
		});

	});

	describe('check migration to FLLWc', function() {

		it("should have balances migrated to FLLwc", async function() {
			await this.token.transfer(accounts[1], coin(100));
			await this.token.transfer(accounts[2], coin(200));
			await this.token.transfer(accounts[3], coin(300));
			await this.token.transfer(accounts[4], coin(400));

			await this.token.migrateHolders(100).should.be.rejected;
			await this.token.migrate({from: accounts[3]}).should.be.rejected;

			await this.token.setMigrationAgent(this.tokenc.address);
			await this.tokenc.setMigrationSourceHost(this.token.address);

			await this.token.migrateHolders(2); // owner+account1

			const s1 = await this.token.totalSupply();
			assert.equal(s1.valueOf(), coin(900).valueOf(), "totalSupply is wrong"); // 200+300+400 left

			await this.token.migrate({from: accounts[3]}); // account3 migrate itself

			const s2 = await this.token.totalSupply();
			assert.equal(s2.valueOf(), coin(600).valueOf(), "totalSupply is wrong"); // 200+400 left

			await this.token.migrateHolders(100); // all remaining

			const s3 = await this.token.totalSupply();
			assert.equal(s3.valueOf(), coin(0).valueOf(), "totalSupply is wrong"); // 0 left, migrated

			const s4 = await this.tokenc.totalSupply();
			assert.equal(s4.valueOf(), coin(1e9).valueOf(), "totalSupply is wrong"); // all 1B migrated
		});



	});

});

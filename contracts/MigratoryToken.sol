pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import 'zeppelin-solidity/contracts/ownership/Claimable.sol';

import 'contracts/HoldersToken.sol';
import 'contracts/MigrationAgent.sol';

/*!	Functionality to support migrations to new upgraded contract
	for tokens. Only has effect if migrations are enabled and
	address of new contract is known.
 */
contract MigratoryToken is HoldersToken {
	using SafeMath for uint256;

	//! Address of new contract for possible upgrades
	address public migrationAgent;
	//! Counter to iterate (by portions) through all addresses for migration
	uint256 public migrationCountComplete;

	/*!	Setup the address for new contract (to migrate coins to)
		Can be called only by owner (onlyOwner)
	 */
	function setMigrationAgent(address agent) public onlyOwner {
		migrationAgent = agent;
	}

	/*!	Migrate tokens to the new token contract
		The method can be only called when migration agent is set.

		Can be called by user(holder) that would like to transfer
		coins to new contract immediately.
	 */
	function migrate() public returns (bool) {
		require(migrationAgent != 0x0);
		uint256 value = balances[msg.sender];
		balances[msg.sender] = balances[msg.sender].sub(value);
		totalSupply_ = totalSupply_.sub(value);
		MigrationAgent(migrationAgent).migrateFrom(msg.sender, value);
		// Notify anyone listening that this migration took place
		Migrate(msg.sender, value);
		return true;
	}

	/*!	Migrate holders of tokens to the new contract
		The method can be only called when migration agent is set.

		Can be called only by owner (onlyOwner)
	 */
	function migrateHolders(uint256 count) public onlyOwner returns (bool) {
		require(count > 0);
		require(migrationAgent != 0x0);
		// Calculate bounds for processing
		count = migrationCountComplete + count;
		if (count > holders.length) {
			count = holders.length;
		}
		// Process migration
		for (uint256 i = migrationCountComplete; i < count; i++) {
			address holder = holders[i];
			uint value = balances[holder];
			balances[holder] = balances[holder].sub(value);
			totalSupply_ = totalSupply_.sub(value);
			MigrationAgent(migrationAgent).migrateFrom(holder, value);
			// Notify anyone listening that this migration took place
			Migrate(holder, value);
		}
		migrationCountComplete = count;
		return true;
	}

	event Migrate(address indexed owner, uint256 value);
}

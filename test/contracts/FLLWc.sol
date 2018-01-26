pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';

import '../../contracts/FollowCoin.sol';

contract FLLWc is FollowCoin, MigrationAgent {
	using SafeMath for uint256;

	/*!	Contructor
	 */
	function FLLWc() public {
		name = "FollowCoin v3";
		symbol = "FLLWc";
		decimals = 18;
		totalSupply_ = 0;
		balances[owner] = 0;
	}

	// Migration from:
	address public migrationSourceHost;
	function setMigrationSourceHost(address addr) public onlyOwner {
		migrationSourceHost = addr;
	}

	function migrateFrom(address from, uint256 value) public returns (bool) {
		require(migrationSourceHost == msg.sender);
		// Move balances
		balances[from] = balances[from].add(value);
		// Update the list of holders for new address
		if (isHolder[from] != true) {
			holders[holders.length++] = from;
			isHolder[from] = true;
		}
		totalSupply_ = totalSupply_.add(value);
		return true;
	}
}

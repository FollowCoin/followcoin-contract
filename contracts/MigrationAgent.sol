pragma solidity ^0.4.18;

/*!	Definition of destination interface
	for contract that can be used for migration
 */
contract MigrationAgent {
	function migrateFrom(address from, uint256 value) public returns (bool);
}

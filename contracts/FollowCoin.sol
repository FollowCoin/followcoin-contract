pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import 'contracts/MigratoryToken.sol';
import 'contracts/HoldersToken.sol';

contract FollowCoin is MigratoryToken {
	using SafeMath for uint256;

	//! Token name FollowCoin
	string public name;
	//! Token symbol FLLW
	string public symbol;
	//! Token decimals, 18
	uint8 public decimals;

	/*!	Contructor
	 */
	function FollowCoin() public {
		name = "FollowCoin";
		symbol = "FLLW";
		decimals = 18;
		totalSupply_ = 1000000000*1e18;
		balances[owner] = totalSupply_;
		holders[holders.length++] = owner;
		isHolder[owner] = true;
	}

	/*!	Transfer tokens to multipe destination addresses
		Returns list with appropriate (by index) successful statuses.
		(string with 0 or 1 chars)
	 */
	function transferMulti(address [] _tos, uint256 [] _values) public returns (string) {
		require(_tos.length == _values.length);
		bytes memory return_values = new bytes(_tos.length);

		for (uint256 i = 0; i < _tos.length; i++) {
			address _to = _tos[i];
			uint256 _value = _values[i];
			return_values[i] = byte(48); //'0'

			if (_to != address(0) &&
				_value <= balances[msg.sender]) {

				bool ok = transfer(_to, _value);
				if (ok) {
					return_values[i] = byte(49); //'1'
				}
			}
		}
		return string(return_values);
	}

	/*!	Do not accept incoming ether
	 */
	function() public payable {
		revert();
	}
}

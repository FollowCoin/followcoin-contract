pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
import 'zeppelin-solidity/contracts/ownership/Claimable.sol';

/*!	Test contract to emulate FLLWa
 */
contract FLLWa is StandardToken, Claimable {
	using SafeMath for uint256;

	//! Token name FollowCoin
	string public name;
	//! Token symbol FLLW
	string public symbol;
	//! Token decimals, 18
	uint8 public decimals;

	function FLLWa() public {
		name = "FollowCoin";
		symbol = "FLLWa";
		decimals = 18;
		totalSupply_ = 1000000000*1e18;
		balances[owner] = totalSupply_;
	}

}

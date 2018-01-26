pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';

import 'contracts/ERC223Token.sol';

/*!	Functionality to keep burn for owner.
	Copy from Burnable token but only for owner
 */
contract BurnableToken is ERC223Token {
	using SafeMath for uint256;

	/*! Copy from Burnable token but only for owner */

	event Burn(address indexed burner, uint256 value);

	/**
	 * @dev Burns a specific amount of tokens.
	 * @param _value The amount of token to be burned.
	 */
	function burnTokenBurn(uint256 _value) public onlyOwner {
		require(_value <= balances[msg.sender]);
		// no need to require value <= totalSupply, since that would imply the
		// sender's balance is greater than the totalSupply, which *should* be an assertion failure

		address burner = msg.sender;
		balances[burner] = balances[burner].sub(_value);
		totalSupply_ = totalSupply_.sub(_value);
		Burn(burner, _value);
	}
}

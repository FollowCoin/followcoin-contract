pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';

import 'contracts/BurnableToken.sol';

/*!	Functionality to keep up-to-dated list of all holders.
 */
contract HoldersToken is BurnableToken {
	using SafeMath for uint256;

	/*!	Keep the list of addresses of holders up-to-dated
		It is important to have the list up-to-dated, then
		other contracts can communicate with or to do operations
		with all holders of tokens
	 */
	mapping (address => bool) public isHolder;
	address [] public holders;

	function addHolder(address _addr) internal returns (bool) {
		if (isHolder[_addr] != true) {
			holders[holders.length++] = _addr;
			isHolder[_addr] = true;
			return true;
		}
		return false;
	}

	function transfer(address _to, uint256 _value) public returns (bool) {
		require(_to != address(this)); // Prevent transfer to contract itself
		bool ok = super.transfer(_to, _value);
		addHolder(_to);
		return ok;
	}

	function transfer(address _to, uint256 _value, bytes _data) public returns (bool) {
		require(_to != address(this)); // Prevent transfer to contract itself
		bool ok = super.transfer(_to, _value, _data);
		addHolder(_to);
		return ok;
	}

	function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
		require(_to != address(this)); // Prevent transfer to contract itself
		bool ok = super.transferFrom(_from, _to, _value);
		addHolder(_to);
		return ok;
	}

	function transferFrom(address _from, address _to, uint256 _value, bytes _data) public returns (bool) {
		require(_to != address(this)); // Prevent transfer to contract itself
		bool ok = super.transferFrom(_from, _to, _value, _data);
		addHolder(_to);
		return ok;
	}

}

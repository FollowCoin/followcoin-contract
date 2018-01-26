pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
import 'zeppelin-solidity/contracts/ownership/Claimable.sol';

import 'contracts/ERC223Receiver.sol';

/*!	ERC223 token implementation
 */
contract ERC223Token is StandardToken, Claimable {
	using SafeMath for uint256;

	bool public erc223Activated;

	/*!	Whitelisting addresses of smart contracts which have
		support for working with tokens (wthdrawal most important one)
	 */
	mapping (address => bool) public whiteListContracts;

	/*!	Per user: whitelisting addresses of smart contracts which have
		support for working with tokens (wthdrawal most important one)
	 */
	mapping (address => mapping (address => bool) ) public userWhiteListContracts;

	function setERC223Activated(bool _activate) public onlyOwner {
		erc223Activated = _activate;
	}
	function setWhiteListContract(address _addr, bool f) public onlyOwner {
		whiteListContracts[_addr] = f;
	}
	function setUserWhiteListContract(address _addr, bool f) public {
		userWhiteListContracts[msg.sender][_addr] = f;
	}

	function checkAndInvokeReceiver(address _to, uint256 _value, bytes _data) internal {
		uint codeLength;

		assembly {
			// Retrieve the size of the code
			codeLength := extcodesize(_to)
		}

		if (codeLength>0) {
			ERC223Receiver receiver = ERC223Receiver(_to);
			receiver.tokenFallback(msg.sender, _value, _data);
		}
	}

	function transfer(address _to, uint256 _value) public returns (bool) {
		bool ok = super.transfer(_to, _value);
		if (erc223Activated
			&& whiteListContracts[_to] ==false
			&& userWhiteListContracts[msg.sender][_to] ==false) {
			bytes memory empty;
			checkAndInvokeReceiver(_to, _value, empty);
		}
		return ok;
	}

	function transfer(address _to, uint256 _value, bytes _data) public returns (bool) {
		bool ok = super.transfer(_to, _value);
		if (erc223Activated
			&& whiteListContracts[_to] ==false
			&& userWhiteListContracts[msg.sender][_to] ==false) {
			checkAndInvokeReceiver(_to, _value, _data);
		}
		return ok;
	}

	function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
		bool ok = super.transferFrom(_from, _to, _value);
		if (erc223Activated
			&& whiteListContracts[_to] ==false
			&& userWhiteListContracts[_from][_to] ==false
			&& userWhiteListContracts[msg.sender][_to] ==false) {
			bytes memory empty;
			checkAndInvokeReceiver(_to, _value, empty);
		}
		return ok;
	}

	function transferFrom(address _from, address _to, uint256 _value, bytes _data) public returns (bool) {
		bool ok = super.transferFrom(_from, _to, _value);
		if (erc223Activated
			&& whiteListContracts[_to] ==false
			&& userWhiteListContracts[_from][_to] ==false
			&& userWhiteListContracts[msg.sender][_to] ==false) {
			checkAndInvokeReceiver(_to, _value, _data);
		}
		return ok;
	}

}

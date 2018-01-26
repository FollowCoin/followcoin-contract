pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import '../../contracts/ERC223Receiver.sol';
import '../../contracts/ERC223.sol';

contract CoinReceiverTest is ERC223Receiver {

	function tokenFallback(address _from, uint _value, bytes) public {
		ERC223 coin_contract = ERC223(msg.sender);
		//send half of tokens back to sender
		coin_contract.transfer(_from, _value/2);
	}

}

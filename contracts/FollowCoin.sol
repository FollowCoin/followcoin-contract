pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/token/ERC20Basic.sol';
import 'zeppelin-solidity/contracts/token/StandardToken.sol';
import 'zeppelin-solidity/contracts/lifecycle/Destructible.sol';
import 'zeppelin-solidity/contracts/lifecycle/Pausable.sol';

contract FollowCoin is StandardToken, Destructible, Pausable {
    using SafeMath for uint256;

    string public name = "Follow Coin";
    string public symbol = "FLLW";
    uint256 public decimals = 18;

    uint256 public totalSupply = 5000 * (uint256(10) ** decimals); // 330000000
    uint256 public totalRaised; // total ether raised (in wei)

    uint256 public startTimestamp = 1505938185; //27.10.2017 - 1509105600 // timestamp after which ICO will start
    uint256 public durationSeconds = 4 * 7 * 24 * 60 * 60; // 4 weeks

    uint256 public minCap = 0; // the ICO ether goal (in wei)
    uint256 public maxCap = 10000 ether; // the ICO ether max cap (in wei)

    uint256 public maxCapPerWallet = 3 ether;

    //ETH ammount for account in wei
    mapping (address => uint256) ethbalances;

    /**
     * Address which will receive raised funds 
     * and owns the total supply of tokens
     */
    address public fundsWallet;

    function FollowCoin() {
        fundsWallet = 0x585BCC9308646923737611E9e1588cDCF9020Dd0;

        // initially assign all tokens to the fundsWallet
        balances[fundsWallet] = totalSupply;
        Transfer(0x0, fundsWallet, totalSupply);
    }

    function() isIcoOpen payable {
        totalRaised = totalRaised.add(msg.value);

        uint256 tokenAmount = calculateTokenAmount(msg.value);

        //require(tokenAmount <= balances[fundsWallet]);
        //require(ethbalances[msg.sender] + msg.value <= maxCapPerWallet);

        balances[fundsWallet] = balances[fundsWallet].sub(tokenAmount);
        balances[msg.sender] = balances[msg.sender].add(tokenAmount);
        Transfer(fundsWallet, msg.sender, tokenAmount);

        // immediately transfer ether to fundsWallet
        fundsWallet.transfer(msg.value);
        //ethbalances[msg.sender].add(msg.value);
    }

    function calculateTokenAmount(uint256 weiAmount) constant returns(uint256) {
        // standard rate: 0,00012 ETH : 1 FLLW  = 1/0,00012 ~ 8333
        uint256 tokenAmount = weiAmount.mul(8333);
        uint256 soldTokens = totalRaised.div(balances[fundsWallet]).mul(100);
        
        if(soldTokens <= 10) {
          // + 30%
          return tokenAmount.mul(130).div(100);
        }
        else if(soldTokens <= 20) {
           // + 20%
           return tokenAmount.mul(120).div(100);
        }
        else if(soldTokens <= 70) {
           // + 10%
           return tokenAmount.mul(110).div(100);
        }
        else
        {
          return tokenAmount;
        }
    }

    function transfer(address _to, uint _value) isIcoFinished returns (bool) {
        return super.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint _value) isIcoFinished returns (bool) {
        return super.transferFrom(_from, _to, _value);
    }

    modifier isIcoOpen() {
        require(now >= startTimestamp);
        require(now <= (startTimestamp + durationSeconds) || totalRaised < minCap);
        require(totalRaised <= maxCap);
        _;
    }

    modifier isIcoFinished() {
        require(now >= startTimestamp);
        require(totalRaised >= maxCap || (now >= (startTimestamp + durationSeconds) && totalRaised >= minCap));
        _;
    }
}
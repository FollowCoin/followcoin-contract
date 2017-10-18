pragma solidity ^0.4.13;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {
  function mul(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal constant returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint256 a, uint256 b) internal constant returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() {
    owner = msg.sender;
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }


  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) onlyOwner {
    if (newOwner != address(0)) {
      owner = newOwner;
    }
  }
}

contract FollowCoin is Ownable {
    using SafeMath for uint256;

    // Public variables of the token
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    // This creates an array with all balances
    mapping (address => uint256) public balanceOf;
    mapping (address => bool) public frozenAccount;
    mapping (address => bool) public allowedAccount;
    mapping (address => mapping (address => uint256)) public allowance;
    mapping (address => bool) public isHolder;
    address [] public holders;

    event FrozenFunds(address target, bool frozen);

    event Approval(address indexed owner, address indexed spender, uint256 value);

    // This generates a public event on the blockchain that will notify clients
    event Transfer(address indexed from, address indexed to, uint256 value);

    // This notifies clients about the amount burnt
    event Burn(address indexed from, uint256 value);

    bool public contributorsLockdown = true;

    function setLockDown(bool lock) onlyOwner {
        contributorsLockdown = lock;
    }

    modifier coinsLocked() {
      require(!contributorsLockdown || msg.sender == owner);
      _;
    }

    /**
     * Constructor function
     *
     * Initializes contract with initial supply tokens to the creator of the contract
     */
    function FollowCoin(
        address multiSigWallet,
        uint256 initialSupply,
        string tokenName,
        uint8 decimalUnits,
        string tokenSymbol
    ) {
        owner = multiSigWallet;
        totalSupply = initialSupply;                        // Update total supply
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes
        decimals = decimalUnits;                            // Amount of decimals for display purposes
        balanceOf[owner] = initialSupply;                   // Give the creator all initial tokens
    }

    /**
     * Internal transfer, only can be called by this contract
     */
    function _transfer(address _from, address _to, uint _value) internal {
        require(!contributorsLockdown || _from == owner || allowedAccount[_from]);
        require(_to != 0x0);                               // Prevent transfer to 0x0 address. Use burn() instead

        require(balanceOf[_from] >= _value);                // Check if the sender has enough
        require(balanceOf[_to].add(_value) > balanceOf[_to]); // Check for overflows
        require(!frozenAccount[_from]);                //Check if not frozen
        balanceOf[_from] = balanceOf[_from].sub(_value);                         // Subtract from the sender
        balanceOf[_to] = balanceOf[_to].add(_value);                           // Add the same to the recipient

        if (isHolder[_to] != true) {
            holders[holders.length++] = _to;
            isHolder[_to] = true;
        }
        Transfer(_from, _to, _value);
    }
    
    /**
     * Transfer tokens
     *
     * Send `_value` tokens to `_to` from your account
     *
     * @param _to The address of the recipient
     * @param _value the amount to send
     */

    function transfer(address _to, uint256 _value) public returns (bool)  {
        require(_to != address(this));
        _transfer(msg.sender, _to, _value);
    }

    /**
     * Transfer tokens from other address
     *
     * Send `_value` tokens to `_to` in behalf of `_from`
     *
     * @param _from The address of the sender
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        require(_value <= allowance[_from][msg.sender]);     // Check allowance
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    /**
     * Set allowance for other address
     *
     * Allows `_spender` to spend no more than `_value` tokens in your behalf
     *
     * @param _spender The address authorized to spend
     * @param _value the max amount they can spend
     */
    function approve(address _spender, uint256 _value) public
        returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        return true;
    }


    function allowAccount(address _target, bool allow) onlyOwner returns (bool success) {

         allowedAccount[_target] = allow;
         return true;
    }

    function freezeAccount(address target, bool freeze) onlyOwner {
        frozenAccount[target] = freeze;
        FrozenFunds(target, freeze);
    }

    function mint(uint256 mintedAmount) onlyOwner {
        balanceOf[msg.sender] = balanceOf[msg.sender].add(mintedAmount);
        totalSupply  = totalSupply.add(mintedAmount);
        Transfer(0, owner, mintedAmount);
    }

    /**
     * Destroy tokens
     *
     * Remove `_value` tokens from the system irreversibly
     *
     * @param _value the amount of money to burn
     */
    function burn(uint256 _value) onlyOwner returns (bool success) {
        require(balanceOf[msg.sender] >= _value);   // Check if the sender has enough
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);            // Subtract from the sender
        totalSupply = totalSupply.sub(_value);                      // Updates totalSupply
        Burn(msg.sender, _value);
        return true;
    }
}


/*
 * Haltable
 *
 * Abstract contract that allows children to implement an
 * emergency stop mechanism. Differs from Pausable by requiring a state.
 *
 *
 * Originally envisioned in FirstBlood ICO contract.
 */
 contract Haltable is Ownable {
   bool public halted;

   modifier inNormalState {
     assert(!halted);
     _;
   }

   modifier inEmergencyState {
     assert(halted);
     _;
   }

   // called by the owner on emergency, triggers stopped state
   function halt() external onlyOwner inNormalState {
     halted = true;
   }

   // called by the owner on end of emergency, returns to normal state
   function unhalt() external onlyOwner inEmergencyState {
     halted = false;
   }

 }

contract FollowCoinTokenSale is Haltable {
    using SafeMath for uint256;

    uint256 public constant MAX_GAS_PRICE = 50000000000 wei;

    address public beneficiary;
    address public multisig;
    uint public tokenLimitPerWallet;
    uint public hardCap;
    uint public amountRaised;
    uint public totalTokens;
    uint public tokensSold = 0;
    uint public investorCount = 0;
    uint public startTimestamp;
    uint public deadline;
    uint public tokensPerEther;
    FollowCoin public tokenReward;
    mapping(address => uint256) public balanceOf;

    event FundTransfer(address backer, uint amount, bool isContribution);

    /**
     * Constructor function
     *
     * Setup the owner
     */
    function FollowCoinTokenSale(
        address multiSigWallet,
        uint icoTokensLimitPerWallet,
        uint icoHardCap,
        uint icoSoftCap,
        uint icoStartTimestamp,
        uint durationInDays,
        uint icoTotalTokens,
        uint icoTokensPerEther,
        address addressOfTokenUsedAsReward 
    ) {
        multisig = multiSigWallet;
        owner = multiSigWallet;
        hardCap = icoHardCap;
        deadline = icoStartTimestamp + durationInDays * 1 days;
        startTimestamp = icoStartTimestamp;
        totalTokens = icoTotalTokens;
        tokenLimitPerWallet = icoTokensLimitPerWallet;
        tokensPerEther = icoTokensPerEther;
        tokenReward = FollowCoin(addressOfTokenUsedAsReward);
        beneficiary = tokenReward.owner();
    }

    function changeMultisigWallet(address _multisig) onlyOwner {
        require(_multisig != address(0));
        multisig = _multisig;
    }

    function changeTokenReward(address _token) onlyOwner {
        require(_token != address(0));
        tokenReward = FollowCoin(_token);
        beneficiary = tokenReward.owner();
    }


    /**
     * Fallback function
     *
     * The function without name is the default function that is called whenever anyone sends funds to a contract
     */
    function () payable preSaleActive inNormalState {
        buyTokens();
    }

    function buyTokens() payable preSaleActive inNormalState {
        require(msg.value > 0);
       
        uint amount = msg.value;
        require(balanceOf[msg.sender].add(amount) <= tokenLimitPerWallet);

        uint tokens =  calculateTokenAmount(amount.mul(tokensPerEther));
        require(totalTokens >= tokens);
        require(tokensSold.add(tokens) <= hardCap); // hardCap limit
        
        balanceOf[msg.sender] = balanceOf[msg.sender].add(amount);
        amountRaised = amountRaised.add(amount);

        tokensSold = tokensSold.add(tokens);
        totalTokens = totalTokens.sub(tokens);

        if (tokenReward.balanceOf(msg.sender) == 0) investorCount++;

        tokenReward.transfer(msg.sender, tokens);
        multisig.transfer(amount);
        FundTransfer(msg.sender, amount, true);
    }

    // verifies that the gas price is lower than 50 gwei
    modifier validGasPrice() {
        assert(tx.gasprice <= MAX_GAS_PRICE);
        _;
    }


    modifier preSaleActive() {
      require(now >= startTimestamp);
      require(now < deadline);
      _;
    }

    modifier preSaleEnded() {
      require(now >= deadline);
      _;
    }

    function setSold(uint tokens) onlyOwner {
      tokensSold = tokensSold.add(tokens);
    }


    function sendTokensBackToWallet() onlyOwner {
      totalTokens = 0;
      tokenReward.transfer(multisig, tokenReward.balanceOf(address(this)));
    }

    function getTokenBalance(address _from) constant returns(uint) {
      return tokenReward.balanceOf(_from);
    }

    function getRate(uint tokens, uint bonus) constant returns(uint) {
        return tokens.mul(bonus.add(100)).div(100);
    }

    function calculateTokenAmount(uint256 tokens) constant returns(uint256) {
        uint soldTokens = tokensSold.mul(100).div(totalTokens);

        uint _range10 = totalTokens.mul(10).div(100); //10%
        uint _range20 = totalTokens.mul(20).div(100); //20%
        uint _range70 = totalTokens.mul(70).div(100); //70%

       
        uint _tokens10 = 0;
        uint _tokens20 = 0;
        uint _tokens70 = 0;

      
        uint _total = tokens.add(tokensSold);

        if(_range70 < _total) {
            _tokens70 = _total.sub(_range70);

            if(tokensSold > _range70)
                _tokens70 = _total.sub(tokensSold.sub(_range70));

            tokens = tokens.sub(_tokens70);
        }

        _total = tokens.add(tokensSold);
        if(_range20 < _total && tokensSold < _range20) {
            _tokens20 = _total.sub(_range20);

            if(tokensSold > _range20)
                _tokens20 = _total.sub(tokensSold.sub(_range20));


            tokens = tokens.sub(_tokens20);
        }

        
        _total = tokens.add(tokensSold);
        if(_range10 < _total && tokensSold < _range10) {
            _tokens10 = _total.sub(_range10);

            if(tokensSold > _range10)
                _tokens10 = _tokens10.sub(tokensSold.sub(_range10));

        
            tokens = tokens.sub(_tokens10);
        }

        uint rate = 0;
        if(soldTokens < 10) rate = 30;
        else if(soldTokens < 20) rate = 20;
        else if(soldTokens < 70) rate = 10; 

        tokens = getRate(tokens, rate);
        tokens = tokens.add(getRate(_tokens10, 20));
        tokens = tokens.add(getRate(_tokens20, 10));
        tokens = tokens.add(_tokens70);
        
        return tokens;
    }
}
using System;
using Xunit;
using Nethereum.Web3;
using System.Numerics;
using Nethereum.Util;
using System.IO;
using System.Text;

namespace coretests
{
    public class BurnTests : DeployTests
    {
        private const String _contractName = "FollowCoin";

        public BurnTests()
        {
            DeployFollowCoin();
        }

        [Theory]
        [InlineData(1000, alice)]
        public void Should_Burn_Tokens(int amount, String user)
        {
            var contract = GetContract(_contractName);   

            Nethereum.Hex.HexTypes.HexBigInteger gas = new Nethereum.Hex.HexTypes.HexBigInteger(2000000);
            Nethereum.Hex.HexTypes.HexBigInteger eth = new Nethereum.Hex.HexTypes.HexBigInteger(0);          

            // check owner's balance has tokens to burn
            var ownersBalance = GetBalance(contract, owner);   
            Assert.True(ownersBalance > amount, String.Format("Expected {0} to be > than {1}", ownersBalance, amount));

            // burn owners's tokens
            var functionToTest = contract.GetFunction("burn");            
            var tx = functionToTest.SendTransactionAsync(owner, gas, eth, new Object[1]{ amount }).Result;
            Assert.NotNull(tx);

            // check token's have been burnt
            var postBalance = GetBalance(contract, owner);
            Assert.Equal((ownersBalance - amount), postBalance);
        }

        [Fact]
        public void Given_Non_Owner_Should_Not_Burn_Tokens()
        {
            var nonOwner = alice;
            var amount = 1000;

            var contract = GetContract(_contractName);   

            Nethereum.Hex.HexTypes.HexBigInteger gas = new Nethereum.Hex.HexTypes.HexBigInteger(2000000);
            Nethereum.Hex.HexTypes.HexBigInteger eth = new Nethereum.Hex.HexTypes.HexBigInteger(0);          

            // check owner's balance has tokens to transfer to user
            var balanceFunction = contract.GetFunction("balanceOf");
            var ownersBalance = balanceFunction.CallAsync<BigInteger>(owner).Result;
            Assert.True(ownersBalance > amount, String.Format("Expected {0} to be > than {1}", ownersBalance, amount));

            // give user some tokens to burn
            var transferFunction = contract.GetFunction("transfer");
            var transferTx = transferFunction.SendTransactionAsync(owner, gas, eth, new Object[2]{ nonOwner, amount }).Result;
            Assert.NotNull(transferTx);

            // user's balance has transferred tokens?        
            var balance = balanceFunction.CallAsync<BigInteger>(nonOwner).Result;
            Assert.Equal(amount, balance);

            // burn user's tokens
            var functionToTest = contract.GetFunction("burn");            
            Assert.Throws<AggregateException>(() => functionToTest.SendTransactionAsync(nonOwner, gas, eth, new Object[1]{ amount }).Result);            

            // check token's have not been burnt
            var postBalance = balanceFunction.CallAsync<BigInteger>(nonOwner).Result;
            Assert.Equal(balance, postBalance);
        }

        [Fact]
        public void Given_Greater_Than_Balance_Should_Not_Burn_Tokens()
        {
            var contract = GetContract(_contractName);   

            Nethereum.Hex.HexTypes.HexBigInteger gas = new Nethereum.Hex.HexTypes.HexBigInteger(2000000);
            Nethereum.Hex.HexTypes.HexBigInteger eth = new Nethereum.Hex.HexTypes.HexBigInteger(0);          

            // check owner's balance has tokens to burn
            var ownersBalance = GetBalance(contract, owner);   
            Assert.True(ownersBalance > 0, String.Format("Expected {0} to be > than 0", ownersBalance));

            // burn owners's tokens
            var functionToTest = contract.GetFunction("burn");            
            Assert.Throws<AggregateException>(() => functionToTest.SendTransactionAsync(owner, gas, eth, new Object[1]{ ownersBalance + 1 }).Result);

            // check token's have not been burnt
            var postBalance = GetBalance(contract, owner);
            Assert.Equal(ownersBalance, postBalance);
        }


        [Theory(Skip="for now")]
        [InlineData(1000, 7777, alice)]    
        public void Should_Burn_From_Tokens(Decimal amount, UInt64 expected, String user)
        {
            var contract = GetContract(contractName);
            var balanceFunction = contract.GetFunction("balanceOf");

            var balance = balanceFunction.CallAsync<BigInteger>(user).Result;
            Assert.Equal(0, balance);

            var functionToTest = contract.GetFunction("buyTokensFrom");

            Nethereum.Hex.HexTypes.HexBigInteger gas = new Nethereum.Hex.HexTypes.HexBigInteger(2000000);
            Nethereum.Hex.HexTypes.HexBigInteger eth = new Nethereum.Hex.HexTypes.HexBigInteger(0); 

            Object[] functionParams = new Object[0];
            var tx = functionToTest.SendTransactionAsync(user, gas, eth, functionParams).Result;

            Assert.NotNull(tx);

            balance = balanceFunction.CallAsync<BigInteger>(user).Result;
            Assert.Equal(expected, balance);
        }

        private BigInteger GetBalance(Nethereum.Contracts.Contract contract, string address){
            var balanceFunction = contract.GetFunction("balanceOf");
            return balanceFunction.CallAsync<BigInteger>(address).Result;
        }

        /**
         var contract = GetContract(_contractName);   

            Nethereum.Hex.HexTypes.HexBigInteger gas = new Nethereum.Hex.HexTypes.HexBigInteger(2000000);
            Nethereum.Hex.HexTypes.HexBigInteger eth = new Nethereum.Hex.HexTypes.HexBigInteger(0);          

            // check owner's balance has tokens to transfer to user
            var balanceFunction = contract.GetFunction("balanceOf");
            var ownersBalance = balanceFunction.CallAsync<BigInteger>(owner).Result;
            Assert.True(ownersBalance > amount, String.Format("Expected {0} to be > than {1}", ownersBalance, amount));

            // give user some tokens to burn
            var transferFunction = contract.GetFunction("transfer");
            var transferTx = transferFunction.SendTransactionAsync(owner, gas, eth, new Object[2]{ user, amount }).Result;
            Assert.NotNull(transferTx);

            // user's balance has transferred tokens?        
            var balance = balanceFunction.CallAsync<BigInteger>(user).Result;
            Assert.Equal(1000, balance);

            // burn user's tokens
            var functionToTest = contract.GetFunction("burn");            
            var tx = functionToTest.SendTransactionAsync(user, gas, eth, new Object[1]{ amount }).Result;
            Assert.NotNull(tx);

            // check token's have been burnt
            var postBalance = balanceFunction.CallAsync<BigInteger>(user).Result;
            Assert.Equal(0, postBalance);
         */
    }
}
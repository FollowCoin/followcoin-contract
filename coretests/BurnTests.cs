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


        [Theory]
        [InlineData(1000, 7777, alice)]
        public void Should_Burn_Tokens(Decimal amount, UInt64 expected, String user)
        {
            var contract = GetContract(_contractName);            
            var balanceFunction = contract.GetFunction("balanceOf");

            var balance = balanceFunction.CallAsync<BigInteger>(user).Result;
            Assert.Equal(0, balance);

            var functionToTest = contract.GetFunction("burn");

            Nethereum.Hex.HexTypes.HexBigInteger gas = new Nethereum.Hex.HexTypes.HexBigInteger(2000000);
            Nethereum.Hex.HexTypes.HexBigInteger eth = new Nethereum.Hex.HexTypes.HexBigInteger(0); 

            Object[] functionParams = new Object[0];
            var tx = functionToTest.SendTransactionAsync(user, gas, eth, functionParams).Result;

            Assert.NotNull(tx);

            balance = balanceFunction.CallAsync<BigInteger>(user).Result;
            Assert.Equal(expected, balance);
        }

        [Theory]
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
    }
}
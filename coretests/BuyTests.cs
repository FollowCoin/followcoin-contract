using System;
using Xunit;
using Nethereum.Web3;
using System.Numerics;
using Nethereum.Util;
using System.IO;
using System.Text;

namespace coretests
{
    public class BuyTests : Helper
    {
        private const String _contractName = "FollowCoinPreSale";

        public BuyTests()
        {
           DeployFollowCoin(); 
           DeployFollowCoinPreSale1(GetContract("FollowCoin").Address);
        }

        protected void DeployFollowCoin(){
            const UInt64 initalSupply = 1000000000;
            Object[] constructorParms = new Object[4] { initalSupply, "Follow Coin", 18, "FLLW" };
            DeplyContract(contractPath, "FollowCoin", constructorParms);
        }

        protected void DeployFollowCoinPreSale1(string addressOfToken){            
            var ifSuccessfulSendTo = owner;
            var icoTokensLimitPerWallet = 1000000;
            var icoHardCap = 1;
            var icoSoftCap = 1;
            var icoStartTimestamp = 1509105600;
            var durationInDays = 28;
            var icoTotalTokens = 330000000;
            var icoTokensPerEther = 7777;
            var addressOfTokenUsedAsReward = addressOfToken;

            Object[] constructorParms = new Object[9] { 
                ifSuccessfulSendTo, 
                icoTokensLimitPerWallet, 
                icoHardCap, 
                icoSoftCap,
                icoStartTimestamp,
                durationInDays,
                icoTotalTokens,
                icoTokensPerEther,
                addressOfTokenUsedAsReward
            };
            DeplyContract(contractPath, "FollowCoinPreSale", constructorParms);
        }

        [Fact]
        public void Should_Not_Buy_Before_Sale_Date()
        {
            var contract = GetContract(_contractName);
            var balanceFunction = contract.GetFunction("balanceOf");

            var balance = balanceFunction.CallAsync<BigInteger>(alice).Result;
            Assert.Equal(0, balance);

            var functionToTest = contract.GetFunction("buyTokens");

            Nethereum.Hex.HexTypes.HexBigInteger gas = new Nethereum.Hex.HexTypes.HexBigInteger(2000000);
            BigInteger ethToSend = Nethereum.Util.UnitConversion.Convert.ToWei(1.0D, Nethereum.Util.UnitConversion.EthUnit.Ether);
            Nethereum.Hex.HexTypes.HexBigInteger eth = new Nethereum.Hex.HexTypes.HexBigInteger(ethToSend); 

            Object[] functionParams = new Object[0];

            var exception = Assert.Throws<AggregateException>(() => functionToTest.SendTransactionAsync(alice, gas, eth, functionParams).Result);
            Assert.NotNull(exception);
        }

        [Theory]
        [InlineData(100, 130)]
        public void Should_Calculate_Amount(UInt64 tokens, UInt64 expected)
        {
            var contract = GetContract(_contractName);
            var functionToTest = contract.GetFunction("calculateTokenAmount");

            var actual = functionToTest.CallAsync<BigInteger>(tokens).Result;
            Assert.Equal(expected, actual);
        }
    }
}
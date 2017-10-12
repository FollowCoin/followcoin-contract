using System;
using Xunit;
using Nethereum.Web3;
using System.Numerics;
using Nethereum.Util;
using System.IO;
using System.Text;

namespace coretests
{
    public class PreSale1Tests : DeployTests
    {
        // private const String _preSaleContractName = "FollowCoinPreSale";
        // private const String _tokenContractName = "FollowCoin";

        // [Theory]
        // [InlineData(1.0D, 7777, alice)]
        // public void Should_Buy_Tokens_In_PreSale1(Decimal ethAmount, UInt64 expected, String buyer)
        // {
        //     var contract = GetContract(_tokenContractName);
        //     var balanceFunction = contract.GetFunction("balanceOf");

        //     var balance = balanceFunction.CallAsync<BigInteger>(buyer).Result;
        //     Assert.Equal(0, balance);

        //     var functionToTest = contract.GetFunction("buyTokens");

        //     Nethereum.Hex.HexTypes.HexBigInteger gas = new Nethereum.Hex.HexTypes.HexBigInteger(2000000);
        //     BigInteger ethToSend = Nethereum.Util.UnitConversion.Convert.ToWei(ethAmount, Nethereum.Util.UnitConversion.EthUnit.Ether);
        //     Nethereum.Hex.HexTypes.HexBigInteger eth = new Nethereum.Hex.HexTypes.HexBigInteger(ethToSend); 

        //     Object[] functionParams = new Object[0];
        //     var tx = functionToTest.SendTransactionAsync(buyer, gas, eth, functionParams).Result;

        //     Assert.NotNull(tx);

        //     balance = balanceFunction.CallAsync<BigInteger>(buyer).Result;
        //     Assert.Equal(expected, balance);

        //     var totalSoldFunction = contract.GetFunction("getTotalSold");
        //     var actual = totalSoldFunction.CallAsync<BigInteger>().Result;

        //     Assert.Equal(expected, actual);
        // }
    }
}
using System;
using Xunit;
using Nethereum.Web3;
using System.Numerics;
using Nethereum.Util;
using System.IO;
using System.Text;

namespace coretests
{
    public class ERC20Tests : DeployTests
    {
        // public ERC20Tests()
        // {
        //     Object[] constructorParms = new Object[2] { 0, 0 };
        //     DeplyContract(contractPath, contractName, constructorParms);
        // }

        // [Fact]
        // public void Should_Not_Be_In_PreSale_Period()
        // {
        //     var contract = GetContract(contractName);
        //     var functionToTest = contract.GetFunction("inPreSalePeriod");

        //     var actual = functionToTest.CallAsync<Boolean>().Result;
        //     Assert.False(actual);
        // }

        // [Fact]
        // public void Should_Not_Be_In_Sale_Period()
        // {
        //     var contract = GetContract(contractName);
        //     var functionToTest = contract.GetFunction("inSalePeriod");

        //     var actual = functionToTest.CallAsync<Boolean>().Result;
        //     Assert.False(actual);
        // }

        [Fact]
        public void Should_Get_Token_Name()
        {
            var contract = GetContract(contractName);
            var functionToTest = contract.GetFunction("name");

            var actual = functionToTest.CallAsync<String>().Result;
            Assert.Equal("Follow", actual);
        }

        [Fact]
        public void Should_Get_Token_Symbol()
        {
            var contract = GetContract(contractName);
            var functionToTest = contract.GetFunction("symbol");

            var actual = functionToTest.CallAsync<String>().Result;
            Assert.Equal("FLLW", actual);
        }

        [Fact]
        public void Should_Get_Initial_Total_Supply()
        {
            var contract = GetContract(contractName);
            var functionToTest = contract.GetFunction("totalSupply");

            var actual = functionToTest.CallAsync<BigInteger>().Result;
            Assert.Equal(330000000, actual);
        }

        [Fact]
        public void Should_Get_Owner_Token_Balance()
        {
            var contract = GetContract(contractName);
            var functionToTest = contract.GetFunction("balanceOf");

            var actual = functionToTest.CallAsync<BigInteger>(owner).Result;
            Assert.Equal(0, actual);
        }

        // [Theory]
        // [InlineData(1.0D, 7777, alice)]
        // public void Should_Buy_Tokens_In_PreSale1(decimal ethAmount, UInt64 expected, String user)
        // {
        //     var contract = GetContract(contractName);
        //     var balanceFunction = contract.GetFunction("balanceOf");

        //     var balance = balanceFunction.CallAsync<BigInteger>(user).Result;
        //     Assert.Equal(0, balance);

        //     var functionToTest = contract.GetFunction("transfer");

        //     Nethereum.Hex.HexTypes.HexBigInteger gas = new Nethereum.Hex.HexTypes.HexBigInteger(2000000);
        //     BigInteger ethToSend = Nethereum.Util.UnitConversion.Convert.ToWei(ethAmount, Nethereum.Util.UnitConversion.EthUnit.Ether);
        //     Nethereum.Hex.HexTypes.HexBigInteger eth = new Nethereum.Hex.HexTypes.HexBigInteger(ethToSend); 

        //     Object[] functionParams = new Object[0];
        //     var tx = functionToTest.SendTransactionAsync(user, gas, eth, functionParams).Result;

        //     Assert.NotNull(tx);

        //     balance = balanceFunction.CallAsync<BigInteger>(user).Result;
        //     Assert.Equal(expected, balance);

        //     var totalSoldFunction = contract.GetFunction("getTotalSold");
        //     var actual = totalSoldFunction.CallAsync<BigInteger>().Result;

        //     Assert.Equal(expected, actual);
        // }
    }
}

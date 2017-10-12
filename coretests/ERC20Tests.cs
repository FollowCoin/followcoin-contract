using System;
using Xunit;
using Nethereum.Web3;
using System.Numerics;
using Nethereum.Util;
using System.IO;
using System.Text;

namespace coretests
{
    public class ERC20Tests : Helper    
    {   
        public const String _contractName = "FollowCoin";

        public ERC20Tests()
        {
            const UInt64 initalSupply = 1000000000;
            Object[] constructorParms = new Object[4] { initalSupply, "Follow Coin", 18, "FLLW" };
            DeplyContract(contractPath, _contractName, constructorParms);
        }

        [Fact]
        public void Should_Get_Token_Name()
        {
            var contract = GetContract(_contractName);
            var functionToTest = contract.GetFunction("name");

            var actual = functionToTest.CallAsync<String>().Result;
            Assert.Equal("Follow Coin", actual);
        }

        [Fact]
        public void Should_Get_Token_Symbol()
        {
            var contract = GetContract(_contractName);
            var functionToTest = contract.GetFunction("symbol");

            var actual = functionToTest.CallAsync<String>().Result;
            Assert.Equal("FLLW", actual);
        }

        [Fact]
        public void Should_Get_Initial_Total_Supply()
        {
            var contract = GetContract(_contractName);
            var functionToTest = contract.GetFunction("totalSupply");

            var actual = functionToTest.CallAsync<BigInteger>().Result;
            Assert.Equal(1000000000, actual);
        }

        [Fact]
        public void Should_Get_Owner_Token_Balance()
        {
            var contract = GetContract(_contractName);
            var functionToTest = contract.GetFunction("balanceOf");

            var actual = functionToTest.CallAsync<BigInteger>(owner).Result;
            Assert.Equal(0, actual);
        }
    }
}

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
        private string _contractName = "FollowCoin";

        [Fact]
        public void Should_Get_Token_Name()
        {
            var contract = GetContract(_contractName);
            var functionToTest = contract.GetFunction("name");

            var actual = functionToTest.CallAsync<String>().Result;
            Assert.Equal("Follow", actual);
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
            Assert.Equal(330000000, actual);
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

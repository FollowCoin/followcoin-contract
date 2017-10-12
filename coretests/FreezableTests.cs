using System;
using Xunit;
using Nethereum.Web3;
using System.Numerics;
using Nethereum.Util;
using System.IO;
using System.Text;

namespace coretests
{
    public class FreezableTests : DeployTests
    {
        private const String _contractName = "FollowCoinPreSale";

        [Fact]
        public void Should_Be_Lockeddown()
        {
            var contract = GetContract(_contractName);
            var functionToTest = contract.GetFunction("contributorsLockdown");

            var actual = functionToTest.CallAsync<Boolean>().Result;
            Assert.Equal(true, actual);
        }

        [Fact]
        public void Owner_Should_Be_Able_To_Unlock()
        {
            var contract = GetContract(_contractName);

            var lockdownFunction = contract.GetFunction("contributorsLockdown");

            var actual = lockdownFunction.CallAsync<Boolean>().Result;
            Assert.Equal(true, actual);

            var functionToTest = contract.GetFunction("setLockDown");

            Nethereum.Hex.HexTypes.HexBigInteger gas = new Nethereum.Hex.HexTypes.HexBigInteger(2000000);
            Nethereum.Hex.HexTypes.HexBigInteger eth = new Nethereum.Hex.HexTypes.HexBigInteger(0); 

            Object[] functionParams = new Object[1] { false };
            var tx = functionToTest.SendTransactionAsync(owner, gas, eth, functionParams).Result;

            Assert.NotNull(tx);

            actual = lockdownFunction.CallAsync<Boolean>().Result;
            Assert.Equal(false, actual);
        }
    }
}

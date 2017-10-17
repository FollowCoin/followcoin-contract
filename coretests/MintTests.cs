using System;
using Xunit;
using Nethereum.Web3;
using System.Numerics;
using Nethereum.Util;
using System.IO;
using System.Text;

namespace coretests
{
    public class MintTests : Helper
    {
        public const String _contractName = "FollowCoin";

        public MintTests()
        {
            const UInt64 initalSupply = 1000000000;
            Object[] constructorParms = new Object[4] { initalSupply, "Follow Coin", 18, "FLLW" };
            DeplyContract(contractPath, _contractName, constructorParms);
        }

        //[Fact]
        public void Owner_Should_Mint_Tokens()
        {
            var contract = GetContract(contractName);
            var balanceFunction = contract.GetFunction("balanceOf");

            var balance = balanceFunction.CallAsync<BigInteger>(alice).Result;
            Assert.Equal(0, balance);

            var functionToTest = contract.GetFunction("mintToken");

            Nethereum.Hex.HexTypes.HexBigInteger gas = new Nethereum.Hex.HexTypes.HexBigInteger(2000000);
            BigInteger ethToSend = Nethereum.Util.UnitConversion.Convert.ToWei(0, Nethereum.Util.UnitConversion.EthUnit.Ether);
            Nethereum.Hex.HexTypes.HexBigInteger eth = new Nethereum.Hex.HexTypes.HexBigInteger(ethToSend); 

            Object[] functionParams = new Object[2] { alice, 200 };
            var tx = functionToTest.SendTransactionAsync(owner, gas, eth, functionParams).Result;

            Assert.NotNull(tx);

            balance = balanceFunction.CallAsync<BigInteger>(alice).Result;
            Assert.Equal(200, balance);
        }
    }
}
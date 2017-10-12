using System;
using Xunit;
using Nethereum.Web3;
using System.Numerics;
using Nethereum.Util;
using System.IO;
using System.Text;

namespace coretests
{
    public class DeployTests : Helper
    {
        public DeployTests()
        {
            const UInt64 initalSupply = 1000000000;

            Object[] constructorParms = new Object[4] { initalSupply, "Follow Coin", 18, "FLLW" };
            DeplyContract(contractPath, contractName, constructorParms);
        }
    }
}

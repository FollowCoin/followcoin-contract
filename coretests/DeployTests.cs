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
            var icoStartTimestamp = OCTOBER_27_2017;
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
    }
}

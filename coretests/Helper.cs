using System;
using System.IO;
using System.Numerics;
using System.Text;
using Nethereum.Contracts;
using Nethereum.Web3;

namespace coretests
{
    public abstract class Helper
    {
        //0x221bbb8b9b508c2841a60f862e9d03c1997097f99ee83db94e077ff180265247
        public const String owner = "0x4d444cdda7b70abf948da38380af64d322a24331";

        public const string alice = "0xf0072559848df03140c3ab2e4f6e5f76ef55f6dc";

        public const string bob = "";

        public static String ETH = "100000000000000000";
        public static String HALF_ETH = "50000000000000000";
        public static String TWO_ETH = "200000000000000000";

        public const Int64 OCTOBER_27_2017 = 1509062400;

        public const String contractName = "FollowCoinPreSale";
        
        //public String contractPath = "/home/lucascullen/GitHub/followcoin-contract/bin/src/contracts/";
        public String contractPath = "/home/lucascullen/GitHub/followcoin-contract/bin/src/contracts/";

        public String contractAddress = "";
        
        public Web3 web3 = new Web3("http://localhost:8545");

        public static DateTime FromUnixTime(long unixTime)
        {
            return epoch.AddSeconds(unixTime);
        }

        private static readonly DateTime epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        protected static string GetABIFromFile(String path)
        {
            var fileStream = new FileStream(path, FileMode.Open, FileAccess.Read);
            using (var streamReader = new StreamReader(fileStream, Encoding.UTF8))
            {
                String text = streamReader.ReadToEnd();
                return text;
            }
        }

        protected static string GetBytesFromFile(String path)
        {
            var fileStream = new FileStream(path, FileMode.Open, FileAccess.Read);
            using (var streamReader = new StreamReader(fileStream, Encoding.UTF8))
            {
                String text = streamReader.ReadToEnd();
                return "0x" + text;
            }
        }
        
        protected static string GetBytesFromFile(String path, String contractname)
        {
            var fileStream = new FileStream(String.Format("{0}/{1}.bin",path, contractname) , FileMode.Open, FileAccess.Read);
            using (var streamReader = new StreamReader(fileStream, Encoding.UTF8))
            {
                String text = streamReader.ReadToEnd();
                return "0x" + text;
            }
        }

        public void DeplyContract(String contractPath, String contractName, Object[] param)
        {
            String bytes = GetBytesFromFile(contractPath + contractName + ".bin");
            Nethereum.Hex.HexTypes.HexBigInteger gas = new Nethereum.Hex.HexTypes.HexBigInteger(2000000);
            
            String abi = GetABIFromFile(String.Format("{0}{1}.abi", contractPath, contractName));

            if (param != null)
            {
                String tx = web3.Eth.DeployContract.SendRequestAsync(abi, bytes, owner, gas, param).Result;
                contractAddress = MonitorTx(tx);
            }
            else
            {
                String tx =  web3.Eth.DeployContract.SendRequestAsync(bytes, owner, gas).Result;
                contractAddress = MonitorTx(tx);
            }
        }

        public String MonitorTx(String transactionHash)
        {
            var receipt = web3.Eth.Transactions.GetTransactionReceipt.SendRequestAsync(transactionHash).Result;

            while (receipt == null)
            {
                Console.WriteLine("Sleeping for 5 seconds");
                System.Threading.Thread.Sleep(5000);
                receipt = web3.Eth.Transactions.GetTransactionReceipt.SendRequestAsync(transactionHash).Result;
            }

            Console.WriteLine("Contract address {0} block height {1}", receipt.ContractAddress, receipt.BlockNumber.Value);

            return receipt.ContractAddress;
        }

        protected Nethereum.Contracts.Contract GetContract(String contractName)
        {
            String abi = GetABIFromFile(String.Format(@"{0}{1}.abi", contractPath, contractName));
            return web3.Eth.GetContract(abi, contractAddress);
        }

        protected static Nethereum.Hex.HexTypes.HexBigInteger GetGas()
        {
            return new Nethereum.Hex.HexTypes.HexBigInteger(2000000);
        }

        //  protected string Buy(Contract contract, String buyer, Decimal amount){
        //     var functionToTest = contract.GetFunction("buyTokens");

        //     Nethereum.Hex.HexTypes.HexBigInteger gas = new Nethereum.Hex.HexTypes.HexBigInteger(2000000);
        //     BigInteger ethToSend = Nethereum.Util.UnitConversion.Convert.ToWei(amount, Nethereum.Util.UnitConversion.EthUnit.Ether);
        //     Nethereum.Hex.HexTypes.HexBigInteger eth = new Nethereum.Hex.HexTypes.HexBigInteger(ethToSend); 

        //     Object[] functionParams = new Object[0];
        //     return functionToTest.SendTransactionAsync(buyer, gas, eth, functionParams).Result;
        // }

        // protected Int32 GetStage(Contract contract){
        //     var functionToTest = contract.GetFunction("getStage");
        //     return functionToTest.CallAsync<Int32>().Result;
        // }

        // protected UInt64 GetCurrentPrice(Contract contract, String buyer){
        //     var functionToTest = contract.GetFunction("getCurrentPrice");
        //     return functionToTest.CallAsync<UInt64>(buyer).Result;
        // }
    }
}
const Web3 = require("web3");

const zeroAddress = "0x0000000000000000000000000000000000000000"

const knownTokenAddresses = {
    "cBAT": "0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e",
    "cCOMP": "0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4",
    "cDAI": "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643",
    "cETH": "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5",
    "cUSDC": "0x39aa39c021dfbae8fac545936693ac917d5e7563",
    "cUSDT": "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9",
    "cREP": "0x158079ee67fce2f58472a96584a73c7ab9ac95c1",
    "cSAI": "0xf5dce57282a584d2746faf1593d3121fcac444dc",
    "cUNI": "0x35a18000230da775cac24873d00ff85bccded550",
    "cWBTC": "0xC11b1268C1A384e55C48c2391d8d480264A3A7F4", //cWBTC
    "cWBTC2": "0xccf4429db6322d5c611ee964527d42e5d685dd6a", //cWBTC 2
    "cZRX": "0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407",
    "DAI": "0x6b175474e89094c44da98b954eedeac495271d0f",
    "BAT": "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
    "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "USDT": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "WETH": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    "WBTC": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    "aDAI": "0x028171bCA77440897B824Ca71D1c56caC55b68A3",
    "COMP": "0xc00e94Cb662C3520282E6f5717214004A7f26888"
}

const knownProxyContractPair = {
    "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B": "0xbe7616b06f71e363a310aa8ce8ad99654401ead7", //Compound comtroller
    "0x028171bCA77440897B824Ca71D1c56caC55b68A3": "0xb7bf8e4908ad1caf1a638b30ef80afc581fdc968", //aDAI
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": "0xb7277a6e95992041568d9391d09d0122023778a2", //USDC
    "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9": "0xc6845a5c768bf8d7681249f8927877efda425baf", //InitializableImmutableAdminUpgradeabilityProxy
    "0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3": "0x5766067108e534419ce13f05899bc3e3f4344948", //InitializableAdminUpgradeabilityProxy
    "0x398eC7346DcD622eDc5ae82352F02bE94C62d119": "0x017788dded30fdd859d295b90d4e41a19393f423",

}

const knownContracts =
[
    {
        "ContractName": "UniswapAnchoredView",
        "Address": "0x922018674c12a7f0d394ebeef9b58f186cde13c1",
        "IsProxy": false
    },
    {
        "ContractName": "Comptroller",
        "Address": "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B",
        "IsProxy": true
    },
    {
        "ContractName": "UniswapV2Router02",
        "Address": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        "IsProxy": false
    },
    {
      "ContractName": "UniswapV2Factory",
      "Address": "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      "IsProxy": false
    },
    {
       "ContractName": "InitializableImmutableAdminUpgradeabilityProxy",
       "Address": "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
       "IsProxy": true
    },
    {
       "ContractName": "InitializableAdminUpgradeabilityProxyV1",
       "Address": "0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3",
       "IsProxy": true
    },
    {
       "ContractName": "InitializableAdminUpgradeabilityProxyV1.1",
       "Address": "0x398eC7346DcD622eDc5ae82352F02bE94C62d119",
       "IsProxy": true
    },
    {
       "ContractName": "OpenOraclePriceData",
       "Address": "0xc629c26dced4277419cde234012f8160a0278a79",
       "IsProxy": false
    },
    {
       "ContractName": "CompoundLens",
       "Address": "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
       "IsProxy": false
    }
]

function findContractAddress(contractName){
    for(var i = 0; i < knownContracts.length; i++){
        if(knownContracts[i].ContractName == contractName){
            return Web3.utils.toChecksumAddress(knownContracts[i].Address);
        }
    }
}

function findAddress(tokenOrContractName, blockNumber){

    //cWBTC
    if(tokenOrContractName == "cWBTC") return getCWBTCAddr(blockNumber);

    const tokenAddr = knownTokenAddresses[tokenOrContractName];

    if(tokenAddr){
        return tokenAddr;
    }

    const contractAddr = findContractAddress(tokenOrContractName);

    if(contractAddr){
        return contractAddr;
    }

    console.log("Address not found!");
    return "";
}

function getCWBTCAddr(blockNumber){
    if(blockNumber >= 12069867){
        return knownTokenAddresses["cWBTC2"];
    }

    return knownTokenAddresses["cWBTC"];
}

function findImplmentationAddress(proxyAddr){
    proxyAddr = Web3.utils.toChecksumAddress(proxyAddr);
    if(knownProxyContractPair[proxyAddr]){
        return knownProxyContractPair[proxyAddr];
    }

    return proxyAddr;
}

module.exports ={
    findImplmentationAddress, knownTokenAddresses, knownProxyContractPair, knownContracts, findContractAddress, findAddress, zeroAddress
}

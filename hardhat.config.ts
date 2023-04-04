import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy"


const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    localhost: {
        url: "http://127.0.0.1:8545/",
        chainId: 31337,
    },
    // mumbai: {
    //     url: MUMBAI_RPC_URL,
    //     accounts: [MM_PRIVATE_KEY],
    //     chainId: 80001,
    // },
},
  namedAccounts: {
    deployer: {
        default: 0,
    },
    foreign: {
        default: 1,
    },
},
};

export default config;

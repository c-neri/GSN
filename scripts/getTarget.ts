import { GsnTestEnvironment } from "@opengsn/dev";
import { ethers, getNamedAccounts } from "hardhat"

async function main() {
    const GSN = await GsnTestEnvironment.loadDeployment('http://127.0.0.1:8545/')
    const {relayHubAddress} = GSN

    if(!relayHubAddress) return 
    
    const pm = await ethers.getContract('PaymasterContract')
    const target = await pm.target()

    console.log(target)
}

main().catch((error) => {
    console.error(error)
})

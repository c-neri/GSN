import { GsnTestEnvironment } from "@opengsn/dev";
import { ethers, getNamedAccounts } from "hardhat"

async function main() {
    const GSN = await GsnTestEnvironment.loadDeployment('http://127.0.0.1:8545/')
    const {relayHubAddress} = GSN

    if(!relayHubAddress) return 
    
    const gasless = await ethers.getContract('Gasless')
    const value = await gasless.value()

    console.log(value.toString())
}

main().catch((error) => {
    console.error(error)
})

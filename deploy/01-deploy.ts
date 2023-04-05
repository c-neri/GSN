import { GsnTestEnvironment }  from "@opengsn/dev"
import { ethers, network} from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"

const deploy: DeployFunction = async ({ getNamedAccounts, deployments }) => {
    const GSN = await GsnTestEnvironment.loadDeployment('http://127.0.0.1:8545/')
    const {forwarderAddress, relayHubAddress} = GSN

    if(!relayHubAddress) return
    if(!forwarderAddress) return
    if(!relayHubAddress) return

    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    let waitConfirmations = 1

    //DEPLOY
    await deploy("Gasless", {
        from: deployer,
        args:[forwarderAddress],
        waitConfirmations,
        log: true,
    })

    await deploy("PaymasterContract", {
        from: deployer,
        args:[],
        waitConfirmations,
        log: true,
    })

     //SETTING
    const paymasterContract = await ethers.getContract('PaymasterContract', deployer)
        await paymasterContract.setRelayHub(relayHubAddress)
        await paymasterContract.setTrustedForwarder(forwarderAddress)

}

deploy.tags = ["all"]
export default deploy

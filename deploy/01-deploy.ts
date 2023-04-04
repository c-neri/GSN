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
    const fundAmount = ethers.utils.parseEther('0.1')
    // const fundAmount = 1
    const provider = new ethers.providers.JsonRpcProvider();

    //DEPLOY
    await deploy("Gasless", {
        from: deployer,
        args:[forwarderAddress],
        waitConfirmations,
        log: true,
    })

    const paymaster = await deploy("PaymasterContract", {
        from: deployer,
        args:[],
        waitConfirmations,
        log: true,
    })

     //SETTING
    const paymasterContract = await ethers.getContract('PaymasterContract', deployer)
        const version = await paymasterContract.versionPaymaster()
        console.log(version) //3.0.0-beta.3+opengsn.recipient.ipaymaster
        await paymasterContract.setRelayHub(relayHubAddress)
        await paymasterContract.setTrustedForwarder(forwarderAddress)

    // //FUND
    const relayHubContract = new ethers.Contract(
        relayHubAddress,
        ["function versionHub() external view returns (string)"],
        provider
      );
    // const relayHubContract =  await ethers.getContractAt('RelayHub', deployer)
    const versionHub = await relayHubContract.versionHub()
    console.log(versionHub) //3.0.0-beta.3+opengsn.hub.irelayhub

    // const receipt = await relayHubContract.depositFor(paymaster.address, {
    //     value:fundAmount
    // })
}

deploy.tags = ["all"]
export default deploy

// 51cc745f42476a6e
// tacabiy381@nevyxus.com

// fixew40451@quamox.com
// 07b0176ce88288ba
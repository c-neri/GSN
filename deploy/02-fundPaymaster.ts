import { GsnTestEnvironment }  from "@opengsn/dev"
import { ethers } from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"

const deploy: DeployFunction = async ({ getNamedAccounts, deployments }) => {
    const GSN = await GsnTestEnvironment.loadDeployment('http://127.0.0.1:8545/')
    const {relayHubAddress} = GSN
    const fundAmount = ethers.utils.parseEther('0.1')
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]

    if(!relayHubAddress) return 

    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
    const relayHubContract = new ethers.Contract(
      relayHubAddress,
      [
          "function depositFor(address target) external payable",
          'function balanceOf(address target) external view returns (uint256)'
      ],
      provider
    );
    const relayHub = relayHubContract.connect(deployer)

    //PAYMASTER FUND
    const paymaster = await ethers.getContract('PaymasterContract')
    await relayHub.depositFor(paymaster.address,{value:fundAmount})
}

deploy.tags = ["all"]
export default deploy

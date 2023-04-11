import { GsnTestEnvironment } from "@opengsn/dev";
import { ethers, getNamedAccounts } from "hardhat"

async function main() {
    const GSN = await GsnTestEnvironment.loadDeployment('http://127.0.0.1:8545/')
    const {relayHubAddress, forwarderAddress} = GSN
    if(!relayHubAddress) return 
    //RELAY PROVIDER
    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
  
    const relayHubContract = new ethers.Contract(
      relayHubAddress,
      [
          "function depositFor(address target) external payable",
          'function balanceOf(address target) external view returns (uint256)'
      ],
      provider
    )

    const paymaster = await ethers.getContract('PaymasterContract')
    const paymasterAmount = await relayHubContract.balanceOf(paymaster.address)
    const gasless = await ethers.getContract('Gasless')
    const isTrust = await gasless.isTrustedForwarder(forwarderAddress)
    console.log('------')
    console.log('CONTRACT IS TRUSTED? ', isTrust)
    console.log('PAYMASTER ADDR:',paymaster.address)
    console.log('PAYMASTER BALANCE:',ethers.utils.formatEther(paymasterAmount))
    console.log('------')

}

main().catch((error) => {
    console.error(error)
})

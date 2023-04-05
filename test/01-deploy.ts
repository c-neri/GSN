import { deployments, ethers, network } from "hardhat"
import { Gasless } from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { GsnTestEnvironment } from "@opengsn/dev";
import { expect } from "chai";
import { Provider } from "@ethersproject/providers";
const { RelayProvider } = require('@opengsn/provider')

describe("GSN", () => {
  let gasless: Gasless
  let deployer: SignerWithAddress
  let foreign: SignerWithAddress
  let relayHub: any
  let paymaster: any
  let relayProvider: any
  
  beforeEach(async () => {
    //DEPLOY
    await deployments.fixture(["all"])
    const { relayHubAddress}  = await GsnTestEnvironment.loadDeployment('http://127.0.0.1:8545/')
    if(!relayHubAddress) return
  
    //SET ACCOUNT
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    foreign = accounts[1]

    //GET CONTRACTS
    gasless = await ethers.getContract('Gasless')
    paymaster = await ethers.getContract('PaymasterContract')
  
    //RELAY PROVIDER
    const provider = new ethers.providers.JsonRpcProvider();
    const config = { 
      paymasterAddress: paymaster.address,
      loggerConfiguration: {
          logLevel: 'debug'
      }
    }
    relayProvider = await RelayProvider.newProvider({ provider: provider, config }).init()
    
    const relayHubContract = new ethers.Contract(
      relayHubAddress,
      [
          "function depositFor(address target) external payable"
      ],
      provider
    );
      //CONNECT
      relayHub = relayHubContract.connect(deployer)

})

  describe("Check balance", function () {
  
    it("It should fund the paymaster", async function () {
      const fundAmount = ethers.utils.parseEther('0.1')
      const balanceBefore = await ethers.provider.getBalance(deployer.address)
      
      const tx = await relayHub.depositFor(paymaster.address,{value:fundAmount})
      const receipt = await tx.wait() // wait that tx is added to the block
      const gasPriceUsed = receipt.gasUsed.mul(tx.gasPrice)

      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      const expectedBalanceAfter = balanceBefore.sub(fundAmount).sub(gasPriceUsed)
      expect(balanceAfter).to.equal(expectedBalanceAfter)

    })
  
    it("It should charge foreign user", async function () {
      const balanceBefore = await ethers.provider.getBalance(foreign.address)
      const foreignConnection = gasless.connect(foreign)
      const tx = await foreignConnection.addValue()
      await tx.wait()
      const balanceAfter = await ethers.provider.getBalance(foreign.address)
      expect(balanceBefore).to.equal(balanceAfter)
    })


  })
  
})

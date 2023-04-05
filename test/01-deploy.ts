import { deployments, ethers, network } from "hardhat"
import { Gasless } from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { GsnTestEnvironment } from "@opengsn/dev";
import { expect } from "chai";
import { Provider } from "@ethersproject/providers";
const { RelayProvider } = require('@opengsn/provider')
import { wrapSigner } from '@opengsn/provider/dist/WrapContract'
describe("GSN", () => {
  let gasless: Gasless
  let deployer: SignerWithAddress
  let foreign: SignerWithAddress
  let relayHub: any
  let paymaster: any
  let relayProvider: any
  let config: any
  
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
    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
    config = { 
      paymasterAddress: paymaster.address,
      loggerConfiguration: {
          logLevel: 'debug'
      }
    }
  
    relayProvider = await RelayProvider.newProvider({ provider: provider, config }).init()
    
    const relayHubContract = new ethers.Contract(
      relayHubAddress,
      [
          "function depositFor(address target) external payable",
          'function balanceOf(address target) external view returns (uint256)'
      ],
      provider
    );
      //CONNECT
      relayHub = relayHubContract.connect(deployer)

})

  describe("Check balance", function () {
  
    it("It should fund the paymaster", async function () {
       //PAYMASTER SET TARGET
      paymaster.connect(deployer)
      await paymaster.setTarget(gasless.address)

      //CHECK BALANCE PAYMASTER AFTER
      const balancePMBefore = await relayHub.balanceOf(paymaster.address)
      console.log(balancePMBefore.toString())
      //CHECK BALANCE BEFORE
      const fundAmount = ethers.utils.parseEther('0.1')
      const balanceBefore = await ethers.provider.getBalance(deployer.address)
      
      const tx = await relayHub.depositFor(paymaster.address,{value:fundAmount})
      const receipt = await tx.wait() // wait that tx is added to the block
      const gasPriceUsed = receipt.gasUsed.mul(tx.gasPrice)

      //CHECK BALANCE AFTER
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      const expectedBalanceAfter = balanceBefore.sub(fundAmount).sub(gasPriceUsed)

      //CHECK BALANCE PAYMASTER AFTER
      const balancePMAfter = await relayHub.balanceOf(paymaster.address)

      expect(balanceAfter).to.equal(expectedBalanceAfter)
      expect(balancePMAfter).to.equal(fundAmount)
    })
  
    it("It should not charge foreign user", async function () {
      const fundAmount = ethers.utils.parseEther('0.1')
      await paymaster.setTarget(gasless.address)
    
      //PAYMASTER BALANCE BEFORE
      const balanceBefore = await relayHub.balanceOf(paymaster.address)
    
      //PAYMASTER FUND
      await relayHub.depositFor(paymaster.address,{value:fundAmount})
    
      //PAYMASTER BALANCE AFTER
      const balanceAfter = await relayHub.balanceOf(paymaster.address)

      //FOREIGN BALANCE BEFORE
      const balanceUserBefore = await ethers.provider.getBalance(deployer.address)

      //FOREIGN EXECUTE
      const foreignWrap = await wrapSigner(foreign,config)
      const foreignConnection = gasless.connect(foreignWrap)
      const tx = await foreignConnection.addValue()
      await tx.wait()

      //FOREIGN BALANCE AFTER
      const balanceUserAfter = await ethers.provider.getBalance(deployer.address)


      expect(balanceUserBefore).to.equal(balanceUserAfter)
    })


  })
  
})

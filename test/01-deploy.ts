import { deployments, ethers, network } from "hardhat"
import { Gasless } from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
// import { use, providers }  from "@nomiclabs/hardhat"
import { EthereumProvider } from "hardhat/types"
import { expect } from "chai"
import * as abi from '../artifacts/contracts/Gasless.sol/Gasless.json'
import { GsnTestEnvironment } from "@opengsn/dev"
describe("GSN", () => {
  let gasless: Gasless
  let abi: Gasless
  let deployer: SignerWithAddress
  let supervisor: SignerWithAddress
  let legal: SignerWithAddress
  let teacher: SignerWithAddress
  let foreign: SignerWithAddress
  let provider: EthereumProvider
  
  beforeEach(async () => {
    await deployments.fixture(["all"])
    
    const accounts = await ethers.getSigners()
    gasless = await ethers.getContract('Gasless')
    deployer = accounts[0]
    foreign = accounts[1]
})

  describe("Check balance", function () {
    it("test deploy", async function () {
      const balance = ethers.provider.getBalance(deployer.address)
      console.log(balance)
    })

  })
  
})

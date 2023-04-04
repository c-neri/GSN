import { deployments, ethers, network } from "hardhat"
import { Gasless } from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

describe("GSN", () => {
  let gasless: Gasless
  let deployer: SignerWithAddress
  let foreign: SignerWithAddress
  
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

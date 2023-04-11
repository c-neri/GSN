import { ethers, getNamedAccounts, network } from "hardhat"
import * as fs from "fs"
import path from "path"
import { GsnTestEnvironment } from "@opengsn/dev"
const ADDRESS = path.join(__dirname, "../app/constants/addresses.json")
const ABI = path.join(__dirname, "../app/constants/abi.json")

const updateConctracts = async () => {
    const GSN = await GsnTestEnvironment.loadDeployment('http://127.0.0.1:8545/')
    const {forwarderAddress, relayHubAddress} = GSN
    const contract = await ethers.getContract("Gasless")
    const pm = await ethers.getContract("PaymasterContract")
    const currentAddress = JSON.parse(fs.readFileSync(ADDRESS, "utf8"))
    const name = network.name

    if (currentAddress[name]) {
        currentAddress[name].contract = contract.address
        currentAddress[name].paymaster = pm.address
        currentAddress[name].relayHub = relayHubAddress
    } else {
        currentAddress[name] = {
            contract: contract.address,
            paymaster: pm.address,
        }
    }
    fs.writeFileSync(ADDRESS, JSON.stringify(currentAddress))
}

const updateABI = async () => {
    const contract = await ethers.getContract("Gasless")
    const file = contract.interface.format(ethers.utils.FormatTypes.json) as any
    fs.writeFileSync(ABI, file)
}

const updateFrontend = async () => {
        console.log("updating...")
        await updateConctracts()
        await updateABI()
}
updateFrontend.tags = ["all"]
export default updateFrontend

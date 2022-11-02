const { ethers, network } = require("hardhat")
const FEcontract = "C:/Users/user/Desktop/opensea/constants/networkMapping.json"
const AbiContract = "C:/Users/user/Desktop/opensea/constants/"
const fs = require("fs")

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("updating front-end")
        await updateContractAdd()
        await updateAbi()
    }
}

async function updateAbi() {
    const nftMarketplace = await ethers.getContract("Market")
    fs.writeFileSync(
        `${AbiContract}NftMarket.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )

    const basicNft = await ethers.getContract("NFT")
    fs.writeFileSync(
        `${AbiContract}BasicNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )
}
async function updateContractAdd() {
    const nftMarketplace = await ethers.getContract("Market")
    const chainId = network.config.chainId.toString()
    const contractAdd = JSON.parse(fs.readFileSync(FEcontract, "utf8"))
    if (chainId in contractAdd) {
        if (!contractAdd[chainId]["Market"].includes(nftMarketplace.address)) {
            contractAdd[chainId]["Market"].push(nftMarketplace.address)
        }
    } else {
        contractAdd[chainId] = { Market: nftMarketplace.address }
    }
    fs.writeFileSync(FEcontract, JSON.stringify(contractAdd))
}

module.exports.tags = ["all", "frontend"]

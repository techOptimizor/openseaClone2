const { getNamedAccounts, deployments, ethers, network } = require("hardhat")

const { verify } = require("../helper-functions")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    console.log("Begining deployments.....")
    const nft = await deploy("NFT", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: 1,
    })
    log(`NFT deployed at ${nft.address}`)
    const chainId = network.config.chainId
    //log(chainId)
    log(process.env.ETHERSCAN)
    if (chainId != 31337 && process.env.ETHERSCAN) {
        log("Verifying...")
        await verify(nft.address)
    }
}

module.exports.tags = ["all", "NFT", "main"]

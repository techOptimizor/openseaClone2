const { getNamedAccounts, ethers, network, deployments } = require("hardhat")
const { verify } = require("../helper-functions")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    log("Begining deployments--------")
    const Market = await deploy("Market", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: 1,
    })
    log(`Contract deployed to ${Market.address} 🥳🥳`)

    const chainId = network.config.chainId
    if (chainId != 31337 && process.env.ETHERSCAN) {
        log("Verifying...")
        await verify(NFT.address)
    }
}

module.exports.tags = ["all", "market"]

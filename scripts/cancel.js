const { ethers, getNamedAccounts } = require("hardhat")

async function cancel() {
    const { deployer } = await getNamedAccounts()
    const NFT = await ethers.getContract("NFT", deployer)
    const market = await ethers.getContract("Market", deployer)

    const tx = await market.cancelListing(NFT.address, 12)
    await tx.wait(1)
    console.log("canceled")
}

cancel()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

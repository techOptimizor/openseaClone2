const { ethers, getNamedAccounts } = require("hardhat")

async function mint() {
    const { deployer } = await getNamedAccounts()
    const AMOUNT = ethers.utils.parseEther("3")
    console.log("Minting begins now -----------------------------------")
    console.log(`Minting to your address ${deployer}`)
    const NFT = await ethers.getContract("NFT", deployer)
    const market = await ethers.getContract("Market", deployer)
    const mintNFT = await NFT.mint(deployer)
    const mintRp = await mintNFT.wait(1)
    const tokenId = mintRp.events[0].args.tokenId
    console.log(tokenId.toString())
    console.log("               ")
    console.log("Minted...🥳🥳")
    console.log("Approving.....")

    const approve = await NFT.approve(market.address, tokenId)
    await approve.wait(1)
    console.log("Listing....")

    const tx = await market.listItem(NFT.address, tokenId, AMOUNT)
    await tx.wait(1)
    console.log("listed")
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

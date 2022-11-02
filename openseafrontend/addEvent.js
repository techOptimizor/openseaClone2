//require("dotenv").config()

const Moralis = require("moralis/node")
//import Moralis from "moralis"
const contractAddresses = require("../constants/networkMapping.json")
require("dotenv").config()
let chainId = 31337
let MchainId = "1337"
const contractAddress = contractAddresses[chainId]["Market"]
const SERVERUrl = process.env.NEXT_PUBLIC_SERVERUrl

const APIKEY = process.env.NEXT_PUBLIC_APIKEY
const MASTERKEY = process.env.MASTERKEY
async function main() {
    await Moralis.start({ serverUrl: SERVERUrl, appId: APIKEY, masterKey: MASTERKEY })
    console.log(`working with contract address ${contractAddress}`)

    let nftListed = {
        chainId: MchainId,
        address: contractAddress,
        sync_historical: true,
        topic: "nftListed(address,address,uint256,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "nftListed",
            type: "event",
        },
        tableName: "ListedNFT",
    }

    let nftBought = {
        chainId: MchainId,
        address: contractAddress,
        sync_historical: true,
        topic: "nftBought(address,address,uint256,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftaddress",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "nftBought",
            type: "event",
        },
        tableName: "BoughtNFT",
    }
    let itemCanceledOptions = {
        chainId: MchainId,
        address: contractAddress,
        sync_historical: true,
        topic: "ItemCanceled(address,address,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "ItemCanceled",
            type: "event",
        },
        tableName: "CanceledNFT",
    }
    const listedResponse = await Moralis.Cloud.run("watchContractEvent", nftListed, {
        useMasterKey: true,
    })

    const boughtResponse = await Moralis.Cloud.run("watchContractEvent", nftBought, {
        useMasterKey: true,
    })

    const CanceledResponse = await Moralis.Cloud.run("watchContractEvent", itemCanceledOptions, {
        useMasterKey: true,
    })

    if (listedResponse.success && boughtResponse.success && CanceledResponse.success) {
        console.log("Sucess! Database updated with event")
    } else {
        console.log("something went wrong...❌❗🚫🚫")
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })

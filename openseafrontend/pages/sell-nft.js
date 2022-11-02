import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Form, useNotification } from "web3uikit"
import { ethers } from "ethers"
import nftAbi from "../../constants/BasicNft.json"
import contractAddresses from "../../constants/networkMapping.json"

import { useNetwork } from "wagmi"
import nftMarket from "../../constants/NftMarket.json"

export default function Home() {
    const { chain } = useNetwork()
    const chainId = chain.id
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const contractAddress = contractAddresses[chainId].Market
    const dispatch = useNotification()

    const handleListSucess = async () => {
        dispatch({
            type: "success",
            message: "NFT Listed",
            title: " Sell NFT",
            position: "topR",
        })
    }

    async function approveAndList(data) {
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseEther(data.data[2].inputResult).toString()
        console.log(price)

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const NFT = new ethers.Contract(nftAddress, nftAbi, signer)
        const Market = new ethers.Contract(contractAddress, nftMarket, signer)

        const Approve = await NFT.approve(contractAddress, tokenId)
        const tx = await Approve.wait(1)
        if (tx) {
            console.log("listing...")
            const list = await Market.listItem(nftAddress, tokenId, price)
            const listed = await list.wait(1)
            if (listed) {
                handleListSucess()
            }
        }
    }

    return (
        <div className={styles.container}>
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "NFT address",
                        type: "text",
                        inputwidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token Id",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price (ETH)",
                        type: "number",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell Your Minted NFT"
                id="Main Form"
            />
            HI! buy nft
        </div>
    )
}

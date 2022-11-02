import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarket from "../../constants/NftMarket.json"
import nftAbi from "../../constants/BasicNft.json"
import { ethers } from "ethers"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import UpdateListingModal from "../components/updateListing"

export default function NFTbox({ price, seller, tokenId, nftaddress, marketAddress }) {
    const [imageUrl, setImageUrl] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [modal, setModal] = useState(false)
    const hideModal = () => {
        setModal(false)
    }
    console.log(nftaddress)

    const { isConnected } = useAccount()
    const { address } = useAccount()
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const NFT = new ethers.Contract(nftaddress, nftAbi, signer)
    const Market = new ethers.Contract(marketAddress, nftMarket, signer)
    const dispatch = useNotification()

    // const { runContractFunction: getTokenURI } = useWeb3Contract({
    //     abi: nftAbi,
    //     contractAddress: nftaddress,
    //     functionName: "tokenURI",
    //     params: {
    //         tokenId: tokenId,
    //     },
    // })

    // console.log(tokenId)

    // const options = {
    //     abi: nftAbi,
    //     address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    //     function_name: "tokenURI",
    //     params: {
    //         tokenId: 1,
    //     },
    // }
    async function getTokenURI() {
        const tokenUrl = await NFT.tokenURI(tokenId)
        return tokenUrl
    }
    async function buyNFT() {
        const bought = await Market.buyItem(nftaddress, tokenId)
        const tx = bought.wait(1)
        return tx
    }

    async function updateUi() {
        const tokenUrl = await getTokenURI()

        if (tokenUrl) {
            const requestUrl = tokenUrl.replace("ipfs://", "http://ipfs.io/ipfs/")
            const tokenUrlRes = await (await fetch(requestUrl)).json()
            const imageURI = tokenUrlRes.image
            const imageUrl = imageURI.replace("ipfs://", "http://ipfs.io/ipfs/")
            setImageUrl(imageUrl)
            setTokenName(tokenUrlRes.name)
            setTokenDescription(tokenUrlRes.description)
        }
    }

    const handleBuySucess = async () => {
        dispatch({
            type: "success",
            message: "NFT Bought Sucessfully",
            title: "Buy Notification",
            position: "topR",
        })
    }

    useEffect(() => {
        if (isConnected) {
            updateUi()
        }
    }, [isConnected])

    const owner = seller == address.toLowerCase() || seller === undefined

    const showAdress = owner ? "You" : seller

    const handleClick = async () => {
        owner
            ? setModal(true)
            : async () => {
                  const tx = await buyNFT()
                  if (tx) {
                      handleBuySucess()
                  }
              }
    }

    return (
        <div>
            <div
                style={{
                    display: "flex",
                }}
            >
                {imageUrl ? (
                    <div
                        style={{
                            width: "400px",
                            paddingRight: "20px",
                            paddingBottom: "20px",
                        }}
                    >
                        <UpdateListingModal
                            isvisible={modal}
                            tokenId={tokenId}
                            marketAddress={marketAddress}
                            nftaddress={nftaddress}
                            onClose={hideModal}
                        />
                        <Card
                            title={tokenName}
                            description={tokenDescription}
                            tooltipText="Create and earn money from your own NFT Marketplace"
                            onClick={handleClick}
                        >
                            <div className="card">
                                <div>#{tokenId}</div>
                                <div
                                    style={{
                                        fontStyle: "italic",
                                    }}
                                >
                                    Owned by {showAdress}
                                </div>
                                <Image
                                    loader={() => imageUrl}
                                    src={imageUrl}
                                    height="200"
                                    width="200"
                                />
                                <div
                                    style={{
                                        fontStyle: "bold",
                                    }}
                                >
                                    Price {ethers.utils.formatEther(price)}ETH
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div>Loading....</div>
                )}
            </div>
        </div>
    )
}

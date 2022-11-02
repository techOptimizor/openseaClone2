import { useState } from "react"
import { Modal, Input, useNotification } from "web3uikit"
import { ethers } from "ethers"
//import nftAbi from "../../constants/BasicNft.json"
import nftMarket from "../../constants/NftMarket.json"

export default function UpdateListingModal({
    nftaddress,
    tokenId,
    isvisible,
    marketAddress,
    onClose,
}) {
    const [priceToUpdate, setPriceToUpdate] = useState(0)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const NFT = new ethers.Contract(marketAddress, nftMarket, signer)
    const dispatch = useNotification()

    const handleSucess = async () => {
        dispatch({
            type: "success",
            message: "listing Updated",
            title: " Refreash",
            position: "topR",
        })
        onClose && onClose()
        setPriceToUpdate("0")
    }

    async function update() {
        const tx = await NFT.updateListing(
            nftaddress,
            tokenId,
            ethers.utils.parseEther(priceToUpdate || "0")
        )
        const tc = await tx.wait(1)
        return tc
    }

    return (
        <Modal
            isVisible={isvisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={async () => {
                const tx = await update({})
                if (tx) {
                    handleSucess()
                }
            }}
        >
            <Input
                label="Update listing price"
                name="New listing price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdate(event.target.value)
                }}
            />
        </Modal>
    )
}

import styles from "../styles/Home.module.css"
import { useAccount } from "wagmi"

export default function Home() {
    const { address } = useAccount()
    const renderNFT = (ownerAddress) => {
        fetch(
            `https://api.opensea.io/api/v1/assets?owner=${ownerAddress}&order_direction=desc&offset=0&limit=30`,
            { method: "GET", headers: { Accept: "application/json" } }
        )
            .then((response) => response.json())
            .then(({ assets }) => {
                assets.map((attributes) => {
                    const { name } = attributes
                    return name
                })
            })
    }
    return (
        <div className={styles.container}>
            HI! buy nft
            {renderNFT(address)}
        </div>
    )
}

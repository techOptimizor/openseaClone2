import styles from "../styles/Home.module.css"
import { useMoralisQuery } from "react-moralis"
import NFTbox from "../components/NFTbox"
import { useAccount } from "wagmi"
import { useEffect, useState } from "react"

export default function Home() {
    const { isConnected } = useAccount()
    const [uiDisplay, setUiDisplay] = useState(false)
    const { data: listedNFTs, isFetching: fetchingListedNFTs } = useMoralisQuery(
        "ActiveItem",
        (query) => query.limit(10).descending("tokenId")
    )

    // if (isConnected) {
    //     setUiDisplay(true)
    // }

    return (
        <div className={styles.container}>
            <h1>Recently ListedNFTs</h1>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                }}
            >
                {isConnected ? (
                    fetchingListedNFTs ? (
                        <div>Loading...</div>
                    ) : (
                        listedNFTs.map((nft) => {
                            const { price, nftAddress, tokenId, seller, MarketAddres } =
                                nft.attributes

                            return (
                                <div>
                                    <NFTbox
                                        key={tokenId.toString()}
                                        price={price}
                                        seller={seller}
                                        tokenId={tokenId}
                                        nftaddress={nftAddress}
                                        marketAddress={MarketAddres}
                                    />
                                </div>
                            )
                        })
                    )
                ) : (
                    <h1>Connect to web3 wallet</h1>
                )}
            </div>
        </div>
    )
}

import { ConnectKitButton } from "connectkit"
import Link from "next/link"
import { useMoralis } from "react-moralis"
import { useAccount } from "wagmi"

export default function Header() {
    const { enableWeb3 } = useMoralis()
    const { isConnected } = useAccount()

    return (
        <nav>
            <div className="nav-bar">
                <h1>NFT MARKETPLACE</h1>
                <div className="nav-item">
                    <Link href="/">
                        <a className="link">Home</a>
                    </Link>
                    <Link href="/sell-nft">
                        <a className="link">Sell NFt</a>
                    </Link>
                    <div className="main">
                        <ConnectKitButton />
                        <div className="profile">
                            <Link href="/profile">
                                <a className="link">Profile</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )

    if (isConnected) {
        ;async () => {
            await enableWeb3()
        }
    }
}

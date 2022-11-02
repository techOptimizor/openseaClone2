Moralis.Cloud.afterSave("ListedNFT", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info("looking for confirmed Tx")

    if (confirmed) {
        logger.info("found item")
        const ActiveItem = Moralis.Object.extend("ActiveItem")

        const quary = new Moralis.Query(ActiveItem)
        quary.equalTo("MarketAddres", request.object.get("address"))
        quary.equalTo("nftAddress", request.object.get("nftAddress"))
        quary.equalTo("tokenId", request.object.get("tokenId"))
        quary.equalTo("seller", request.object.get("seller"))
        const alreadyListed = await quary.first()
        if (alreadyListed) {
            logger.info(`Deleting already listed`)
            await alreadyListed.destroy()
            logger.info(
                `deleting nft tokenId ${request.object.get(
                    "tokenId"
                )} at addrss ${request.object.get("address")} since is already listed`
            )
        }

        const activeItem = new ActiveItem()
        activeItem.set("MarketAddres", request.object.get("address"))
        activeItem.set("nftAddress", request.object.get("nftAddress"))
        activeItem.set("price", request.object.get("price"))
        activeItem.set("tokenId", request.object.get("tokenId"))
        activeItem.set("seller", request.object.get("seller"))

        logger.info(`Adding adrres ${request.object.get("address")}`)

        logger.info("Saving")
        await activeItem.save()
    }
})

Moralis.Cloud.afterSave("CanceledNFT", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(`Marketplace | object ${request.object}`)

    if (confirmed) {
        logger.info("getting item")
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const quary = new Moralis.Query(ActiveItem)
        quary.equalTo("MarketAddres", request.object.get("address"))
        quary.equalTo("nftAddress", request.object.get("nftaddress"))
        quary.equalTo("tokenId", request.object.get("tokenId"))

        logger.info(`Market place | Query ${quary}`)
        const CanceledItem = await quary.first()
        if (CanceledItem) {
            logger.info(
                `deleting nft tokenId ${request.object.get(
                    "tokenId"
                )} at addrss ${request.object.get("address")}`
            )
            await CanceledItem.destroy()
        } else {
            logger.info(
                `No item found with nft tokenId ${request.object.get(
                    "tokenId"
                )} at addrss ${request.object.get("address")}`
            )
        }
    }
})

Moralis.Cloud.afterSave("BoughtNFT", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(`Marketplace | object ${request.object}`)

    if (confirmed) {
        logger.info("getting item")
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const quary = new Moralis.Query(ActiveItem)
        quary.equalTo("MarketAddres", request.object.get("address"))
        quary.equalTo("nftAddress", request.object.get("nftaddress"))
        quary.equalTo("tokenId", request.object.get("tokenId"))

        logger.info(`Market place | Query ${quary}`)
        const BoughtItem = await quary.first()
        if (CanceledItem) {
            logger.info(
                `deleting nft tokenId ${request.object.get(
                    "tokenId"
                )} at addrss ${request.object.get("address")}`
            )
            await BoughtItem.destroy()
        } else {
            logger.info(
                `No item found with nft tokenId ${request.object.get(
                    "tokenId"
                )} at addrss ${request.object.get("address")}`
            )
        }
    }
})

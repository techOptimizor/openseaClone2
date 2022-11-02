// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
//Error variables
error Market_PriceMustBeAboveZero();
error Market_NotApprovedForMArketPlace();
error Market_AlreadyListed(address nftaddress, uint256 tokenId);
error Market_NotOwner();
error Market_NotListed(address nftAddress, uint256 tokenId);
error Market_PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error Market_NoProceeds();

contract Market is ReentrancyGuard {
    struct Listing {
        uint256 price;
        address seller;
    }
    mapping(address => mapping(uint256 => Listing)) private s_listing;
    //Sellers address to amount sold
    mapping(address => uint256) private s_proceeds;
    //Events
    event nftListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
    event nftBought(
        address indexed buyer,
        address indexed nftaddress,
        uint256 tokenId,
        uint256 price
    );
    event ItemCanceled(address indexed seller, address indexed nftAddress, uint256 indexed tokenId);

    //Modifiers
    modifier notListed(
        address nftaddress,
        uint256 tokenId,
        uint256 price
    ) {
        Listing memory listing = s_listing[nftaddress][tokenId];
        if (listing.price > 0) {
            revert Market_AlreadyListed(nftaddress, tokenId);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert Market_NotOwner();
        }
        _;
    }
    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listing[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert Market_NotListed(nftAddress, tokenId);
        }
        _;
    }

    /*
    *@notice Function for listing your NFT omt he market place
    *@param nftAddress: Address of thf the NFT
    *@param tokenId : the Token Id of the the NFT
    *@param price:  Sale price of the listed NFT

    */
    function listItem(
        address nftAdress,
        uint256 tokenId,
        uint256 price
    ) external notListed(nftAdress, tokenId, price) isOwner(nftAdress, tokenId, msg.sender) {
        if (price <= 0) {
            revert Market_PriceMustBeAboveZero();
        }
        IERC721 nft = IERC721(nftAdress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert Market_NotApprovedForMArketPlace();
        }
        s_listing[nftAdress][tokenId] = Listing(price, msg.sender);
        emit nftListed(msg.sender, nftAdress, tokenId, price);
    }

    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        nonReentrant
        isListed(nftAddress, tokenId)
    {
        Listing memory listing = s_listing[nftAddress][tokenId];
        if (msg.value < listing.price) {
            revert Market_PriceNotMet(nftAddress, tokenId, listing.price);
        }
        s_proceeds[listing.seller] = s_proceeds[listing.seller] + msg.value;
        delete (s_listing[nftAddress][tokenId]);
        IERC721(nftAddress).safeTransferFrom(listing.seller, msg.sender, tokenId);
        emit nftBought(msg.sender, nftAddress, tokenId, listing.price);
    }

    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete (s_listing[nftAddress][tokenId]);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newprice
    ) external isOwner(nftAddress, tokenId, msg.sender) isListed(nftAddress, tokenId) {
        s_listing[nftAddress][tokenId].price = newprice;
        emit nftListed(msg.sender, nftAddress, tokenId, newprice);
    }

    function withproceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert Market_NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool sucess, ) = payable(msg.sender).call{value: proceeds}("");
        require(sucess, "Transfar failed");
    }

    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listing[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }
}

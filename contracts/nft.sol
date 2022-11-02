// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    uint256 private tokencounter;
    string public constant TOKENURI =
        "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
    event minted(uint256 indexed tokenId);

    constructor() public ERC721("tony", "TNT") {
        tokencounter = 0;
    }

    function mint(address minter) public {
        _safeMint(minter, tokencounter);
        tokencounter++;
        emit minted(tokencounter);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Ouary for non-existance token");
        return TOKENURI;
    }

    function getTokenCounter() public view returns (uint256) {
        return tokencounter;
    }
}

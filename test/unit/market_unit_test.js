const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Market uint test", async function () {
          let market

          beforeEach(async () => {
              const { deployer } = await getNamedAccounts()
              const Market = await ethers.getContractFactory("Market")
              market = await Market.deploy()
              await market.deployed()
          })
          it("Should list item", async () => {
              const buy = market.listItem()
          })
      })

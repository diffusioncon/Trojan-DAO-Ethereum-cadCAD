import { ethers } from "@nomiclabs/buidler";
import chai from "chai";
import { deployContract, getWallets, solidity } from "ethereum-waffle";

import TrojanDaoArtifact from "../build/TrojanDao.json";
import TrojanPoolArtifact from "../build/TrojanPool.json";
import TrojanTokenArtifact from "../build/TrojanToken.json";
import { GuildBank } from "../typechain/GuildBank";
import { TrojanDao } from "../typechain/TrojanDao";
import { TrojanPool } from "../typechain/TrojanPool";
import { TrojanToken } from "../typechain/TrojanToken";

chai.use(solidity);

const { expect } = chai;

const deploymentConfig = {
  PERIOD_DURATION_IN_SECONDS: 17280,
  VOTING_DURATON_IN_PERIODS: 35,
  GRACE_DURATON_IN_PERIODS: 35,
  ABORT_WINDOW_IN_PERIODS: 5,
  PROPOSAL_DEPOSIT: 10,
  DILUTION_BOUND: 3,
  PROCESSING_REWARD: 1,
  TOKEN_SUPPLY: 10000
};

describe("Sparkle contract", function() {
  const provider = ethers.provider;
  let [wallet] = getWallets(provider);
  let trojan: TrojanDao;
  let trojanToken: TrojanToken;
  let trojanPool: TrojanPool;
  let guildBank: GuildBank;

  beforeEach(async () => {
    // @ts-ignore
    trojanToken = await deployContract(wallet, TrojanTokenArtifact);
    console.log("trojanToken: ", trojanToken.address);

    // TrojanDao constructor args
    // address summoner,
    // address _approvedToken,
    // uint256 _periodDuration,
    // uint256 _votingPeriodLength,
    // uint256 _gracePeriodLength,
    // uint256 _abortWindow,
    // uint256 _proposalDeposit,
    // uint256 _dilutionBound,
    // uint256 _processingReward
    // @ts-ignore
    trojan = await deployContract(wallet, TrojanDaoArtifact, [
      wallet.address,
      trojanToken.address,
      deploymentConfig.PERIOD_DURATION_IN_SECONDS,
      deploymentConfig.VOTING_DURATON_IN_PERIODS,
      deploymentConfig.GRACE_DURATON_IN_PERIODS,
      deploymentConfig.ABORT_WINDOW_IN_PERIODS,
      deploymentConfig.PROPOSAL_DEPOSIT,
      deploymentConfig.DILUTION_BOUND,
      deploymentConfig.PROCESSING_REWARD
    ]);
    console.log("trojan: ", trojan.address);

    // @ts-ignore
    trojanPool = await deployContract(wallet, TrojanPoolArtifact, [trojan.address]);
    console.log('trojanPool: ', trojanPool.address);

    await trojanToken.functions.setTrojanPool(trojanPool.address);

    // @ts-ignore
    guildBank = await trojan.functions.guildBank();
    expect(guildBank).to.be.properAddress;
  });

  describe("Trojan", function() {
    it("Deploys the Trojan contracts", async function() {
      const summoner = await trojan.functions.members(wallet.address);
      expect(summoner.exists).to.be.true;
      expect(summoner.shares).to.eq(1)
    });
  });
});

import { ethers } from "@nomiclabs/buidler";
import chai from 'chai';
import {createMockProvider, deployContract, getWallets, solidity} from 'ethereum-waffle';

import Sparkle from '../build/Sparkle.json';

chai.use(solidity);

const {expect} = chai;

describe("Sparkle contract", function() {
  const provider = ethers.provider;
  let [wallet] = getWallets(provider);
  let sparkle: any;

  beforeEach(async () => {
    sparkle = await deployContract(wallet, Sparkle);
  });

  describe("Deployment", function() {
    it("Should deploy with the right greeting", async function() {
      const supply = await sparkle.totalSupply()
      console.log('supply: ', supply);
    });
  });
});



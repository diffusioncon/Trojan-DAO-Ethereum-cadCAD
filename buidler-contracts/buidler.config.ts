import { task, usePlugin } from "@nomiclabs/buidler/config";
import waffleDefaultAccounts from "ethereum-waffle/dist/config/defaultAccounts";

usePlugin("@nomiclabs/buidler-ethers");
usePlugin("@nomiclabs/buidler-truffle5");

export default {
  paths: {
    artifacts: "./build"
  },
  networks: {
    buidlerevm: {
      accounts: waffleDefaultAccounts.map(acc => ({
        balance: acc.balance,
        privateKey: acc.secretKey
      }))
    }
  },
  solc: {
    version: "0.5.11",
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
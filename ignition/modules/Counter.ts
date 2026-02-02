import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CharityFundModule = buildModule("CharityFundModule", (m) => {
  const charityFund = m.contract("CharityFund");

  return { charityFund };
});

export default CharityFundModule;

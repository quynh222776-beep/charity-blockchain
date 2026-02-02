import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CharityFundModule", (m) => {
  const counter = m.contract("CharityFund");



  return { counter };
});

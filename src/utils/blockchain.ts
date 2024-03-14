import { ApiPromise, WsProvider } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import metadata from "./keyvault.json";
import { BN, BN_ONE, stringToU8a } from "@polkadot/util";
import { ContractOptions } from "@polkadot/api-contract/types";
import { WeightV2 } from "@polkadot/types/interfaces";
import { cryptoWaitReady } from "@polkadot/util-crypto";

const CONTRACT_ADDRESS = "bANapHsbnQoMrBR9786Xc4iGiT9UsvgongbYNYuwfdUgRJh";
const WS_PROVIDER = "wss://rpc.shibuya.astar.network";
const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
const PROOFSIZE = new BN(1_000_000);

// Utility function to create API and Contract instances
async function setupContract() {
  await cryptoWaitReady();
  const provider = new WsProvider(WS_PROVIDER);
  const api = await ApiPromise.create({ provider });
  const contract = new ContractPromise(api, metadata, CONTRACT_ADDRESS);
  return { api, contract };
}

// Generalized contract query function
async function queryContract(
  methodName: string,
  args: any[] = [],
  address: string = ""
) {
  const { api, contract } = await setupContract();

  try {
    const options: ContractOptions = {
      gasLimit: api.registry.createType("WeightV2", {
        refTime: MAX_CALL_WEIGHT,
        proofSize: PROOFSIZE,
      }) as unknown as WeightV2,
      storageDepositLimit: null,
    };

    const { result, output } = await contract.query[methodName](
      address,
      options,
      ...args
    );

    if (output && result.isOk) {
      return output.toHuman();
    } else {
      throw new Error(result.asErr.toString());
    }
  } finally {
    await api.disconnect();
  }
}

// Specific function to get entry count
export async function getEntryCount(address: string) {
  const count = await queryContract("getEntryCountByAccountId", [
    stringToU8a(address),
  ]);
  return parseInt(count as string); // Ensure proper conversion based on the actual return type
}

// async function getValue(k: number) {
//   const { result, output } = await contract.query.getValue("", options, k);
//   console.log(`------\ngetValue(${k})\n------`);

//   if (output && result.isOk) {
//     console.log("[toHuman] Value:", output.toHuman());
//     console.log("[toPrimitive] Value:", output.toPrimitive());
//   } else {
//     console.error("Error getting value:", result.asErr);
//   }
// }

// async function getAllValues() {
//   const { result, output } = await contract.query.getAllValues("", options);
//   console.log("------\ngetAllValues\n------");

//   if (output && result.isOk) {
//     console.log("[toHuman] Value:", output.toHuman());
//     console.log("[toPrimitive] Value:", output.toPrimitive());
//   } else {
//     console.error("Error getting value:", result.asErr);
//   }
// }

// await getValue(1);
// await getAllValues();

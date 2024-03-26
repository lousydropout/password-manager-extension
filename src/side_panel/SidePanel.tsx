import { FC, useEffect } from "react";
import { useFiniteStateMachine } from "../hooks/useFiniteStateMachine";
import { Heading } from "@chakra-ui/react";
import { useCurrentTab } from "../hooks/useCurrentTab";
import { useCryptoKeyManager } from "../hooks/useCryptoKey";
import { hash } from "../utils/encryption";
import { State, calculateNextState } from "./stateMachine";
import { Welcome } from "./Welcome";
import { Registration } from "./Registration";
import { AccountExists } from "./AccountExists";
import { Dashboard } from "./Dashboard";
import { useChromeStorageLocal } from "../hooks/useChromeLocalStorage";
import { Cred, decryptEntry, merge } from "../utils/credentials";
import { Encrypted } from "../utils/encryption";
import { queryData } from "../utils/smartContractQuery";

const SidePanel: FC = () => {
  const [_currentTab, currentUrl] = useCurrentTab();
  const [contextState, _updateContext, setState] = useFiniteStateMachine<State>(
    "CHECKING",
    calculateNextState
  );
  const [jwk, setJwk, _jwkHash, cryptoKey] = useCryptoKeyManager();
  const [encrypted, setEncrypted] = useChromeStorageLocal<Encrypted[]>(
    `encrypted`,
    []
  );
  const [creds, setCreds] = useChromeStorageLocal<Cred[]>("credentials", []);
  const [onChain, setOnChain] = useChromeStorageLocal<Cred[]>("onChain", []);

  const getNumOnChain = async (cryptoKey: CryptoKey) => {
    console.log("getNumOnChain");
    // If the user is not logged in or there are already entries on chain, return
    if (!contextState?.context.walletAddress) return;
    console.log("getNumOnChain");

    const num = (await queryData("get-entry-count", {
      accountId: contextState?.context.walletAddress,
    })) as number;

    // get and decrypt entries from on-chain
    if (num > creds.filter((cred) => cred.onChain).length) {
      const onChainEncrypted = (await queryData("get-entries", {
        accountId: contextState?.context.walletAddress,
        startIndex: 0,
        maxNum: 100,
      })) as Encrypted[];

      // decrypt onChain entries
      const _onChain: Cred[] = [];
      for (let curr = 0; curr < onChainEncrypted.length; curr++) {
        const entry = await decryptEntry(cryptoKey, onChainEncrypted[curr]);
        _onChain.push({ ...entry, onChain: true, curr });
      }

      console.log("onChain: ", _onChain, JSON.stringify(_onChain));
      console.log("creds: ", creds, JSON.stringify(creds));
      console.log("encrypted: ", encrypted, JSON.stringify(encrypted));

      setOnChain(_onChain);

      const merged = await merge(creds, _onChain);
      console.log("merged: ", merged, JSON.stringify(merged));
      setCreds(merged);
      setEncrypted(merged.map((cred) => cred.ciphertext as Encrypted));
    }
  };

  useEffect(() => {
    if (!cryptoKey) return;
    getNumOnChain(cryptoKey as CryptoKey);
  }, [contextState, cryptoKey]);

  // get encryption key hash
  useEffect(() => {
    console.debug("jwk: ", jwk);
    if (!jwk) return;

    const setJwkHash = async () => {
      const encryptionKeyHash = await hash(JSON.stringify(jwk));
      console.log({ encryptionKeyHash });
      setState("ACCOUNT_IMPORT_SUCCESS", { encryptionKeyHash });
    };
    setJwkHash();
  }, [jwk]);

  return (
    <>
      {contextState?.state === "CHECKING" && <Welcome />}
      {contextState?.state === "ACCOUNT_DOES_NOT_EXIST" && <Registration />}
      {contextState?.state === "ACCOUNT_EXISTS" && (
        <AccountExists setJwk={setJwk} contextState={contextState} />
      )}
      {contextState?.state === "LOGGED_IN" && (
        <Dashboard
          currentUrl={currentUrl as string}
          creds={creds}
          setCreds={setCreds}
          cryptoKey={cryptoKey as CryptoKey}
          encrypted={encrypted}
          setEncrypted={setEncrypted}
          jwk={jwk as JsonWebKey}
        />
      )}

      <Heading as={"pre"} fontSize={"medium"} mx={4} my={12} textAlign={"left"}>
        Context: {JSON.stringify(contextState, null, 4)}
      </Heading>
    </>
  );
};

export { SidePanel };

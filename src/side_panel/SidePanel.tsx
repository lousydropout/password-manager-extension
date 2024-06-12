import { FC, useEffect, useState } from "react";
import { useFiniteStateMachine } from "../hooks/useFiniteStateMachine";
import { Button, Heading } from "@chakra-ui/react";
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
  const [jwk, setJwk, _jwkHash, cryptoKey, generateKey] = useCryptoKeyManager();
  const [encrypted, setEncrypted] = useChromeStorageLocal<Encrypted[]>(
    `encrypted`,
    []
  );
  const [creds, setCreds] = useChromeStorageLocal<Cred[]>("credentials", []);
  const [onChain, setOnChain] = useChromeStorageLocal<Cred[]>("onChain", []);
  const [numOnChain, setNumOnChain] = useState<number>(-1);

  const getNumOnChain = async (cryptoKey: CryptoKey) => {
    // If the user is not logged in or there are already entries on chain, return
    if (!contextState?.context.walletAddress) return;
    if (
      contextState?.state !== "LOGGED_IN" &&
      contextState?.state !== "ON_CHAIN_UPDATE_IN_PROGRESS"
    ) {
      return;
    }

    const num = (await queryData("get-entry-count", {
      accountId: contextState?.context.walletAddress,
    })) as number;

    const updatedCreds: Cred[] = creds.map((cred) => ({
      ...cred,
      onChain: true,
    }));
    const maxNum = 100;
    console.log("[getNumOnChain] creds: ", creds);
    for (let curr = creds.length; curr < num; curr += maxNum) {
      const entries = (await queryData("get-entries", {
        accountId: contextState?.context.walletAddress,
        startIndex: curr,
        maxNum,
      })) as Encrypted[];

      console.log("[getNumOnChain] entries: ", entries);

      for (let i = 0; i < entries.length; i++) {
        const entry = await decryptEntry(cryptoKey, entries[i]);
        updatedCreds.push({ ...entry, onChain: true, curr: curr + i });
      }
    }
    setCreds(updatedCreds);
    setEncrypted(updatedCreds.map((cred) => cred.ciphertext as Encrypted));
  };

  const queryOnChainIfNeeded = async () => {
    await getNumOnChain(cryptoKey as CryptoKey);
  };

  useEffect(() => {
    if (!cryptoKey) return;
    getNumOnChain(cryptoKey as CryptoKey);
  }, [contextState, cryptoKey]);

  // get encryption key hash
  useEffect(() => {
    console.debug("jwk, contextState: ", jwk, contextState);
    if (!jwk) return;

    const setJwkHash = async () => {
      const encryptionKeyHash = await hash(JSON.stringify(jwk));
      console.error(
        "[setJwkHash] contextState: ",
        contextState,
        encryptionKeyHash
      );
      if (contextState?.state === "ACCOUNT_RESET") {
        _updateContext("ACCOUNT_RESET_REQUESTED", { encryptionKeyHash }, true);
      } else if (
        contextState?.state === "ACCOUNT_EXISTS" &&
        (contextState?.context?.correctKey ?? false)
      ) {
        console.log("ACCOUNT_IMPORT_SUCCESS");
        _updateContext("ACCOUNT_IMPORT_SUCCESS", { encryptionKeyHash }, false);
      }
    };
    setJwkHash();
  }, [jwk]);

  useEffect(() => {
    console.error("state: ", contextState?.state, contextState);
    if (contextState?.state === "ON_CHAIN_UPDATE_IN_PROGRESS") {
      console.error("ON_CHAIN_UPDATE_IN_PROGRESS");
      setCreds((_creds) =>
        _creds.map((_cred, i) => ({ ..._cred, onChain: i < numOnChain }))
      );
      setState("ON_CHAIN_UPDATE_SUCCESS", {});
      // _updateContext("ON_CHAIN_UPDATE_SUCCESS", {}, false);
    }
  }, [contextState]);

  return (
    <>
      {contextState?.state === "CHECKING" && <Welcome />}
      {contextState?.state === "ACCOUNT_DOES_NOT_EXIST" && <Registration />}
      {(contextState?.state === "ACCOUNT_EXISTS" ||
        contextState?.state === "ACCOUNT_IMPORT" ||
        contextState?.state === "ACCOUNT_RESET") && (
        <AccountExists
          setJwk={setJwk}
          contextState={contextState}
          generateKey={generateKey}
          setState={setState}
          currentUrl={currentUrl}
        />
      )}
      {(contextState?.state === "LOGGED_IN" ||
        contextState?.state === "ON_CHAIN_UPDATE_IN_PROGRESS") && (
        <Dashboard
          queryOnChainIfNeeded={queryOnChainIfNeeded}
          currentUrl={currentUrl as string}
          creds={creds}
          setCreds={setCreds}
          cryptoKey={cryptoKey as CryptoKey}
          encrypted={encrypted}
          setEncrypted={setEncrypted}
          jwk={jwk as JsonWebKey}
          contextState={contextState}
        />
      )}

      <Button
        onClick={() => {
          console.log("[contextState]: ", contextState);
          console.log("[encrypted]: ", encrypted);
          console.log("[creds]: ", creds);
          console.log("[onChain]: ", onChain);
        }}
      >
        Log states
      </Button>

      <Heading as={"pre"} fontSize={"medium"} mx={4} my={12} textAlign={"left"}>
        Context: {JSON.stringify(contextState, null, 4)}
      </Heading>
    </>
  );
};

export { SidePanel };

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
import { Cred } from "../utils/credentials";
import { Encrypted } from "../utils/encryption";

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
        />
      )}

      <Heading as={"pre"} fontSize={"medium"} mx={4} my={12} textAlign={"left"}>
        Context: {JSON.stringify(contextState, null, 4)}
      </Heading>
    </>
  );
};

export { SidePanel };

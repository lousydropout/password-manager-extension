import { FC, useEffect, useState } from "react";
import { useChromeStorageLocal } from "../hooks/useChromeLocalStorage";
import {
  Context,
  Message,
  useFiniteStateMachine,
} from "../hooks/useFiniteStateMachine";
import { Box, Heading, Text } from "@chakra-ui/react";
import { CustomButton } from "../components/CustomButton";
import { CustomInput } from "../components/CustomInput";
import { CredentialCard } from "../components/CredentialCard";
import { useCurrentTab } from "../hooks/useCurrentTab";
import { useCryptoKeyManager } from "../hooks/useCryptoKey";
import { hash } from "../utils/encryption";

const URL = "http://localhost:3000";
type State =
  | "CHECKING"
  | "ACCOUNT_DOES_NOT_EXIST"
  | "ACCOUNT_EXISTS"
  | "ACCOUNT_IMPORT"
  | "ACCOUNT_RESET"
  | "LOGGED_IN";

const calculateNextState = (
  currentContext: Context<State>,
  message: Message
): Context<State> => {
  console.log("(prevState, action): ", currentContext, message);

  if (message.action === "REQUEST_CONTEXT") {
    console.log("[REQUEST_CONTEXT]: ", currentContext, message);
    const result = { ...currentContext, action: "UPDATE_CONTEXT", send: true };
    console.log("[request context result] ", result);
    return result;
  }

  return {
    ...currentContext,
    context: { ...currentContext.context, ...message.data },
    send: false,
  };
};

const SidePanel: FC = () => {
  const [currentTab, currentUrl] = useCurrentTab();
  const [jwk, _cryptoKey, generateKeyHandler] = useCryptoKeyManager();
  const [loggedIn, setLoggedIn, hasLoadedLoggedIn] =
    useChromeStorageLocal<boolean>("loggedIn", false);
  // const [walletAddress, setWalletAddress, hasLoadedWalletAddress] =
  //   useChromeStorageLocal<string>("walletAddress", "");

  const [state, context, updateContext] = useFiniteStateMachine<State>(
    "CHECKING",
    calculateNextState
  );
  const [jwkHash, setJwkHash] = useState<string>("");

  // const [entryCount, _setEntryCount] = useChromeStorageLocal<number>(
  //   "entryCount",
  //   -1
  // );
  let jwkString;

  // useEffect(() => {
  //   // setWalletAddress("");
  //   console.log("wallet address: ", walletAddress);
  // }, [walletAddress]);

  // useEffect(() => {
  //   if (status === 'CHECKING' && )
  // }, [walletAddress, status])

  useEffect(() => {
    const hashJwk = async (jwkString: string) => {
      const _jwkHash = await hash(jwkString);
      setJwkHash(_jwkHash);
    };
    jwkString = JSON.stringify(jwk);
    hashJwk(jwkString);
  }, [jwk]);

  return (
    <>
      <Heading as={"h1"} my={12} textAlign={"center"}>
        Status: {state} | {jwkHash}
      </Heading>
      <Heading as={"h1"} my={12} textAlign={"center"}>
        Context: {JSON.stringify(context)}
      </Heading>
      {state === "CHECKING" && (
        <Box px={4} py={12} display={"flex"} flexDir={"column"} gap={4}>
          <Heading as={"h1"} mb={12}>
            Welcome to KeyVault!
          </Heading>
          <Heading as={"h3"} mb={8}>
            To get started with your password manager, please first connect your
            wallet.
          </Heading>
          <CustomButton
            colorScheme="accent"
            onClick={async () => {
              updateContext("testing", { random: "value" }, true);
            }}
          >
            Connect your wallet
          </CustomButton>
        </Box>
      )}
    </>
  );

  // return (
  //   <>
  //     <Heading as={"h1"} my={12} textAlign={"center"}>
  //       Status: {state} | {jwkString} | {jwkHash}
  //     </Heading>
  //     {state === "CHECKING" && (
  //       <Box px={4} py={12} display={"flex"} flexDir={"column"} gap={4}>
  //         <Heading as={"h1"} mb={12}>
  //           Welcome to KeyVault!
  //         </Heading>
  //         <Heading as={"h3"} mb={8}>
  //           To get started with your password manager, please first connect your
  //           wallet.
  //         </Heading>
  //         <CustomButton
  //           colorScheme="accent"
  //           onClick={async () => {
  //             // send to all tabs
  //             const tabs = await chrome.tabs.query({ title: "KeyVault" });
  //             const tabIds = tabs.map((tab) => tab.id);

  //             // if no tab has title of `KeyVault`, open one
  //             if (tabs.length === 0 || !tabIds.includes(currentTab?.id)) {
  //               const newTab = await chrome.tabs.create({
  //                 url: URL, // + "?num=1234",
  //               });
  //               tabs.push(newTab);
  //               console.log("new tab: ", newTab.id, newTab.url);
  //             }

  //             // send to all KeyVault tabs (nothing sensitive is ever sent)
  //             tabs.forEach(async (tab) => {
  //               console.log("sending to tab.id ", tab.id);
  //               if (typeof tab.id !== "number") return;

  //               await chrome.tabs.sendMessage(tab.id as number, {
  //                 type: "FROM_EXTENSION",
  //                 channelName: "state",
  //                 key: "testing",
  //                 value: "sending message from extension",
  //               });
  //             });
  //           }}
  //         >
  //           Connect your wallet
  //         </CustomButton>
  //       </Box>
  //     )}
  //     {state === "ACCOUNT_DOES_NOT_EXIST" && (
  //       <Box px={4} py={12} display={"flex"} flexDir={"column"} gap={4}>
  //         <Heading as={"h1"} mb={12}>
  //           Welcome to KeyVault!
  //         </Heading>
  //         <Heading as={"h3"} mb={8}>
  //           No account associated with your address was found.
  //         </Heading>
  //         <Text>
  //           You should be seeing the "Account Creation" page on the dApp. If
  //           not, please click on the button below.
  //         </Text>
  //         <CustomButton
  //           colorScheme="primary"
  //           onClick={() => chrome.tabs.create({ url: URL })}
  //         >
  //           Create a new account
  //         </CustomButton>
  //       </Box>
  //     )}
  //     {state === "ACCOUNT_EXISTS" && (
  //       <Box px={4} py={12} display={"flex"} flexDir={"column"} gap={4}>
  //         <Heading as={"h1"} mb={12}>
  //           Welcome to KeyVault!
  //         </Heading>
  //         <Heading as={"h3"} mb={8}>
  //           An account associated with your address was found.
  //         </Heading>
  //         <Text>
  //           You should be seeing the "Account Creation" page on the dApp. If
  //           not, please click on the button below.
  //         </Text>
  //         <CustomButton
  //           colorScheme="primary"
  //           onClick={() => {
  //             setContext("SET_STATE_TO_ACCOUNT_IMPORT");
  //           }}
  //         >
  //           Import my encryption key
  //         </CustomButton>
  //         <CustomButton
  //           colorScheme="warning"
  //           onClick={() => {
  //             chrome.tabs.create({ url: URL });
  //             setContext("SET_STATE_TO_ACCOUNT_RESET");
  //           }}
  //         >
  //           Reset my account!
  //         </CustomButton>
  //       </Box>
  //     )}

  //     {walletAddress === "" && (
  //       <Box px={4} py={12} display={"flex"} flexDir={"column"} gap={4}>
  //         <Heading as={"h1"} mb={12}>
  //           Welcome to KeyVault!
  //         </Heading>

  //         <Heading as={"h3"} mb={8}>
  //           I want to...
  //         </Heading>
  //         <CustomButton colorScheme="accent">
  //           create a new account!
  //         </CustomButton>
  //         <CustomButton colorScheme="secondary">reset my account</CustomButton>
  //         <CustomButton colorScheme="primary">import my account</CustomButton>
  //       </Box>
  //     )}

  //     {entryCount < 1 && (
  //       <Box px={4} py={12} display={"flex"} flexDir={"column"} gap={12}>
  //         <Heading as={"h1"}>Welcome to KeyVault!</Heading>
  //         <Text>
  //           URL: {currentUrl} | {currentTab?.id}
  //         </Text>
  //         <Text>JWK: {jwk ? JSON.stringify(jwk) : "Key not found"}</Text>
  //         <Text>Wallet address: {walletAddress}</Text>
  //         <CustomButton colorScheme="primary" onClick={generateKeyHandler}>
  //           Generate Key
  //         </CustomButton>
  //         <Box my={4}></Box>

  //         <CustomInput label={"Search"} />
  //         <CredentialCard />
  //         <CustomButton
  //           colorScheme={"accent"}
  //           onClick={() => chrome.tabs.create({ url: "https://google.com" })}
  //         >
  //           Create account
  //         </CustomButton>
  //         <CustomButton colorScheme={"secondary"}>Reset account</CustomButton>
  //         <CustomButton colorScheme={"primary"}>Import account</CustomButton>
  //         {/* <CustomButton colorScheme={"warning"}>Delete account</CustomButton> */}
  //       </Box>
  //     )}
  //   </>
  // );
};

export { SidePanel };

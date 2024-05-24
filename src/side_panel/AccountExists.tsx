import { Box, Heading, Text } from "@chakra-ui/react";
import { Dispatch, useState } from "react";
import { CustomButton } from "../components/CustomButton";
import { CustomTextArea } from "../components/CustomTextArea";
import { hash, importCryptoKey } from "../utils/encryption";
import { queryData } from "../utils/smartContractQuery";
import { State } from "./stateMachine";
import { Context } from "../hooks/useFiniteStateMachine";
import { URL } from "./url";
import { getHostname } from "../utils/getHostname";

export type AccountExistsProps = {
  setJwk: Dispatch<React.SetStateAction<JsonWebKey | null>>;
  contextState: Context<State>;
  setState: (action: string, data: Record<string, any>) => void;
  generateKey: () => Promise<void>;
  currentUrl: string | null;
};

export const AccountExists = ({
  setJwk,
  contextState,
  generateKey,
  currentUrl,
}: AccountExistsProps) => {
  const [importOrReset, setImportOrReset] = useState<
    "IMPORT" | "RESET" | undefined
  >();
  const [encKey, setEncKey] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | undefined>();
  const [importing, setImporting] = useState<boolean>(false);

  return (
    <Box px={4} py={12} display={"flex"} flexDir={"column"} gap={4}>
      <Heading textAlign={"center"} as={"h1"} mb={12}>
        We found a registered account associated with your address!
      </Heading>
      <Heading as={"h3"} mb={8}>
        To continue, you can either import your encryption key or reset your
        account using a new encryption key:
      </Heading>
      {(importOrReset === undefined || importOrReset === "RESET") && (
        <>
          <CustomButton
            colorScheme="primary"
            onClick={() => setImportOrReset("IMPORT")}
          >
            Import my encryption key
          </CustomButton>
          <CustomButton
            colorScheme="secondary"
            onClick={async () => {
              if (currentUrl !== getHostname(URL)) {
                await chrome.tabs.create({ url: URL });
              }
              setImportOrReset("RESET");
              await generateKey();
            }}
          >
            Reset my account
          </CustomButton>
        </>
      )}
      {importOrReset === "IMPORT" && (
        <>
          <CustomTextArea
            value={encKey}
            onChange={(e) => setEncKey(e.target.value)}
          />
          <Text
            fontSize={"large"}
            display={errorMsg === undefined ? "none" : "inline"}
            color="tomato"
          >
            Errors: {errorMsg}
          </Text>
          <CustomButton
            colorScheme="primary"
            isDisabled={importing}
            onClick={async () => {
              let _jwk;
              try {
                setImporting(true);
                _jwk = JSON.parse(encKey);
                await importCryptoKey(_jwk);
                const jwkString = JSON.stringify(
                  _jwk,
                  Object.keys(_jwk).sort()
                );
                const jwkStringHash = await hash(jwkString);
                const accountId = contextState?.context?.walletAddress;
                const encryptionKeyHash = await queryData(
                  "get-encryption-key-hash",
                  { accountId }
                );
                console.log(
                  "[CustomButton] encryptionKeyHash: ",
                  encryptionKeyHash
                );

                if (encryptionKeyHash && jwkStringHash !== encryptionKeyHash) {
                  setErrorMsg(
                    `The hash of the JWK you inputted (${jwkStringHash}) does not match the hash on record (${encryptionKeyHash}).`
                  );
                  return;
                }

                // updateContext(null, { encryptionKeyHash }, true);
                setJwk(_jwk);
              } catch (e) {
                setErrorMsg("Invalid encryption key");
                setImporting(false);
                return;
              }
            }}
          >
            Import encryption key
          </CustomButton>
        </>
      )}
    </Box>
  );
};

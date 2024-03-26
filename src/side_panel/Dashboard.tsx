import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Box, Heading } from "@chakra-ui/react";
import { CustomButton } from "../components/CustomButton";
import { NewCredsForm } from "../components/NewCredsForm";
import { Cred, addEntry } from "../utils/credentials";
import { Headers, View } from "../components/Headers";
import { Settings } from "../components/Settings";
import { Encrypted, decrypt } from "../utils/encryption";
import { Sync } from "../components/Sync";

export type DashboardProps = {
  currentUrl: string;
  creds: Cred[];
  setCreds: Dispatch<SetStateAction<Cred[]>>;
  cryptoKey: CryptoKey;
  encrypted: Encrypted[];
  setEncrypted: Dispatch<SetStateAction<Encrypted[]>>;
  jwk: JsonWebKey;
};

export const Dashboard = ({
  currentUrl,
  creds,
  setCreds,
  cryptoKey,
  encrypted,
  setEncrypted,
  jwk,
}: DashboardProps) => {
  const [view, setView] = useState<View>("All Credentials");

  const onSave = async (data: Cred) => {
    let entry: Cred = { ...data, onChain: false };
    const result = await addEntry(cryptoKey, creds, entry);
    setCreds(result);
  };
  const getCiphertexts = async () => {
    if (creds.length > encrypted.length) {
      setEncrypted(creds.map((cred) => cred.ciphertext as Encrypted));
    }
  };

  // get ciphertexts from creds and set them to encrypted
  useEffect(() => {
    console.log("creds: ", creds, "encrypted: ", encrypted);
    getCiphertexts();
  }, [creds]);

  // useEffect(() => {
  //   console.log("creds: ", creds, "encrypted: ", encrypted);
  //   getCiphertexts();
  // }, [creds]);

  // // get ciphertexts from creds and set them to encrypted
  // useEffect(() => {
  //   console.log("creds: ", creds, "encrypted: ", encrypted);
  //   getCiphertexts();
  // }, []);

  useEffect(() => {
    console.log("encrypted: ", encrypted);
  }, [encrypted]);

  // decrypt all remaining encrypted creds and set them to creds
  useEffect(() => {
    const decryptAll = async (from: number) => {
      const _creds: Cred[] = [];

      // assumption: encrypted.length >= creds.length ==>
      if (encrypted.length > creds.length) {
        for (let i = from; i < encrypted.length; i++) {
          _creds.push({
            ...JSON.parse(await decrypt(cryptoKey as CryptoKey, encrypted[i])),
            ciphertext: encrypted[i],
            onChain: true,
            curr: i,
            next: -1,
          });
        }
        setCreds((prev) => [...prev, ..._creds]);
      }
    };

    if (!cryptoKey || !creds) return;

    decryptAll(creds.length);
  }, [cryptoKey, encrypted, creds]);

  useEffect(() => {
    if (view === "Sync") {
      chrome.tabs.create({ url: "http://localhost:3000/sync" });
    }
  }, [view]);

  const toggleCredView = (prev: View) => {
    return prev === "Current Page" ? "All Credentials" : "Current Page";
  };

  return (
    <>
      <Headers setView={setView} />
      <Box px={4} py={12} display={"flex"} flexDir={"column"} gap={4}>
        <Heading as={"h3"} mb={8} textAlign={"center"}>
          {view}
        </Heading>

        {/* Add form for new passwords */}
        {view === "New Credential" && (
          <NewCredsForm
            onSave={onSave}
            currentUrl={currentUrl}
            toggleShow={() => {
              setView("All Credentials");
            }}
          />
        )}

        {view === "Settings" && (
          <Settings creds={creds} encrypted={encrypted} jwk={jwk} />
        )}

        {view === "Sync" && <Sync encrypted={encrypted} />}

        {(view === "Current Page" || view === "All Credentials") && (
          <CustomButton
            colorScheme="secondary"
            onClick={() => setView((prev) => toggleCredView(prev))}
          >
            See {view === "All Credentials" ? "current page's" : "all"}
          </CustomButton>
        )}

        <Heading fontSize={"medium"} as={"pre"}>
          Creds: {JSON.stringify(creds, null, 4)}
        </Heading>
      </Box>
    </>
  );
};

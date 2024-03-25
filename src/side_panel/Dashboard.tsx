import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Box, HStack, Heading } from "@chakra-ui/react";
import { CustomButton } from "../components/CustomButton";
import { NewCredsForm } from "../components/NewCredsForm";
import { Cred, addEntry } from "../utils/credentials";
import { Headers, View } from "../components/Headers";
import { Settings } from "../components/Settings";

export type DashboardProps = {
  currentUrl: string;
  creds: Cred[];
  setCreds: Dispatch<SetStateAction<Cred[]>>;
  cryptoKey: CryptoKey;
};

export const Dashboard = ({
  currentUrl,
  creds,
  setCreds,
  cryptoKey,
}: DashboardProps) => {
  const [view, setView] = useState<View>("All Credentials");

  const onSave = async (data: Cred) => {
    let entry: Cred = { ...data, onChain: false };
    const result = await addEntry(cryptoKey, creds, entry);
    setCreds(result);
  };

  const toggleCredView = (prev: View) => {
    return prev === "Current Page" ? "All Credentials" : "Current Page";
  };

  useEffect(() => {
    console.log("creds: ", creds);
  }, [creds]);

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

        {view === "Settings" && <Settings />}

        {(view === "Current Page" || view === "All Credentials") && (
          <CustomButton
            colorScheme="secondary"
            onClick={() => setView((prev) => toggleCredView(prev))}
          >
            See {view === "All Credentials" ? "current page's" : "all"}
          </CustomButton>
        )}

        <Heading fontSize={"medium"}>
          Creds: {JSON.stringify(creds, null, 2)}
        </Heading>
      </Box>
    </>
  );
};

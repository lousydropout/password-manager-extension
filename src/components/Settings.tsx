import { Box, Heading } from "@chakra-ui/react";
import { CustomButton } from "./CustomButton";
import { Cred } from "../utils/credentials";
import { Encrypted } from "../utils/encryption";

type SettingsProps = {
  creds: Cred[];
  encrypted: Encrypted[];
  jwk: JsonWebKey;
};

const download = (data: Record<string, any>, filename: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};

const logOut = async () => {
  await chrome.storage.local.clear();
  await chrome.storage.local.set({
    context: JSON.stringify({
      state: "CHECKING",
      action: "",
      context: {},
      send: false,
    }),
  });
};

const Settings = ({ creds, encrypted, jwk }: SettingsProps) => {
  return (
    <Box display={"flex"} flexDirection={"column"} justifyContent={"end"}>
      {/* encryption key */}
      <Heading as={"h3"} mt={8} mb={4} textAlign={"center"} fontSize={"large"}>
        Encryption key
      </Heading>
      <CustomButton
        py={4}
        colorScheme="accent"
        onClick={() => download(jwk, "encryption_key.json")}
      >
        Download encryption key
      </CustomButton>

      {/* credentials */}
      <Heading as={"h3"} mt={8} mb={4} textAlign={"center"} fontSize={"large"}>
        Credentials
      </Heading>
      <CustomButton
        py={4}
        colorScheme="primary"
        onClick={() => download(creds, "encrypted_credentials.json")}
      >
        Download credentials (encrypted version)
      </CustomButton>
      <CustomButton
        py={4}
        mt={4}
        colorScheme="secondary"
        onClick={() => download(encrypted, "encrypted_credentials.json")}
      >
        Download credentials (unencrypted version)
      </CustomButton>

      {/* log out */}
      <CustomButton mt={40} py={4} colorScheme="warning" onClick={logOut}>
        Log out
      </CustomButton>
    </Box>
  );
};

export { Settings };

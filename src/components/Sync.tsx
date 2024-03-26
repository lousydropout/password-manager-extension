import { Box, Heading } from "@chakra-ui/react";
import { Encrypted } from "../utils/encryption";
import { CustomButton } from "./CustomButton";
import { URL } from "../side_panel/url";

export type SyncProps = {
  encrypted: Encrypted[];
};

const Sync = ({ encrypted }: SyncProps) => {
  console.log("[sync] encrypted: ", encrypted, "length: ", encrypted.length);
  return (
    <Box px={4} py={12} display={"flex"} flexDir={"column"} gap={4}>
      <CustomButton
        colorScheme="primary"
        onClick={async () => await chrome.tabs.create({ url: `${URL}/sync` })}
      >
        Sync credentials to blockchain
      </CustomButton>
    </Box>
  );
};

export { Sync };

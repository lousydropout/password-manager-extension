import { Box, Heading } from "@chakra-ui/react";
import { CustomButton } from "./CustomButton";

const Settings = () => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"space-between"}
      minHeight={"100vh"}
    >
      <CustomButton
        py={4}
        colorScheme="warning"
        onClick={async () => {
          await chrome.storage.local.clear();
          await chrome.storage.local.set({
            context: JSON.stringify({
              state: "CHECKING",
              action: "",
              context: {},
              send: false,
            }),
          });
        }}
      >
        Log out
      </CustomButton>
    </Box>
  );
};

export { Settings };

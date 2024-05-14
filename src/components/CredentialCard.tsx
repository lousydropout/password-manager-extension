import { Box, HStack } from "@chakra-ui/react";
import { CustomInput } from "./CustomInput";
import { CustomButton } from "./CustomButton";
import { Cred } from "../utils/credentials";
import { CustomTextArea } from "./CustomTextArea";
import { useState } from "react";
import { CustomPasswordInput } from "./CustomPasswordInput";

const CredentialCard = ({ cred }: { cred: Cred }) => {
  const [credState, _setCredState] = useState<Cred>(cred);

  return (
    <Box
      border={"1px"}
      rounded={"md"}
      p={4}
      my={4}
      display={"flex"}
      flexDir={"column"}
      alignItems={"end"}
    >
      <CustomInput
        label={"username/email"}
        type="text"
        value={credState?.username || ""}
        onChange={(e) => _setCredState({ ...cred, username: e.target.value })}
        copyable={true}
      />
      <CustomPasswordInput
        label={"password"}
        value={credState?.password || ""}
        onChange={(e) => _setCredState({ ...cred, password: e.target.value })}
      />

      <CustomTextArea
        value={credState?.description || ""}
        label={"description"}
        onChange={(e) =>
          _setCredState({ ...cred, description: e.target.value })
        }
      />

      <Box my={4}></Box>
      <HStack>
        <CustomButton colorScheme={"accent"}>Update</CustomButton>
        <CustomButton colorScheme={"warning"}>Delete</CustomButton>
      </HStack>
    </Box>
  );
};

export { CredentialCard };

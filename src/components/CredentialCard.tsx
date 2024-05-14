import { Box, HStack } from "@chakra-ui/react";
import { CustomInput } from "./CustomInput";
import { CustomButton } from "./CustomButton";
import { Cred } from "../utils/credentials";
import { CustomTextArea } from "./CustomTextArea";
import { useState } from "react";

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
        // onChange={(e) => _setCredState({ ...cred, username: e.target.value })}
        copyable={true}
      />
      <CustomInput
        label={"password"}
        type="password"
        isPassword={true}
        value={credState?.password || ""}
        // onChange={(e) => _setCredState({ ...cred, password: e.target.value })}
      />

      <CustomTextArea
        value={credState?.description || ""}
        label={"description"}
        isReadOnly={true}
        onChange={
          () => {}
          // _setCredState({ ...cred, description: e.target.value })
        }
      />

      <Box my={4}></Box>
      <HStack>
        <CustomButton colorScheme={"accent"}>Edit</CustomButton>
        <CustomButton colorScheme={"warning"}>Delete</CustomButton>
      </HStack>
    </Box>
  );
};

export { CredentialCard };

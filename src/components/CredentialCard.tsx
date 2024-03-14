import { Box, HStack } from "@chakra-ui/react";
import { FC } from "react";
import { CustomInput } from "./CustomInput";
import { CustomButton } from "./CustomButton";

const CredentialCard: FC = () => {
  return (
    <Box
      border={"1px"}
      rounded={"md"}
      p={4}
      display={"flex"}
      flexDir={"column"}
      alignItems={"end"}
    >
      <CustomInput
        hasLabel={false}
        variant="unstyled"
        fontSize={"xl"}
        textAlign={"center"}
      />
      <Box my={4}></Box>
      <CustomInput label={"username/email"} type="text" />
      <CustomInput label={"password"} type="password" />
      <Box my={4}></Box>
      <HStack>
        <CustomButton colorScheme={"warning"}>Delete</CustomButton>
        <CustomButton colorScheme={"accent"}>Update</CustomButton>
      </HStack>
    </Box>
  );
};

export { CredentialCard };

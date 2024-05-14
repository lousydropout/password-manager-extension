import {
  Box,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { CustomInput } from "./CustomInput";
import { CustomButton } from "./CustomButton";
import { Cred } from "../utils/credentials";
import { CustomTextArea } from "./CustomTextArea";
import { useState } from "react";

const CredentialCard = ({ cred }: { cred: Cred }) => {
  const [credState, setCredState] = useState<Cred>(cred);
  const [mode, setMode] = useState<"latest" | "edit">("latest");
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
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
          isReadOnly={mode === "latest"}
          value={credState?.username || ""}
          onChange={(e) => setCredState({ ...cred, username: e.target.value })}
          copyable={true}
        />
        <CustomInput
          label={"password"}
          type="password"
          isPassword={true}
          isReadOnly={mode === "latest"}
          value={credState?.password || ""}
          onChange={(e) => setCredState({ ...cred, password: e.target.value })}
        />

        <CustomTextArea
          value={credState?.description || ""}
          label={"description"}
          isReadOnly={mode === "latest"}
          onChange={(e) =>
            setCredState({ ...cred, description: e.target.value })
          }
        />

        <Box my={4}></Box>
        <HStack>
          {mode === "latest" && (
            <>
              <CustomButton
                colorScheme={"accent"}
                onClick={() => setMode("edit")}
              >
                Edit
              </CustomButton>
              <CustomButton colorScheme={"warning"} onClick={onOpen}>
                Delete
              </CustomButton>
            </>
          )}
          {mode === "edit" && (
            <>
              <CustomButton colorScheme={"accent"}>Save</CustomButton>
              <CustomButton
                colorScheme={"warning"}
                onClick={() => {
                  setCredState(cred); // undoes changes
                  setMode("latest");
                }}
              >
                Cancel
              </CustomButton>
            </>
          )}
        </HStack>
      </Box>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          p={8}
          backgroundColor="hsl(262, 8%, 15%)"
          borderRadius={10}
        >
          <ModalHeader> </ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize={"x-large"} textAlign={"center"}>
            Are you sure you want to delete this credential?
          </ModalBody>

          <ModalFooter flexDir={"column"}>
            <CustomButton colorScheme={"accent"}>
              Yes, delete this credential.
            </CustomButton>
            <CustomButton
              mt={4}
              colorScheme={"warning"}
              onClick={() => {
                setCredState(cred); // undoes changes
                setMode("latest");
                onClose();
              }}
            >
              No, I changed my mind.
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export { CredentialCard };

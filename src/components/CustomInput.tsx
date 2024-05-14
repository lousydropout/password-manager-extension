import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react";
import { colors } from "../utils/colors";
import { CopyIcon } from "@chakra-ui/icons";
import { useState } from "react";

export interface CustomInputProps extends InputProps {
  value?: string;
  copyable?: boolean;
  leftText?: string;
  hasLabel?: boolean;
  label?: string;
  isReadOnly?: boolean;
  type?: string;
  variant?: "outline" | "unstyled" | "flushed" | "filled";
  required?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value = "",
  copyable = false,
  leftText = "",
  isReadOnly = false,
  variant = "filled",
  type = "text",
  hasLabel = true,
  label,
  ...rest
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const handleCopyInput = () => {
    navigator.clipboard.writeText(value);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 1000);
  };

  return (
    <FormControl>
      {hasLabel && <FormLabel m={2}>{label}</FormLabel>}
      <InputGroup>
        {leftText && (
          <InputLeftAddon
            bgColor={colors.secondary._active.bg}
            border={"hidden"}
          >
            {leftText}
          </InputLeftAddon>
        )}
        <Input
          value={value}
          variant={variant}
          type={type}
          bgColor={"transparent"}
          _hover={{ bgColor: "transparent" }}
          _active={{ bgColor: "transparent" }}
          ringColor={colors.secondary.bg}
          borderColor={colors.secondary.bg}
          focusBorderColor={colors.primary.bg}
          disabled={isReadOnly}
          pl={2}
          {...rest}
        />
        {copyable && (
          <>
            <InputRightElement
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"center"}
              gap={1}
            >
              <Button
                size="md"
                backgroundColor={"transparent"}
                onClick={handleCopyInput}
                _hover={{ backgroundColor: "transparent" }}
                _focus={{ outline: "none" }}
                _focusVisible={{
                  outline: "none",
                  backgroundColor: "purple.600",
                }}
              >
                <CopyIcon color={"purple.200"} />
              </Button>
            </InputRightElement>
            {showTooltip && (
              <Box
                position="absolute"
                top="-40%"
                right="0"
                bg="purple.800"
                color="white"
                p={2}
                borderRadius="md"
                fontSize="sm"
              >
                Copied!
              </Box>
            )}
          </>
        )}
      </InputGroup>
    </FormControl>
  );
};

export { CustomInput };

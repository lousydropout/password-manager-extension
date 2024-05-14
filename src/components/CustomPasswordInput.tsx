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
import { useState } from "react";
import { CopyIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export interface CustomPasswordInputProps extends InputProps {
  leftText?: string;
  hasLabel?: boolean;
  label?: string;
  isReadOnly?: boolean;
  value?: string;
  variant?: "outline" | "unstyled" | "flushed" | "filled";
  required?: boolean;
}

const CustomPasswordInput: React.FC<CustomPasswordInputProps> = ({
  leftText = "",
  value = "",
  isReadOnly = false,
  variant = "filled",
  hasLabel = true,
  label,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(value);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 1000);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
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
          variant={variant}
          type={showPassword ? "text" : "password"}
          bgColor={"transparent"}
          _hover={{ bgColor: "transparent" }}
          _active={{ bgColor: "transparent" }}
          ringColor={colors.secondary.bg}
          borderColor={colors.secondary.bg}
          focusBorderColor={colors.primary.bg}
          disabled={isReadOnly}
          pl={2}
          value={value}
          {...rest}
        />
        <InputRightElement
          display={"flex"}
          justifyContent={"flex-end"}
          alignItems={"center"}
          gap={1}
        >
          <Button
            size="md"
            backgroundColor={"transparent"}
            onClick={handleTogglePassword}
            _hover={{ backgroundColor: "transparent" }}
            _focus={{ outline: "none" }}
            _focusVisible={{
              outline: "none",
              backgroundColor: "purple.600",
            }}
          >
            {showPassword ? (
              <ViewIcon color={"purple.200"} />
            ) : (
              <ViewOffIcon color={"purple.200"} />
            )}
          </Button>
          <Button
            size="md"
            backgroundColor={"transparent"}
            onClick={handleCopyPassword}
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
      </InputGroup>
    </FormControl>
  );
};

export { CustomPasswordInput };

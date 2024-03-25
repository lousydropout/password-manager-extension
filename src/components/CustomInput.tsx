import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputProps,
} from "@chakra-ui/react";
import { colors } from "../utils/colors";

export interface CustomInputProps extends InputProps {
  leftText?: string;
  hasLabel?: boolean;
  label?: string;
  isReadOnly?: boolean;
  type?: string;
  variant?: "outline" | "unstyled" | "flushed" | "filled";
  required?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  leftText = "",
  isReadOnly = false,
  variant = "filled",
  type = "text",
  hasLabel = true,
  label,
  ...rest
}) => {
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
      </InputGroup>
    </FormControl>
  );
};

export { CustomInput };

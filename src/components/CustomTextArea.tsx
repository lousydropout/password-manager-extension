import { Textarea } from "@chakra-ui/react";
import { colors } from "../utils/colors";
import { ChangeEventHandler } from "react";

export type CustomTextAreaProps = {
  isReadOnly?: boolean;
  variant?: "outline" | "unstyled" | "flushed" | "filled";
  placeholder?: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
};

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  isReadOnly = false,
  variant = "filled",
  placeholder,
  onChange,
}) => {
  return (
    <Textarea
      variant={variant}
      bgColor="transparent"
      _hover={{ bgColor: "transparent" }}
      _active={{ bgColor: "transparent" }}
      ringColor={colors.secondary.bg}
      borderColor={colors.secondary.bg}
      focusBorderColor={colors.primary.bg}
      disabled={isReadOnly}
      pl={2}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export { CustomTextArea };

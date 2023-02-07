import { useClipboard } from "@mantine/hooks";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Button, ButtonProps } from "./Button";

export interface CopyButtonProps extends ButtonProps<"button"> {
  value: string;
}

export function CopyButton({ value, children, ...props }: CopyButtonProps) {
  const { copy, copied, error } = useClipboard();

  useEffect(() => {
    if (copied) {
      toast.success("Copied to clipboard");
    }
  }, [copied]);

  useEffect(() => {
    if (error) {
      toast.error("Could not copy value");
    }
  }, [error]);

  return (
    <Button
      {...props}
      onClick={() => {
        copy(value);
      }}
    >
      {copied ? <IconCheck size={16} /> : children}
    </Button>
  );
}

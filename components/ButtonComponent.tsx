import React from "react";
import { Button } from "./ui/button";

interface ButtonProps {
  onclick: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  classname?: string;
  variant?: "primary" | "secondary" | "default" | "ghost";
  title?: string;
  loading?: boolean;
  loadingtitle?: string;
  disabled?: boolean;
  children?: React.ReactNode; // <-- add this line
}

const ButtonComponent = ({
  onclick,
  classname,
  variant,
  title,
  loading,
  loadingtitle,
  disabled,
  children,
}: ButtonProps) => {
  return (
    <Button
      variant={variant}
      className={classname}
      onClick={onclick}
      disabled={disabled}
    >
      {children ?? (!loading ? title : loadingtitle)}
    </Button>
  );
};

export default ButtonComponent;

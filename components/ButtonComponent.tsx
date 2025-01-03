import React from "react";
import { Button } from "./ui/button";

interface ButtonProps {
  onclick: () => void;
  classname?: string;
  variant?: "primary" | "secondary" | "default" | "ghost";
  title: string;
  loading?: boolean;
  loadingtitle?: string;
  // additional props to pass to the button component, e.g., disabled, href, etc.
}
const ButtonComponent = ({
  onclick,
  classname,
  variant,
  title,
  loading,
  loadingtitle,
}: ButtonProps) => {
  return (
    <Button variant={variant} className={classname} onClick={onclick}>
      {!loading ? title : loadingtitle}
    </Button>
  );
};

export default ButtonComponent;

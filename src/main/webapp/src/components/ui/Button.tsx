import { FC, ReactNode } from "react";
import cn from "classnames";

interface Props {
  children: string | ReactNode;
  onClick: VoidFunction;
  type: "secondary" | "tertiary";
  size: "medium" | "small";
  loading?: boolean;
  label?: string;
  disabled?: boolean;
}
export const Button: FC<Props> = ({
  onClick,
  loading,
  type,
  size,
  children,
  label,
  disabled,
}) => {
  const onButtonClick = () => {
    if (loading || disabled) {
      return;
    }
    onClick();
  };
  return (
    <button
      className={cn("button", `button-${type}`, `p-${size}`, {
        "button-loading": loading,
        "button-small": size === "small",
      })}
      type="button"
      onClick={onButtonClick}
      aria-label={label}
      disabled={disabled || loading}
    >
      {children}
    </button>
  );
};

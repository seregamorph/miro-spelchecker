import { FC } from "react";
import cn from "classnames";
import { Button } from "../ui/Button";

interface Props {
  onClick: VoidFunction;
  isSettingsShown: boolean;
  className?: string;
}
export const SettingsButton: FC<Props> = ({
  onClick,
  isSettingsShown,
  className,
}) => {
  return (
    <p className={cn("centered", className)}>
      <Button
        onClick={onClick}
        type="secondary"
        size="small"
        label="Show settings menu"
      >
        <span
          className={cn("ch-cursor-pointer", "icon", {
            "icon-settings": !isSettingsShown,
            "icon-card-list": isSettingsShown,
          })}
        />
      </Button>
    </p>
  );
};

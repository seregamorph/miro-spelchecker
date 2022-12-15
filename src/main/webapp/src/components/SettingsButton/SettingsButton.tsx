import { FC } from "react";
import cn from "classnames";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon/Icon";

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
        label={isSettingsShown ? "Hide settings menu" : "Show settings menu"}
      >
        <Icon icon={isSettingsShown ? "card-list" : "settings"} />
      </Button>
    </p>
  );
};

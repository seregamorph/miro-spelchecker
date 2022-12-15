import { FC } from "react";
import cn from "classnames";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon/Icon";

interface Props {
  onClick: VoidFunction;
  loading?: boolean;
  className?: string;
}
export const RefreshButton: FC<Props> = ({ loading, className, onClick }) => {
  return (
    <p className={cn("centered", className)}>
      <Button
        onClick={onClick}
        loading={loading}
        type="secondary"
        size="small"
        label="Refresh spelling suggestions"
      >
        <Icon icon="refresh" />
      </Button>
    </p>
  );
};

import { FC } from "react";
import cn from "classnames";
import { Button } from "./ui/Button";
import { VoidFn } from "../utils/common";

interface Props {
  onClick: VoidFn;
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
        <span className="icon icon-refresh cursor-pointer" />
      </Button>
    </p>
  );
};

import { FC } from "react";
import cn from "classnames";
import { Button } from "../ui/Button";
import styles from "./RefreshButton.module.css";

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
        <span className={cn("icon", "icon-refresh", styles.icon)} />
      </Button>
    </p>
  );
};

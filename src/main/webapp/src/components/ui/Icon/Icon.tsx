import { FC } from "react";
import cn from "classnames";
import styles from "./Icon.module.css";

interface Props {
  icon: "refresh" | "comment-feedback" | "settings" | "card-list";
}
export const Icon: FC<Props> = ({ icon }) => {
  return <span className={cn("icon", `icon-${icon}`, styles.icon)} />;
};

import {FC, ReactNode} from "react";
import cn from "classnames";
import styles from "./StatusWrapper.module.css";

interface Props {
    className: string;
    isLoading: boolean;
    isError: boolean;
    count: number;
    children: ReactNode;
}
export const StatusWrapper: FC<Props> = ({isError, isLoading, count, children, className}) => {
    if (isLoading) {
        return <p className={cn("centered", "p-medium", styles.subtext, className)}>
            Checking the elements...
        </p>;
    }

    if (isError) {
        return <p className={cn("centered", "p-medium", styles.danger, className)}>
            Something went wrong, please try again
        </p>;
    }

    if (!count) {
        return <p className={cn("centered", "p-medium", styles.subtext, className)}>
            No errors found
        </p>;
    }

    return <>{children}</>;
};
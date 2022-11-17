import {FC, ReactNode} from "react";
import cn from 'classnames'
import styles from './List.module.css';

interface Props {
    children: ReactNode;
    className?: string;
}
export const List: FC<Props> = ({className, children}) => {
    return <ul className={cn(className, styles.list)}>{children}</ul>
}

import {FC} from "react";
import { SpellCheckResult } from "../../utils/api";
import styles from './ContentHighlights.module.css';

interface Props {
    check: SpellCheckResult;
    children: string;
}
export const ContentHighlights: FC<Props> = ({ check, children }) => {
    const start = children.slice(0, check.fromPos);
    const message = children.slice(check.fromPos, check.toPos);
    const end = children.slice(check.toPos);
    return <>
        <span>{start}</span>
        <span className={styles.highlight}>{message}</span>
        <span>{end}</span>
    </>
}
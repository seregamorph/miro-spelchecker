import {FC} from "react";
import styles from './ContentHighlights.module.css';

interface Props {
    highlight: string;
    children: string;
}
export const ContentHighlights: FC<Props> = ({ highlight, children }) => {
    const parts = children.split(highlight);
    return <>{parts.map((part, index) => <span key={index}>{index ? <span className={styles.highlight}>{highlight}</span> : null}{part}</span>)}</>
}
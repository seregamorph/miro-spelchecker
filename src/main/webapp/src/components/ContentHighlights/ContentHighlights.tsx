import { FC } from "react";
import { SpellCheckResult } from "../../utils/api";
import styles from "./ContentHighlights.module.css";

const MAX_SURROUNDED_PART_LENGTH = 10;
const ELLIPSIS_SYMBOL = "...";

interface Props {
  check: SpellCheckResult;
  children: string;
  replaced?: boolean;
}
export const ContentHighlights: FC<Props> = ({ check, replaced, children }) => {
  if (replaced) {
    return <span className={styles.text}>{children}</span>;
  }
  const start = children.slice(0, check.fromPos);
  const trimmedStart =
    start.length > MAX_SURROUNDED_PART_LENGTH
      ? `${ELLIPSIS_SYMBOL}${start
          .slice(start.length - MAX_SURROUNDED_PART_LENGTH)
          .trim()}`
      : start;
  const message = children.slice(check.fromPos, check.toPos);
  const end = children.slice(check.toPos);
  const trimmedEnd =
    end.length > MAX_SURROUNDED_PART_LENGTH
      ? `${end.slice(0, MAX_SURROUNDED_PART_LENGTH).trim()}${ELLIPSIS_SYMBOL}`
      : end;

  return (
    <>
      <span className={styles.text}>{trimmedStart}</span>
      <span className={styles.highlight} title={check.message}>
        {message}
      </span>
      <span className={styles.text}>{trimmedEnd}</span>
    </>
  );
};

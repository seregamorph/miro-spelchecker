import { FC } from "react";
import { SpellCheckResult } from "../../utils/api";
import styles from "./ContentHighlights.module.css";

interface Props {
  check: SpellCheckResult;
  replaced?: boolean;
}
export const ContentHighlights: FC<Props> = ({ check, replaced }) => {
  const text = check.plainText;

  if (replaced) {
    return <span className={styles.text}>{text}</span>;
  }
  const fromPos = check.fromPosPlain;
  const toPos = check.toPosPlain;
  const start = text.slice(0, fromPos);
  const message = text.slice(fromPos, toPos);
  const end = text.slice(toPos);

  return (
    <>
      <span className={styles.text}>{start}</span>
      <span className={styles.highlight} title={check.message}>
        {message}
      </span>
      <span className={styles.text}>{end}</span>
    </>
  );
};

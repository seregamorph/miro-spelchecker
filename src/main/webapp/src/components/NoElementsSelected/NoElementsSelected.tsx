import {FC} from "react";
import {Button} from "../ui/Button";
import styles from './NoElementsSelected.module.css';

interface Props {
    onSwitch: () => void;
}
export const NoElementsSelected: FC<Props> = ({ onSwitch }) => {
    return (<>
            <p className="p-medium">
                Nothing is selected on the board
            </p>
            <p className={styles.container}>
                <Button onClick={onSwitch} type="secondary" size="medium">Check all elements</Button>
            </p>
    </>)
}
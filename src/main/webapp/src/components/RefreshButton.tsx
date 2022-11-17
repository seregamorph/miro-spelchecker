import {FC} from "react";
import cn from 'classnames';
import {Button} from "./ui/Button";

interface Props {
    onClick: () => void;
    isLoading?: boolean;
    className?: string;
}
export const RefreshButton: FC<Props> = ({ isLoading,className,onClick}) => {
    return (<p className={cn("centered", className)}>
            <Button onClick={onClick} isLoading={isLoading} type="secondary" size="medium">Refresh</Button>
        </p>
   )
}
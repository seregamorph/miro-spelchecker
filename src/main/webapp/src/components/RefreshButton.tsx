import {FC} from "react";
import cn from "classnames";
import {Button} from "./ui/Button";
import {VoidFn} from "../utils/common";

interface Props {
    onClick: VoidFn;
    isLoading?: boolean;
    className?: string;
}
export const RefreshButton: FC<Props> = ({ isLoading,className,onClick}) => {
    return (<p className={cn("centered", className)}>
            <Button onClick={onClick} isLoading={isLoading} type="secondary" size="small">
                <span className="icon icon-refresh cursor-pointer" />
            </Button>
        </p>
   );
};
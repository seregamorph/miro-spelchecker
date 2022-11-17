import { FC } from 'react';
import cn from 'classnames';
import { Tab as TabModel } from '../../../types';

interface Props {
    tab: TabModel;
    active?: boolean;
    onSelect: (tabId: string) => void;
}

export const Tab: FC<Props> = ({tab: {id, label, badge}, active, onSelect}) => {
    const onClick = () => {
        onSelect(id);
    }
    const hasBadge = Boolean(badge);
    const badgeProp = hasBadge ? {'data-badge': badge} : {};
    return (<div tabIndex={0} className={cn('tab', {'tab-active': active})} onClick={onClick}>
        <div className={cn('tab-text', {'tab-badge': hasBadge})} {...badgeProp}>{label}</div>
    </div>)
}
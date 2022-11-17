import {Tab} from "../types";

export const getTabs = (total: number, selected: number): Tab[] => {
    return [
        {
            id: 'selected',
            label: 'Selected elements',
            badge: selected
        },
        {
            id: 'total',
            label: 'Board checks',
            badge: total
        }
    ]
}
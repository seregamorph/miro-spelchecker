import {Tab} from "../types";

export const getTabs = (): Tab[] => {
    return [
        {
            id: 'selected',
            label: 'Selected elements'
        },
        {
            id: 'total',
            label: 'Board checks'
        }
    ]
}
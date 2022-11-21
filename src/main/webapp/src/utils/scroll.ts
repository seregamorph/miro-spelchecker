const GRID_GAP_SIZE = 8;

export const getHeightShift = (...elements: (HTMLDivElement | null)[]) => {
    const count = elements.length;
    const elementsHeight = elements.reduce((acc, element) => {
        const elementHeight = element?.getBoundingClientRect().height || 0;
        return acc + elementHeight;
    }, 0);

    return elementsHeight + GRID_GAP_SIZE * count;
}

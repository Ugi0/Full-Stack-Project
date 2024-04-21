

export const defaultViewSize = (type, size) => {
    switch (type) {
        case 0:
            if (size === 2) return [815, 400]
            if (size === 1) return [815, 200]
            if (size === 0) return [400, 200]
            break;
        case 1:
            if (size === 0) return [800, 400]
            break;
        case 2:
            if (size === 0) return [800, 200]
            if (size === 1) return [800, 300]
            if (size === 2) return [800, 300]
            break;
        case 3:
            if (size === 0) return [300, 100]
            if (size === 1) return [300, 100]
            break;
        default:
            throw new Error("Not a valid view")
    }
}
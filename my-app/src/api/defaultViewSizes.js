

export const defaultViewSize = (type, size) => {
    console.log(type, size)
    switch (type) {
        case 0:
            if (size === 2) return [815, 400]
            if (size === 1) return [815, 200]
            if (size === 0) return undefined
            break;
        default:
            throw new Error("Not a valid view")
    }
}
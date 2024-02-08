
export const toPriority = (value) => {
    switch (value) {
        case 0:
            return "Lowest"
        case 1:
            return "Low"
        case 2:
            return "Medium"
        case 3:
            return "High"
        case 4:
            return "Urgent"
        default:
            throw new Error("Not a valid priority value.")
    }
}

export const fromPriority = (value) => {
    switch (value) {
        case "Lowest":
            return 0
        case "Low":
            return 1
        case "Medium":
            return 2
        case "High":
            return 3
        case "Urgent":
            return 4
        default:
            throw new Error("Not a valid priority value.")
    }
}
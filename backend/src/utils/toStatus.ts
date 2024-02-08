
export const toStatus = (value) => {
    switch (value) {
        case 0: 
            return "Not started"
        case 1: 
            return "In progress"
        case 2: 
            return "Stopped"
        case 3: 
            return "Delayed"
        case 4: 
            return "Done"
        default:
            throw new Error("Not a valid status code.")
    }
}

export const fromStatus = (value) => {
    switch (value) {
        case "Not started": 
            return 0
        case "In progress": 
            return 1
        case "Stopped": 
            return 2
        case "Delayed": 
            return 3
        case "Done": 
            return 4
        default:
            throw new Error("Not a valid status code.")
    }
}
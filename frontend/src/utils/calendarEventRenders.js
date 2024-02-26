
export function getCalendarWeekRenders(type) {
    switch (type) {
        case 'lectures':
            return ["title", "icon", "time", "duration"]
        case 'assignments':
        case 'projects':
            return ["title", "icon"]
        case 'events':
        case 'exams':
            return ["title", "icon", "time"]
        default:
            throw new Error("Not a valid type")
    }
}

export function getCalendarMonthRenders(type) {
    switch (type) {
        case 'lectures':
        case 'assignments':
        case 'projects':
        case 'events':
        case 'exams':
            return ["title"]
        default:
            throw new Error("Not a valid type")
    }
}
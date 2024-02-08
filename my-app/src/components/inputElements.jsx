
export const titleInput = (handleChange) => {
    return (
        <div>
            <p>Title</p>
            <input id="title" onChange={(e) => handleChange(e.target.value)} />
        </div>
    )
}

export const descriptionInput = (handleChange) => {
    return (
        <div>
            <p>Description</p>
            <textarea id="description" onChange={(e) => handleChange(e.target.value)} />
        </div>
    )
}

export const getEventCount = (events, curDate) => {
    let count = 0;
    for (const [key, value] of Object.entries(events)) {
        count += [...value.values()]
            .filter((e) => {
                return new Date(e.time.split("T")[0]).toDateString() === curDate
            })
            .length
    }
    return count;
}

export const getAsList = (events, curDate) => {
    let res = [];
    return res.concat([...events.values()]
        .filter((e) => {
            return new Date(e.time.split("T")[0]).toDateString() === curDate
        }))
        .sort((a,b) => new Date(a.time) - new Date(b.time))
}
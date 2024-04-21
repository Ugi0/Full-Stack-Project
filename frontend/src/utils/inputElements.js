
export const titleInput = (handleChange) => {
    return (
        <div className="modalGroup">
            <p className="modalGroupTitle">Title</p>
            <input id="title" onChange={(e) => handleChange(e.target.value)} />
        </div>
    )
}

export const descriptionInput = (handleChange) => {
    return (
        <div className="modalGroup">
            <p className="modalGroupTitle">Description</p>
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
    return Object.values(events).map((list) => [...list.values()]).flat(1)
        .filter((e) => {
            return new Date(e.time.split("T")[0]).toDateString() === curDate
        })
        .sort((a,b) => new Date(a.time) - new Date(b.time))
}
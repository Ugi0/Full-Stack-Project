
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

export const titleInput = (handleChange) => {
    return (
        <div>
            <p>Title</p>
            <input id="title" onChange={handleChange} />
        </div>
    )
}

export const descriptionInput = (handleChange) => {
    return (
        <div>
            <p>Description</p>
            <textarea id="description" onChange={handleChange} />
        </div>
    )
}
import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { IconButton } from "@mui/material";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

function EventModal(props) {

    const [modalEditable, setModalEditable] = useState(false);
    const [item, setItem] = useState(props.item)

    const [checkpoint, setCheckpoint] = useState("");

    useEffect(() => {
        setItem(props.item);
        setCheckpoint("")
        setModalEditable(false);
    }, [props.item])

    const updateItem = (key, value) => {
        setItem({...item, [key]: value});
    }

    const renderTime = () => {
        if (modalEditable) {
            return (
                <>
                Time:
                <input
                    type="datetime-local"
                    id="newtime"
                    value={item.time}
                    onChange={(e) => updateItem("time", e.target.value)}
                />
                </>
            )
        } else {
            const date = new Date(item.time);
            return (
                <>
                Time:
                <Typography id="newtime" sx={{ mt: 2, margin:0 }} >
                    {date.toLocaleDateString()} {date.toLocaleTimeString().slice(0,5)}
                </Typography>
                </>
            )
        }
      }
    const renderDuration = () => {
        if (item.duration) {
            if (modalEditable) {
                return (
                    <>
                    Duration:
                    <input type="time" id="newduration" value={item.duration.padStart(5,'0')} onChange={(e) => updateItem("duration", e.target.value)}/>
                    </>
                )
            } else {
                return (
                    <>
                    Duration:
                    <Typography id="newduration" sx={{ mt: 2, margin:0 }} >
                        {item.duration.split(":")[0]}h {item.duration.split(":")[1]}min
                    </Typography>
                    </>
                )
            }
        }
    }
    const renderStatus = () => {
        if (item.status) {
            if (modalEditable) {
                return (
                    <>
                        Status:
                        <select defaultValue={item.status} id="type" onChange={(e) => {
                                const newitem = {...item}
                                if (item.started === "" && e.target.value !== "Not started") {
                                    newitem.started = new Date().toISOString().slice(0,16);
                                }
                                newitem.status = e.target.value;
                                setItem(newitem);
                            }}>
                            <option value="Not started">Not started</option>
                            <option value="In progress">In progress</option>
                            <option value="Stopped">Stopped</option>
                            <option value="Delayed">Delayed</option>
                            <option value="Done">Done</option>
                        </select>
                    </>
                )
            } else {
                return (
                    <>
                        Status:
                        <p> {item.status} </p>
                    </>
                )
            }
        }
    }
    const renderGrade = () => {
        if (item.grade !== undefined) {
            if (modalEditable) {
                return (
                    <>
                        Grade:
                        <input value={item.grade} onChange={(e) => updateItem("grade", e.target.value)}/>
                    </>
                )
            } else {
                return (
                    <>
                        Grade:
                        <p> {item.grade} </p>
                    </>
                )
            }
        }
    }
    const renderPriority = () => {
        if (item.priority) {
            if (modalEditable) {
                return (
                    <>
                        Priority:
                        <select defaultValue={item.priority} id="type" onChange={(e) => updateItem("priority", e.target.value)}>
                            <option value="Lowest">Lowest</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </>
                )
            } else {
                return (
                    <>
                        Priority:
                        <p> {item.priority} </p>
                    </>
                )
            }
        }
    }
    const renderCompleted = () => {
        if (item.completed !== undefined) {
            if (modalEditable) {
                return <>
                    Completed:
                    <input type="checkbox" checked={item.completed} onChange={(e) => {
                        updateItem('completed', !item.completed)
                        }}/>
                </>
            } else {
                return <>
                    Completed: {item.completed ? '✓' : 'X'}
                </>
            }
        }
    }
    const renderCheckpoints = () => {
        if (item.data !== undefined) {
            if (modalEditable) {
                return (
                    <div style={{flexDirection: "column", display: 'flex'}}>
                        New checkpoint
                        <div>
                            <input value={checkpoint} onChange={(e) => setCheckpoint(e.target.value)} />
                            <button onClick={() => updateItem("data", `${item.data}${checkpoint},0;`)}> Save </button>
                        </div>
                        <ul style={{listStyle: 'none', padding: 0}}>
                            {item.data.split(";").map((e,i) => {
                                if (e !== "") {
                                    return (
                                        <li key={i}> 
                                            <input type="checkbox" checked={e.split(",")[1] === '1'} onChange={() => {
                                                updateItem('data', item.data.split(";").map(f => f.split(",")[0] === e.split(",")[0] ? `${f.split(",")[0]},${f.split(",")[1] === '1' ? '0' : '1'}` : f).join(";"))
                                            }} />
                                            {e.split(",")[0]} 
                                            <button onClick={() => updateItem("data", `${item.data.split(";").filter(f => e.split(",")[0] !== f.split(",")[0]).join(";")}`)}>Del</button> 
                                        </li>
                                    )
                                }
                            })}
                        </ul>
                    </div>
                )
            }
            return (
                <div style={{flexDirection: "column", display: 'flex'}}>
                    {item.data === "" ? "" : "Checkpoints"}
                    <ul style={{listStyle: 'none', padding: 0}}>
                        {item.data.split(";").map((e,i) => {
                            if (e !== "") {
                                return (
                                    <li key={i} style={{textDecoration: `${e.split(",")[1] === '0' ? '' : "line-through"}`}}> 
                                        {e.split(",")[0]} 
                                    </li>
                                )
                            }
                        })}
                    </ul>
                </div>
            )
        }
    }
    const renderDeleteIcon = () => {
        if (modalEditable) {
            return <DeleteIcon />
        }
        return
    }
    const renderSaveIcon = () => {
        if (modalEditable) {
            return <SaveIcon />
        }
        return <BorderColorIcon/>
    }
    const handleSaveClick = () => {
        if (modalEditable) {
            props.saveEvent(item);
        }
        setModalEditable(!modalEditable)
    }
    const handleDeleteClick = () => {
        setModalEditable(false);
        props.deleteEvent();
    }
    const renderTitle = () => {
        if (item.title) {
            return <Typography id="newtitle" variant="h6" component="h2" suppressContentEditableWarning={true} contentEditable={modalEditable} onInput={(e)  => updateItem("title", e.target.innerText) }>
                        {item.title}
                    </Typography>
        }
    }
    const renderDescription = () => {
        if (item.description) {
            return <Typography id="newdescription" sx={{ mt: 2 }} suppressContentEditableWarning={true} contentEditable={modalEditable} onInput={(e) => updateItem("description", e.target.innerText)}>
                        {item.description}
                    </Typography>
        }
    }
    if (!props.item) {
        return
    }
    return <div>
        <Modal
            open={props.open}
            onClose={props.handleClose}
        >
            <Box className="modalContent">
                {renderTitle()}
                {renderDescription()}
                {renderTime()}
                {renderDuration()}
                {renderStatus()}
                {renderGrade()}
                {renderPriority()}
                {renderCompleted()}
                {renderCheckpoints()}

                {/* Icons */}
                <IconButton sx={{position:'absolute', top:0, right:0}} onClick={handleSaveClick}>
                    {renderSaveIcon()}
                </IconButton>
                <IconButton sx={{position:'absolute', top:0, left:0}} onClick={handleDeleteClick}>
                    {renderDeleteIcon()}
                </IconButton>
            </Box>
        </Modal>
    </div>
}

export default EventModal;
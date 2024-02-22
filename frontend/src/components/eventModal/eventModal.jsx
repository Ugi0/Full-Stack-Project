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

    useEffect(() => {
        setItem(props.item);
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
                        <select id="type" onChange={(e) => updateItem("status", e.target.value)}>
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
                        <select id="type" onChange={(e) => updateItem("priority", e.target.value)}>
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
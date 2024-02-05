import React, { useState } from "react";
import Box from '@mui/material/Box';
import { IconButton } from "@mui/material";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

function CalendarModal(props) {
    const [modalEditable, setModalEditable] = useState(false);
    const [newtime, setNewtime] = useState(props.time);
    const [newduration, setNewduration] = useState(props.duration);
    const [newtitle, setNewtitle] = useState(props.title);
    const [newdescription, setNewdescription] = useState(props.description);
    /*static getDerivedStateFromProps(props, state) {
        state.title = props.title
        state.description = props.description
        state.time = props.time;
        state.duration = props.duration;
        state.open = props.open;
        return state;
    }*/

    const renderTime = () => {
        if (modalEditable) {
            return (
                <input
                    type="datetime-local"
                    id="newtime"
                    value={newtime}
                    onChange={(e) => setNewtime(e.target.value)}
                />
            )
        } else {
            const date = new Date(props.time);
            return (
                <Typography id="newduration" sx={{ mt: 2, margin:0 }} >
                    {date.toLocaleDateString()} {date.toLocaleTimeString().slice(0,5)}
                </Typography>
            )
        }
      }
    const renderDuration = () => {
        if (modalEditable) {
            return (
                <input type="time" id="newduration" value={newduration.padStart(5,'0')} onChange={(e) => setNewduration(e.target.value)}/>
            )
        } else {
            return (
                <Typography id="newduration" sx={{ mt: 2, margin:0 }} >
                    {props.duration.split(":")[0]}h {props.duration.split(":")[1]}min
                </Typography>
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
        setModalEditable(!modalEditable)
        setNewdescription(props.description);
        setNewduration(props.duration);
        setNewtitle(props.title);
        setNewtime(props.time)
        if (modalEditable) {
            props.saveEvent(newtitle, newdescription, newtime, newduration);
        }
    }
    const handleDeleteClick = () => {
        setModalEditable(false);
        props.deleteEvent();
    }
    return <div>
        <Modal
            open={props.open}
            onClose={props.handleClose}
        >
            <Box className="modalContent">
                <Typography id="newtitle" variant="h6" component="h2" suppressContentEditableWarning={true} contentEditable={modalEditable} onInput={(e)  => setNewtitle(e.target.value)}>
                    {props.title}
                </Typography>
                <Typography id="newdescription" sx={{ mt: 2 }} suppressContentEditableWarning={true} contentEditable={modalEditable} onInput={(e) => setNewdescription(e.target.value)}>
                    {props.description}
                </Typography>
                Time:
                {renderTime()}
                Duration:
                {renderDuration()}
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

export default CalendarModal;
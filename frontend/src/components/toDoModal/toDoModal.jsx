import { Modal } from '@mui/material';
import { Box } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import './toDoModal.css'

function ToDoModal(props) {
    const [title, setTitle] = useState("");
    const [refreshTime, setRefreshTime] = useState("N");

    const getModalContent = () => {
        switch (props.type) {
            case "group":
                return <>
                    <div>
                        <p>Title</p>
                        <input onChange={(e) => setTitle(e.target.value)}/>
                    </div>
                    <div>
                        <p>Refresh time</p>
                        <select onChange={(e) => setRefreshTime(e.target.value)}>
                            <option value={"N"}>None</option>
                            <option value={"D"}>Daily</option>
                            <option value={"W"}>Weekly</option>
                            <option value={"M"}>Monthly</option>
                        </select>
                    </div>
                    <IconButton sx={{position:'absolute', top:0, right:0}} onClick={() => {props.setOpen(false); props.saveGroup({title: title, refreshTime: refreshTime, collapsed: "Y"})}} >
                        <SaveIcon />
                    </IconButton>
                </>
            case "note":
                return <>
                <div>
                    <p>Title</p>
                    <input onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <IconButton sx={{position:'absolute', top:0, right:0}} onClick={() => {props.setOpen(false); props.saveNote({title: title, checked: false, hostid: props.hostid, body: props.group})}} >
                    <SaveIcon />
                </IconButton>
            </>
            default:
                return <></>
        }
    }

    return <Modal
        open={props.open}
        onClose={() => { props.setOpen(false) }}
    >
        <Box className="modalContent">
            {getModalContent()}
        </Box>
    </Modal>
}

export default ToDoModal;
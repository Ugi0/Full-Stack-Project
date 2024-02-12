import React, {useState} from "react"
import './navigation.css';
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";

const mainpage = {id: 0, title: "Main Page", themecolor: "#2b583e"}

function Navigation(props) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");

    const renderAdd = () => {
        if (props.editable) {
            return (
                <div className="addView" onClick={() => { setOpen(true); setTitle(""); }}>
                    + Add View
                </div>
            )
        }
    }
    const renderDelete = (id) => {
        if (props.editable) {
            if (id === 0) return
            return (
                <DeleteIcon id="delete" onClick={() => { props.setSelectedView(0); props.deleteView(id); }}/>
            )
        }
    }
    return (
        <>
            <div className="Navigation">
                <p>Navigation</p>
                <div className="NavigationList">
                    {[mainpage].concat([...props.views.values()]).map((e,i) => {
                        return (
                            <div className="NavigationItem" key={i} onClick={(event) => { if (!event.target.outerHTML.includes('path')) props.setSelectedView(e.id) }} >
                                <p> {e.title} </p>
                                {renderDelete(e.id)}
                            </div>
                        )
                    })}
                    {renderAdd()}
                </div>
            </div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
            <Box className="modalContent">
                View Title
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
                <IconButton sx={{position:'absolute', top:0, right:0}} onClick={() => { props.addView(title); setOpen(false) }}>
                    <SaveIcon />
                </IconButton>
            </Box>
        </Modal>
        </>
    )
}

export default Navigation;
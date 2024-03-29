import React, {useState} from "react"
import './navigation.css';
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";

function Navigation(props) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");

    const [navOpen, setNavOpen] = useState(false);

    const ToggleNav = () => {
        setNavOpen(!navOpen);
    }

    const renderAdd = () => {
        if (props.editable) {
            return (
                <div className="addView" onClick={() => { setOpen(true); setTitle(""); }}>
                    + Add View
                </div>
            )
        }
    }
    const renderDelete = (item) => {
        if (props.editable) {
            if (item.title === '_mainpage') return
            return (
                <DeleteIcon id="delete" onClick={() => { props.deleteView(item.id); }}/>
            )
        }
    }
    const renderItemTitle = (item) => {
        if (item.title === '_mainpage') {
            return "Main Page"
        }
        return item.title
    }
    const renderCloseButton = () => {
        return (
            <button onClick={() => ToggleNav()} className="navCloseButton" style={{left: `${ navOpen ? '10px' : '150px'}`}}>
                { navOpen ? '→' : '←'}
            </button>
        )
    }
    return (
        <>
            <div className="NavigationRoot">
                <div className="Navigation" style={{display: `${ navOpen ? 'none' : ""}`}}>
                    <p>Navigation</p>
                    <div className="NavigationList">
                        {[...props.views.values()].map((e,i) => {
                            return (
                                <div className="NavigationItem" key={i} onClick={(event) => { props.setSelectedView(e.id) }} >
                                    <p> {renderItemTitle(e)} </p>
                                    {renderDelete(e)}
                                </div>
                            )
                        })}
                        {renderAdd()}
                    </div>
                </div>
                {renderCloseButton()}
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
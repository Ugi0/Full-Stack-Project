import React, { useState } from "react";
import IconButton from '@mui/material/Button';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Modal } from "@mui/material";
import Box from '@mui/material/Box';
import './addComponents.css'

function AddComponents(props) {
    const [addIconClicked, setAddIconClicked] = useState(false);
    const [secondMenuNumber, setSecondMenuItem] = useState(-1);
    const [modalOpen, setModalOpen] = useState(false);
    const [item, setItem] = useState({});
    const [selectedDay, setSelectedDay] = useState("Monday");

    const menuItems = [
        {
            title: 'Calendar',
            subItems: ['Day calendar','Week calendar', 'Month calendar']
        },
        {
            title: 'Courses',
            subItems: ['Courses list']
        },
        {
            title: 'Exams',
            subItems: []
        },
        {
            title: 'Projects',
            subItems: ['Project List']
        },
        {
            title: 'Note',
            subItems: []
        }
    ]

    const renderIcon = () => {
        if (props.editable) {
            return <SaveIcon />
        }
        return <BorderColorIcon/>
    }

    const renderAddMenu = () => {
        if (addIconClicked) {
            return <ul className="addMenu1" data-testid="addMenu1">
                {menuItems.map((menu, index) => {
                    return (
                        <ul key={index} className="addMenu2" onClick={() => handleMenuItemClick(index)} data-testid="addMenu2">
                            <p> {menu.title} </p>
                            <div>
                                {(secondMenuNumber === index) ?
                                    menu.subItems.map((item, index2) => {
                                        return (
                                            <p key={index2} onClick={() => handleItemClick(index, index2)}>
                                                {item}
                                            </p>
                                        )
                                    }) : ''
                                }
                            </div>
                        </ul>
                    )
                })}
            </ul>
        }
    }

    const renderAddIcon = () => {
        if (props.editable) {
            return <div>
                <IconButton sx={{position:'absolute', top:'50%', left:0, scale:'2'}} data-testid="addButton"> 
                    <AddCircleOutlineIcon onClick={handleAddClick}/>
                 </IconButton>
                 {renderAddMenu()}
            </div>
        }
    }

    const handleEditClick = () => {
        props.toggleEditable();
        setAddIconClicked(false);
    }

    const handleAddClick = () => {
        setAddIconClicked(!addIconClicked);
        setSecondMenuItem(-1);
    }

    const handleMenuItemClick = (index) => {
        if (secondMenuNumber === index) {
            setSecondMenuItem(-1);
        } else {
            setSecondMenuItem(index);
        }
    }

    const saveItem = (item) => {
        props.saveViewElement(item);
        setAddIconClicked(false);
        setSecondMenuItem(-1);
    }

    const handleItemClick = (type, typeIndex) => {
        setItem({
            type: type,
            size: typeIndex,
            data: ""
        })
        if (type === 0 && typeIndex === 0) {
            setSelectedDay("Monday")
            setModalOpen(true);
            return;
        }
        saveItem({
            type: type,
            size: typeIndex,
            data: ""
        })
    }

    return (
        <div>
            <IconButton onClick={handleEditClick} sx={{position:'absolute', top:0, right:0}} data-testid="editButton">
                {renderIcon()}
            </IconButton>
            {renderAddIcon()}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            >
                <Box className="addComponentModal">
                    Day
                    <select onChange={(e) => setSelectedDay(e.target.value)}>
                        <option value={'Monday'}> Monday </option>
                        <option value={'Tuesday'}> Tuesday </option>
                        <option value={'Wednesday'}> Wednesday </option>
                        <option value={'Thursday'}> Thursday </option>
                        <option value={'Friday'}> Friday </option>
                        <option value={'Saturday'}> Saturday </option>
                        <option value={'Sunday'}> Sunday </option>
                    </select>
                    <SaveIcon className='saveIcon' onClick={(e) => saveItem({...item, data: selectedDay})} style={{position: 'absolute', top: 5, right: 5}}/>
                </Box>
            </Modal>
        </div>
    )
}

export default AddComponents;
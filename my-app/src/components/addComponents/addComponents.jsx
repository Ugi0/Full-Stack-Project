import React, { useState } from "react";
import IconButton from '@mui/material/Button';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import './addComponents.css'

function AddComponents(props) {
    const [addIconClicked, setAddIconClicked] = useState(false);
    const [secondMenuNumber, setSecondMenuItem] = useState(-1);
    const menuItems = [
        {
            title: 'Calendar',
            subItems: ['Day calendar','Week calendar', 'Month calendar']
        },
        {
            title: 'Courses',
            subItems: []
        },
        {
            title: 'Exams',
            subItems: []
        },
        {
            title: 'Projects',
            subItems: []
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
        setSecondMenuItem(index);
    }

    const handleItemClick = (type, typeIndex) => {
        const item = {
            type: type,
            size: typeIndex,
            data: ""
        }
        props.saveViewElement(item);
        setAddIconClicked(false);
        setSecondMenuItem(-1);
    }

    return (
        <div>
            <IconButton onClick={handleEditClick} sx={{position:'absolute', top:0, right:0}} data-testid="editButton">
                {renderIcon()}
            </IconButton>
            {renderAddIcon()}
        </div>
    )
}

export default AddComponents;
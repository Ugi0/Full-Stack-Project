import React, { useState } from "react";
import IconButton from '@mui/material/Button';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Modal } from "@mui/material";
import Select from 'react-select';
import { getFilename } from "../../utils/getFileName";
import Box from '@mui/material/Box';
import './addComponents.css'

const icons = new Map();
const iconsFolder = require.context('../../images/note_icons/', true);
iconsFolder.keys().map(image => icons.set(getFilename(image), iconsFolder(`${image}`)));

function AddComponents(props) {
    const [addIconClicked, setAddIconClicked] = useState(false);
    const [itemGroup, setItemGroup] = useState(-1);
    const [chosenItem, setChosenItem] = useState(-1);
    const [modalOpen, setModalOpen] = useState(false);
    const [item, setItem] = useState({});
    const [selectedDay, setSelectedDay] = useState("Monday");

    const [noteTitle, setNoteTitle] = useState("");
    const [noteIcon, setNoteIcon] = useState("")
    const [noteBody, setNoteBody] = useState("")

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
            title: 'Projects',
            subItems: ['Project List', 'Status list', 'Timeline']
        },
        {
            title: 'Note',
            subItems: ["Single Note"]
        }
    ]

    const customStyles = {
        option: (provided, state) => ({
          ...provided,
          backgroundColor: 'white',
          color: state.isSelected ? 'red' : 'blue',
          textAlign: 'center',
          height: 100,
          margin: 0 
        }),
        menu: (provided) => ({
            ...provided, width: 150,  
        }),
        MenuList: (provided) => ({
            ...provided, width: 150,
        }),
        MenuPortal: (provided) => ({
            ...provided, width: 150
        }),
        valueContainer: (provided) => ({
            ...provided, height: 0, width: 0, padding: 0, margin: '0 !important', display: 'none', position: 'absolute'
        }),
        control: () => ({
          // none of react-select's styles are passed to <Control />
          height: '66px', width: '66px', display: 'flex', alignItems: 'center'
        }),
        indicatorSeparator: (base) => ({
            ...base,
            width: 0
        }),
        dropdownIndicator: (base) => ({
            ...base,
            transform: 'rotate(270deg)'
          })
      }

    const iconOptions = [
        {value: "Note",         icon: "notes"},
        {value: "Notification", icon: 'bell'},
        {value: "Phone",        icon: 'call'},
        {value: "Alert",        icon: 'danger'},
        {value: "Menu",         icon: 'menu-dots-vertical'},
    ]

    const modalContent = (i, j) => {
        if (i === 0 && j === 0) {
            return <Box className="addComponentModal">
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
        }
        if (i === 3 && j === 0) {
            return <Box className="addComponentModal">
                <div>
                    Title
                    <input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
                </div>
                <div className='addComponentModalSelect'>
                    <p> Icon </p>
                    <Select
                        styles={customStyles}
                        value={noteIcon}
                        options={iconOptions}
                        menuPlacement='top'
                        onChange={(e) => setNoteIcon(e)}
                        isSearchable={false}
                        maxMenuHeight={500}
                        placeholder=""
                        controlShouldRenderValue = { false }
                        formatOptionLabel={course => (
                            <div style={{width: '100px', height: '100px'}}> 
                                <img src={icons.get(course.icon)} alt={course.icon} style={{width: '30px', height: '30px'}} />
                                <p> {course.value} </p>
                            </div>
                        )}
                    />
                </div>
                <div>
                    Text
                    <textarea value={noteBody} onChange={(e) => setNoteBody(e.target.value)} />
                </div>
                <SaveIcon className='saveIcon' onClick={async () => { saveItem({...item}).then(e => props.saveNote({hostid: e, icon: noteIcon.icon, title: noteTitle, body: noteBody, checked: false}))}} style={{position: 'absolute', top: 5, right: 5}}/>
            </Box>
        }
        return <></>
        // TODO Create a view where the singleNote can be placed in
    }

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
                                {(itemGroup === index) ?
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
        setItemGroup(-1);
    }

    const handleMenuItemClick = (index) => {
        setItemGroup(index);
    }

    const saveItem = async (item) => {
        return props.saveViewElement(item).then(result => {
            setAddIconClicked(false);
            return result
        })
    }

    const handleItemClick = (type, typeIndex) => {
        setItem({
            type: type,
            size: typeIndex,
            data: ""
        })
        setChosenItem(typeIndex);
        if (Object.keys(modalContent(type, typeIndex).props).length !== 0) { 
            setModalOpen(true);
            setNoteTitle("")
            setNoteIcon("")
            setNoteBody("")
            setSelectedDay("Monday")
            return
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
                onClose={() => {
                    setModalOpen(false);
                    setItemGroup(-1);
                    setChosenItem(-1)
                }}
            >
                {modalContent(itemGroup, chosenItem)}
            </Modal>
        </div>
    )
}

export default AddComponents;
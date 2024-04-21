import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import DeleteComponentButton from '../../../components/deleteComponentButton/deleteComponentButton';
import './toDoList.css'
import ToDoModal from '../../../components/toDoModal/toDoModal';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { createRef } from 'react';
import React from 'react';

function ToDoList(props) {
    const [x, setX] = useState(props.sx.x);
    const [y, setY] = useState(props.sx.y);
    const [width, setWidth] = useState(props.sx.width);
    const [height, setHeight] = useState(props.sx.height);

    const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState(props.data);
    const [type, setType] = useState("");

    const [chosenGroup, setChosenGroup] = useState("");

    props.innerRef.current = () => { return {x :x, y:y, width: width, height: height} }

    const handleSaveGroup = (item) => {
        let newMap = new Map();
        let groups = data.split(";");
        groups.forEach(e => {const parts = e.split(":"); newMap.set(parts[0], {title: parts[0], refreshTime: parts[1], collapsed: parts[2]})})
        newMap.set(item.title, item);
        props.setData([...newMap.values()].filter(e => e.title !== "").map(e => e.title+":"+e.refreshTime+":"+e.collapsed).join(";"))
        setData([...newMap.values()].filter(e => e.title !== "").map(e => e.title+":"+e.refreshTime+":"+e.collapsed).join(";"));
    }

    const handleDeleteGroup = (title) => {
        let newMap = new Map();
        let groups = data.split(";");
        groups.forEach(e => {const parts = e.split(":"); newMap.set(parts[0], {title: parts[0], refreshTime: parts[1], collapsed: parts[2]})})
        newMap.delete(title);
        props.setData([...newMap.values()].filter(e => e.title !== "").map(e => e.title+":"+e.refreshTime+":"+e.collapsed).join(";"))
        setData([...newMap.values()].filter(e => e.title !== "").map(e => e.title+":"+e.refreshTime+":"+e.collapsed).join(";"));
    }

    const refreshTimeName = (letter) => {
        switch (letter) {
            case "N":
                return
            case "M":
                return "Monthly"
            case "W":
                return "Weekly"
            case "D":
                return "Daily"
            default:
                return
        }
    } 

    const getRefreshIcon = (refreshTime) => {
        if (refreshTime === "N") return <></>
        else {
            return <p style={{backgroundColor: '#2b583ea0', padding: '2px 4px 2px 4px'}}>
                {refreshTimeName(refreshTime)}
            </p>
        }
    }

    const handleGroupClose = (group) => {
        group.collapsed = group.collapsed === "Y" ? "N" : "Y";
        handleSaveGroup(group)
    }

    const handleNoteClick = (note) => {
        note.checked = note.checked ? 0 : 1;
        props.saveNote(note)
    } 

    const menuItems = [
        {items: [
            {
                label: "Refresh all now",
                icon: 'pi pi-refresh',
                style: {padding: 5, backgroundColor: '#233028', margin: 3, borderRadius: 5},
                command: (event) => {
                    [...props.notes.values()].filter(e => e.body === chosenGroup).forEach(e => {
                        e.checked = 0;
                        props.saveNote(e)
                    })
                }
            },
            {
                label: 'Delete group',
                icon: 'pi pi-trash',
                style: {padding: 5, backgroundColor: '#233028', margin: 3, borderRadius: 5},
                command: (event) => {
                    handleDeleteGroup(chosenGroup);
                }
            }
        ]}
    ]

    const lineRefs = React.useRef([]);

    lineRefs.current = data.split(";").map((_, i) => lineRefs.current[i] ?? createRef());

    return <>
        <Rnd disableDragging={!props.editable} enableResizing={props.editable} size={{ width: width,  height: height }}
                position={{ x: x, y: y }}
                style={{border: props.editable ? "solid whitesmoke 1px" : ""}}
                onDragStop={(e, d) => { setX(d.x); setY(d.y); }}
                onResizeStop={(e, direction, ref, delta, position) => {
                    setWidth(`${Math.max(Number(ref.style.width.slice(0,-2)), 200)}px`)
                    setHeight(`${Math.max(Number(ref.style.height.slice(0,-2)), 200)}px`);
                    setX(position.x);
                    setY(position.y);
                }}>
            <div className='toDoListRoot'>
                <div className='toDoListIconTitle'>
                    <FormatListBulletedIcon />
                    <p>To-do</p>
                </div>
                {/*User defined groups*/}
                {data.split(";").filter(e => e !== "").map((e,i) => {
                    let parts = e.split(":")
                    parts = {
                        title: parts[0],
                        refreshTime: parts[1],
                        collapsed: parts[2]
                    }
                    const curNotes = [...props.notes.values()].filter(e => e.body === parts.title && e.icon === null)
                    if (parts.collapsed === "N") {
                        return <div key={i} className='toDoListGroupTitle'>
                                <ArrowDropDownIcon style={{transform: 'rotate(-90deg)', color: '#F5F5F530'}} className='toDoListGroupTitleIcon' onClick={() => {handleGroupClose(parts)}}/>
                                <p style={{color: '#F5F5F530'}}> 1 hidden group </p>
                            </div>
                    }
                    return <div key={i} className='toDoListGroup'>
                            <div className='toDoListGroupTitle'>
                                <ArrowDropDownIcon className='toDoListGroupTitleIcon' onClick={() => {handleGroupClose(parts)}}/>
                                {parts.title}
                                {/* How often group is nulled */}
                                {getRefreshIcon(parts.refreshTime)}
                                {/* How many elements */}
                                <p style={{color: '#F5F5F550'}}>
                                    {curNotes.length}
                                </p>
                                {/* ... to edit the group */}
                                <Menu model={menuItems} popup ref={lineRefs.current[i]} id="toDoListGroupTitleMenu" />
                                <Button icon="pi pi-ellipsis-h" className="mr-2" onClick={(event) => { setChosenGroup(parts.title); lineRefs.current[i].current.toggle(event)}} aria-controls="popup_menu_left" aria-haspopup />
                            </div>
                            <div className='toDoListGroupItems'>
                                {curNotes.sort(sortNotes).map(e => {
                                    return <div key={e.id} className='toDoListGroupItem'>
                                        <i className="pi pi-trash" style={{color: '#F5F5F520'}} onClick={() => props.deleteNote(e.id)} />
                                        {/* Text */}
                                        <p style={{margin: '2px 5px 2px 5px'}}>
                                            {e.title}
                                        </p>
                                        {/* Checkbox hover: right */}
                                        <input type='checkbox' checked={e.checked} style={{position: 'absolute', right: 5}} onChange={() => {handleNoteClick(e)}}/>
                                    </div>
                                })}
                                {/* + New button */}
                                <button onClick={() => { setChosenGroup(parts.title); setType("note"); setOpenModal(true); }}>
                                    + New
                                </button>
                            </div>
                        </div>
                })}
                <button onClick={() => { setType("group"); setOpenModal(true); }}>
                    + Add a group
                </button>
                <DeleteComponentButton editable={props.editable} id={props.id} deleteComponent={props.deleteComponent} />
            </div>
            <ToDoModal hostid={props.id} open={openModal} setOpen={setOpenModal} type={type} group={chosenGroup} saveNote={(item) => {props.saveNote(item)}} saveGroup={(item) => handleSaveGroup(item)} />
        </Rnd>
    </>
}

function sortNotes(a,b) {
    if (a.checked && b.checked) {
        return a.title.localeCompare(b.title)
    } else if (a.checked) {
        return 1
    } else {
        return -1
    }
}

export default ToDoList;
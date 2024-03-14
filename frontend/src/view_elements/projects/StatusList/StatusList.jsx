import { useState } from "react";
import { Rnd } from "react-rnd";
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import CircleIcon from '@mui/icons-material/Circle';
import FolderIcon from '@mui/icons-material/Folder';
import EventModal from "../../../components/eventModal/eventModal";
import AddEvent from "../../../components/addEvent/addEvent";
import DeleteComponentButton from "../../../components/deleteComponentButton/deleteComponentButton";
import './StatusList.css'

function StatusList(props) {
    const [x, setX] = useState(props.sx.x);
    const [y, setY] = useState(props.sx.y);
    const [width, setWidth] = useState(props.sx.width);
    const [height, setHeight] = useState(props.sx.height);

    const [openModal, setOpenModal] = useState(false);
    const [openAddModal, setAddOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState({})

    props.innerRef.current = () => { return {x :x, y:y, width: width, height: height} }

    const deleteEvent = () => {
        setOpenModal(false)
        props.handleDelete(selectedItem.type, selectedItem.id);
    }
    const saveEvent = (values) => {
        const newItem = selectedItem;
        for (const [key, value] of Object.entries(values)) {
            newItem[key] = value;
          }
        setOpenModal(false)
        props.handleAdd(selectedItem.type,newItem)
    }

    const Container = (props) => {
        return <div className="StatusListContainer" style={{width: 150, height: 150}}>
                {props.projects.map((e,i) => {
                    return <div className="StatusListContainerItem" onClick={() => {
                        setSelectedItem(e)
                        setOpenModal(true)
                    }}>
                        <FolderIcon />
                        <p>
                            {e.title}
                        </p>
                    </div>
                })}
                <div className="StatusListContainerAdd" onClick={() => setAddOpenModal(true)}>
                    + New
                </div>
            </div>
    }

    return <>
        <Rnd disableDragging={!props.editable} enableResizing={props.editable} size={{ width: width,  height: height }}
        position={{ x: x, y: y }}
        style={{border: props.editable ? "solid whitesmoke 1px" : "", position: 'relative'}}
        onDragStop={(e, d) => { setX(d.x); setY(d.y); }}
        onResizeStop={(e, direction, ref, delta, position) => {
            setWidth(`${Math.max(Number(ref.style.width.slice(0,-2)), 200)}px`)
            setHeight(`${Math.max(Number(ref.style.height.slice(0,-2)), 350)}px`);
            setX(position.x);
            setY(position.y);
        }}>
            <div className="StatusListRoot">
                <div className="StatusListTitle">
                    <ViewTimelineIcon />
                    <p>Status</p>
                </div>
                <div className="StatusList">
                    <div className="StatusListItem">
                        <div className="StatusListItemTitle">
                            <div className="StatusListItemTitleBubble" style={{backgroundColor: '#AFEEEE'}}>
                                <CircleIcon style={{color: '#d7f6f6', fontSize: '15px'}}/>
                                <p> Not started </p>
                            </div>
                            <p>
                                {[...props.userData.events.projects.values()].filter(e => e.status === 'Not started').length}
                            </p>
                        </div>
                        <Container {...{projects: [...props.userData.events.projects.values()].filter(e => e.status === 'Not started')}}/>
                    </div>
                    <div className="StatusListItem">
                        <div className="StatusListItemTitle">
                            <div className="StatusListItemTitleBubble" style={{backgroundColor: '#FCE205'}}>
                                <CircleIcon style={{color: '#fdf082', fontSize: '15px'}}/>
                                <p> In progress </p>
                            </div>
                            <p>
                                {[...props.userData.events.projects.values()].filter(e => e.status === 'In progress').length}
                            </p>
                        </div>
                        <Container {...{projects: [...props.userData.events.projects.values()].filter(e => e.status === 'In progress')}}/>
                    </div>
                    <div className="StatusListItem">
                        <div className="StatusListItemTitle">
                            <div className="StatusListItemTitleBubble" style={{backgroundColor: '#324AB2'}}>
                                <CircleIcon style={{color: '#91a0e0', fontSize: '15px'}}/>
                                <p> Stopped </p>
                            </div>
                            <p>
                                {[...props.userData.events.projects.values()].filter(e => e.status === 'Stopped').length}
                            </p>
                        </div>
                        <Container {...{projects: [...props.userData.events.projects.values()].filter(e => e.status === 'Stopped')}}/>
                        </div>
                    <div className="StatusListItem">
                        <div className="StatusListItemTitle">
                            <div className="StatusListItemTitleBubble" style={{backgroundColor: '#DE1738'}}>
                                <CircleIcon style={{color: '#f38799', fontSize: '15px'}}/>
                                <p> Delayed </p>
                            </div>
                            <p>
                                {[...props.userData.events.projects.values()].filter(e => e.status === 'Delayed').length}
                            </p>
                        </div>
                        <Container {...{projects: [...props.userData.events.projects.values()].filter(e => e.status === 'Delayed')}}/>
                    </div>
                    <div className="StatusListItem">
                        <div className="StatusListItemTitle">
                            <div className="StatusListItemTitleBubble" style={{backgroundColor: '#39FF14'}}>
                                <CircleIcon style={{color: '#9cff89', fontSize: '15px'}}/>
                                <p> Done </p>
                            </div>
                            <p>
                                {[...props.userData.events.projects.values()].filter(e => e.status === 'Done').length}
                            </p>
                        </div>
                        <Container {...{projects: [...props.userData.events.projects.values()].filter(e => e.status === 'Done')}}/>
                    </div>
                </div>
            </div>
            <DeleteComponentButton editable={props.editable} id={props.id} deleteComponent={props.deleteComponent} />
        </Rnd>
        <EventModal 
                saveEvent={saveEvent} deleteEvent ={deleteEvent}
                handleClose = {() => setOpenModal(false)}
                open = {openModal}
                item = {selectedItem}
            />
        <AddEvent courses={props.userData.courses} firstValue={"4"} events={props.userData.events} handleAdd={props.handleAdd} time={new Date().toISOString().slice(0,16)} open={openAddModal} onClose={() => setAddOpenModal(false)}/>
    </>
}

export default StatusList;
import React, { useState, forwardRef, useImperativeHandle, useRef } from "react";
import './weekCalendar.css'
import { Rnd } from "react-rnd";
import AddIcon from '@mui/icons-material/Add';
import ClickableCalendarEvent from "../../../components/clickableCalendarEvent/clickableCalendarEvent";
import AddEvent from "../../../components/addEvent/addEvent";
import EventModal from "../../../components/eventModal/eventModal";
import DeleteComponentButton from "../../../components/deleteComponentButton/deleteComponentButton";
import { getEventCount, getAsList } from "../../../utils/inputElements";
import { getWeek } from "../../../utils/getWeek";

function WeekCalendar(props) {
    //Modal can't be closed if it's placed inside the Rnd
    //Therefore, the modal will be located in the WeekCalendar parent
    //and opened through the children

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [x, setX] = useState(props.sx.x);
    const [y, setY] = useState(props.sx.y);
    const [width, setWidth] = useState(props.sx.width);
    const [height, setHeight] = useState(props.sx.height);

    const [openEventModal, setOpenEventModal] = useState(false);
    const [openAddEventModal, setOpenAddEventModal] = useState(false);

    const [chHandler, setChHandler] = useState();
    const [time, setTime] = useState("");

    const [selectedItem, setSelectedItem] = useState({});

    // A function that the parent can use to get the current position and size
    props.innerRef.current = () => { return {x :x, y:y, width: width, height: height} }

      //Create a handler so the children can update the open state
    const handler = (values) => {
        if (props.editable) return;
        setChHandler(() => values.chHandler);
        setOpenEventModal(true);
        setSelectedItem(values.item)
      }
    const deleteEvent = () => {
        setOpenEventModal(false)
        props.handleDelete(selectedItem.type, selectedItem.id);
    }
    const saveEvent = (values) => {
        chHandler(values)
        const newItem = selectedItem;
        for (const [key, value] of Object.entries(values)) {
            newItem[key] = value;
          }
        setOpenEventModal(false);
        props.handleAdd(selectedItem.type,newItem)
    }

    const handleCloseAddModal = () => {
        setOpenAddEventModal(false);
    }
    const handleOpenAddModal = (time) => {
        if (props.editable) return
        setOpenAddEventModal(true);
    }
    const handleClose = () => {
        setOpenEventModal(false);
    }
    const today = new Date();
    let cur = new Date();
    cur.setDate(today.getDate()-[6,0,1,2,3,4,5][today.getDay()]); //Set current to previous monday
    const monday = new Date(cur);
    cur.setDate(cur.getDate() -1);
    return (
        <>
        <Rnd disableDragging={!props.editable} enableResizing={props.editable} size={{ width: width,  height: height }}
        position={{ x: x, y: y }}
        style={{border: props.editable ? "solid whitesmoke 1px" : ""}}
        onDragStop={(e, d) => { setX(d.x); setY(d.y); }}
        onResizeStop={(e, direction, ref, delta, position) => {
            setWidth(`${Math.max(Number(ref.style.width.slice(0,-2)), 815)}px`)
            setHeight(ref.style.height);
            setX(position.x);
            setY(position.y);
        }}>
            <div className="weekNumber"> 
                <h2> Week {getWeek(today)} </h2>
            </div>
            <DeleteComponentButton editable={props.editable} id={props.id} deleteComponent={props.deleteComponent} />
            <div className="weekCalendarRoot">
                {
                days.map((day, index) => {
                    const isItToday = today.getDay() === [1,2,3,4,5,6,0][index];
                    cur.setDate(cur.getDate()+1);
                    return (
                        <div className="weekDay" key={index} style={{ backgroundColor: isItToday ? '#3c4543' : '#1d2120'}}>
                            <div className="dayName">
                                <b>{day}</b>
                                <p className="eventNumber">
                                    {getEventCount(props.userData.events, cur.toDateString())}
                                </p>
                            </div>
                            { getAsList(props.userData.events.lectures, cur.toDateString())
                                .map((item) => {
                                    return (
                                        <ClickableCalendarEvent
                                            item = {item}
                                            title = {[...props.userData.courses.values()].filter(e => e.id === item.course)[0].title}
                                            duration = {item.duration}
                                            handler = {handler} key = {item.id}
                                            draw = {["title", "icon", "time", "duration"]} sx = {{padding: '5px 0 5px 0'}}
                                        />
                                    )
                                })
                            }
                            { getAsList(props.userData.events.assignments, cur.toDateString())
                                .map((item) => {
                                    return (
                                        <ClickableCalendarEvent
                                            item = {item}
                                            handler = {handler} key = {item.id}
                                            draw = {["title", "icon"]} sx = {{padding: '5px 0 5px 0'}}
                                        />
                                    )
                                })
                            }
                            <button className="newButton" onClick={() => { //Set date to clicked day in addComponent
                                const d = new Date(monday);
                                d.setDate(d.getDate() + index);
                                setTime(d.toISOString().slice(0,16))
                                handleOpenAddModal()
                            }}>
                                <AddIcon/> New
                            </button>
                        </div>
                    )
                })
                }
            </div>
        </Rnd>
            <EventModal 
                saveEvent={saveEvent} deleteEvent ={deleteEvent}
                handleClose = {handleClose}
                open = {openEventModal}
                item = {selectedItem}
            />
            <AddEvent courses={props.userData.courses} events={props.userData.events} handleAdd={props.handleAdd} time={time} open={openAddEventModal} onClose={handleCloseAddModal}/>
        </>
    )
}

export default WeekCalendar;
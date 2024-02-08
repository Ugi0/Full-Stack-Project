import React, { useState } from "react";
import '../../styles/weekCalendar.css'
import { Rnd } from "react-rnd";
import AddIcon from '@mui/icons-material/Add';
import ClickableCalendarEvent from "../clickableCalendarEvent";
import AddEvent from "../addEvent";
import CalendarModal from "../calendarModal";
import { getEventCount, getAsList } from "../inputElements";

function WeekCalendar(props) {
    //Modal can't be closed if it's placed inside the Rnd
    //Therefore, the modal will be located in the WeekCalendar parent
    //and opened through the children

    /*static getDerivedStateFromProps(props, state) {
        state.editable = props.editable;
        state.courses = props.courses;
        return state;
    }*/
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [x, setX] = useState(props.sx.x);
    const [y, setY] = useState(props.sx.y);
    const [width, setWidth] = useState(props.sx.width);
    const [height, setHeight] = useState(props.sx.height);

    const [openCalendarModal, setOpenCalendarModal] = useState(false);
    const [openAddEventModal, setOpenAddEventModal] = useState(false);

    const [chHandler, setChHandler] = useState();
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState("");
    const [description, setDescription] = useState("");
    const [id, setID] = useState(0);

      //Create a handler so the children can update the open state
    const handler = (values) => {
        if (props.editable) return;
        setChHandler(() => values.chHandler);
        setOpenCalendarModal(true);
        setTitle(values.title);
        setTime(values.time);
        setDuration(values.duration);
        setDescription(values.description);
        setID(values.id);
      }
    const deleteEvent = () => {
        setOpenCalendarModal(false)
        props.deleters.deleteCourse(id);
    }
    const saveEvent = (newTitle, newDescription, newTime, newDuration) => {
        chHandler({
            title: newTitle,
            description: newDescription,
            duration: newDuration,
            time: newTime
        })
        const oldItem = props.userData.courses.get(id);
        const newCourse = {
            title: newTitle, time: newTime, 
            duration: newDuration, description: newDescription, 
            repeating: oldItem.repeating, repeatingTime: oldItem.repeatingTime,
            id: oldItem.id
        };
        setOpenCalendarModal(false);
        props.setters.addCourse(newCourse);
    }

    const handleCloseAddModal = () => {
        setOpenAddEventModal(false);
    }
    const handleOpenAddModal = (time) => {
        if (props.editable) return
        setOpenAddEventModal(true);
    }
    const handleClose = () => {
        setOpenCalendarModal(false);
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
        onDragStop={(e, d) => { setX(d.x); setY(d.y); }}
        onResizeStop={(e, direction, ref, delta, position) => {
            setWidth(`${Math.max(Number(ref.style.width.slice(0,-2)), 815)}px`)
            setHeight(ref.style.height);
            setX(position.x);
            setY(position.y);
        }}>
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
                                    {getEventCount(props.userData, cur.toDateString())}
                                </p>
                            </div>
                            { getAsList(props.userData.courses, cur.toDateString())
                                .map((item) => {
                                    return (
                                        <ClickableCalendarEvent
                                            title = {item.title} description = {item.description}
                                            time = {item.time} id = {item.id}
                                            duration = {item.duration}
                                            handler = {handler} key = {item.id}
                                            draw = {["title", "icon", "time", "duration"]} sx = {{padding: '5px 0 5px 0'}}
                                        />
                                    )
                                })
                            }
                            { getAsList(props.userData.assignments, cur.toDateString())
                                .map((item) => {
                                    return (
                                        <ClickableCalendarEvent
                                            title = {item.title} description = {item.description}
                                            time = {item.time} id = {item.id}
                                            duration = {"1:00"}
                                            handler = {handler} key = {item.id}
                                            draw = {["title", "icon", "time"]} sx = {{padding: '5px 0 5px 0'}}
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
            <CalendarModal 
                saveEvent={saveEvent} deleteEvent ={deleteEvent}
                handleClose = {handleClose}
                title = {title} description = {description}
                time={time} open={openCalendarModal} duration={duration}
                id={id}
            />
            <AddEvent userData={props.userData} setters={props.setters} time={time} open={openAddEventModal} onClose={handleCloseAddModal}/>
        </>
    )
}

export default WeekCalendar;
import React, { useState } from "react";
import './monthCalendar.css'
import { Rnd } from "react-rnd";
import EventModal from "../../eventModal/eventModal";
import ClickableCalendarEvent from "../../clickableCalendarEvent/clickableCalendarEvent";

function MonthCalendar(props) {
    const gridHeight = 5;
    const gridWidth = 7;

    const [x, setX] = useState(props.sx.x);
    const [y, setY] = useState(props.sx.y);
    const [width, setWidth] = useState(props.sx.width);
    const [height, setHeight] = useState(props.sx.height);

    const [openEventModal, setOpenEventModal] = useState(false);

    const [chHandler, setChHandler] = useState();
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState("");
    const [description, setDescription] = useState("");
    const [id, setID] = useState(0);

    // A function that the parent can use to get the current position and size
    props.innerRef.current = () => { return {x :x, y:y, width: width, height: height} }

    const deleteEvent = () => {
        setOpenEventModal(false)
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
        setOpenEventModal(false);
        props.setters.addCourse(newCourse);
    }

    const handler = (values) => {
        if (props.editable) return;
        setChHandler(() => values.chHandler);
        setOpenEventModal(true);
        setTitle(values.title);
        setTime(values.time);
        setDuration(values.duration);
        setDescription(values.description);
        setID(values.id);
      }

    const handleClose = () => {
        setOpenEventModal(false);
    }
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    const today = new Date();
    let firstDayOfTheMonth = new Date();
    firstDayOfTheMonth.setDate(0);
    firstDayOfTheMonth.setDate(firstDayOfTheMonth.getDate() - [6,0,1,2,3,4,5][firstDayOfTheMonth.getDay()] - 1);
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
                <h2> {monthNames[today.getMonth()]} {today.getFullYear()} </h2>
                <div className="dayOfTheWeek">
                    <div className="monthDayName">Mon</div>
                    <div className="monthDayName">Tue</div>
                    <div className="monthDayName">Wed</div>
                    <div className="monthDayName">Thu</div>
                    <div className="monthDayName">Fri</div>
                    <div className="monthDayName">Sat</div>
                    <div className="monthDayName">Sun</div>
                </div>
                <div className="monthCalendarRoot" >
                    {[...Array(gridHeight*gridWidth)].map((_,i) => {
                        firstDayOfTheMonth.setDate(firstDayOfTheMonth.getDate() + 1);
                        return (
                            <div className="monthDay" key={i} style={{ backgroundColor: today.getMonth() === firstDayOfTheMonth.getMonth() ? '#1d2021' : '#1d212040'}}>
                                <div className={today.toDateString()===firstDayOfTheMonth.toDateString() ? 'currentDateNumber' : "dateNumber"} >
                                    {firstDayOfTheMonth.getDate()}
                                </div>
                                {[...props.userData.courses.keys()]
                                .map((e) => props.userData.courses.get(e))
                                .filter((item) => new Date(item.time).toDateString() === firstDayOfTheMonth.toDateString())
                                .sort((a,b) => new Date(a.time) - new Date(b.time))
                                .map((item,index) => {
                                    return <ClickableCalendarEvent
                                        item = {item}
                                        handler = {handler}
                                        key = {item.id}
                                        draw = {["title"]}
                                        sx = {{'overflow': 'hidden', 'whiteSpace': 'nowrap'}}
                                    />
                                })}
                            </div>
                        )
                    })}
                </div>
            </Rnd>
            <EventModal 
                saveEvent={saveEvent} deleteEvent ={deleteEvent}
                handleClose = {handleClose}
                title = {title} description = {description}
                time={time} open={openEventModal} duration={duration}
                id={id}
            />
        </>
    )
}

export default MonthCalendar;
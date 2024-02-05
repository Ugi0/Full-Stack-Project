import React, { useState } from "react";
import '../../styles/monthCalendar.css'
import { Rnd } from "react-rnd";
import CalendarModal from "../calendarModal";
import ClickableCalendarEvent from "../clickableCalendarEvent";

function MonthCalendar(props) {
    const gridHeight = 5;
    const gridWidth = 7;

    const [x, setX] = useState(props.sx.x);
    const [y, setY] = useState(props.sx.y);
    const [width, setWidth] = useState(props.sx.width);
    const [height, setHeight] = useState(props.sx.height);

    const [openCalendarModal, setOpenCalendarModal] = useState(false);

    const [chHandler, setChHandler] = useState();
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState("");
    const [description, setDescription] = useState("");
    const [courseid, setCourseid] = useState(0);

    const deleteEvent = () => {
        setOpenCalendarModal(false)
        props.deleteCourse(courseid);
    }
    const saveEvent = (newTitle, newDescription, newTime, newDuration) => {
        let newCourses = props.courses;
        chHandler({
            title: newTitle,
            description: newDescription,
            duration: newDuration,
            time: newTime
        })
        const oldItem = newCourses.find((item) => item.courseid === courseid)
        newCourses = newCourses.filter((item) => item.courseid !== courseid).concat([{
            title: newTitle, time: newTime, 
            duration: newDuration, description: newDescription, 
            repeating: oldItem.repeating, repeatingTime: oldItem.repeatingTime,
            courseid: courseid
        }]);
        setOpenCalendarModal(false);
        props.setCourses(newCourses);
    }

    const handler = (values) => {
        if (props.editable) return;
        setChHandler(() => values.chHandler);
        setOpenCalendarModal(true);
        setTitle(values.title);
        setTime(values.time);
        setDuration(values.duration);
        setDescription(values.description);
        setCourseid(values.courseid);
      }

    const handleClose = () => {
        setOpenCalendarModal(false);
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
                            <div className="monthDay" key={i} style={{ backgroundColor: today.getMonth()===firstDayOfTheMonth.getMonth() ? '#1d2021' : '#1d212040'}}>
                                <div className={today.toDateString()===firstDayOfTheMonth.toDateString() ? 'currentDateNumber' : "dateNumber"} >
                                    {firstDayOfTheMonth.getDate()}
                                </div>
                                {props.courses
                                .filter((item) => new Date(item.time).toDateString() === firstDayOfTheMonth.toDateString())
                                .sort((a,b) => new Date(a.time) - new Date(b.time))
                                .map((item,index) => {
                                    return <ClickableCalendarEvent
                                        title = {item.title}
                                        description = {item.description}
                                        time = {item.time}
                                        courseid = {item.courseid}
                                        duration = {item.duration}
                                        handler = {handler}
                                        key = {item.courseid}
                                        draw = {["title"]}
                                        sx = {{'overflow': 'hidden', 'whiteSpace': 'nowrap'}}
                                    />
                                })}
                            </div>
                        )
                    })}
                </div>
            </Rnd>
            <CalendarModal 
                saveEvent={saveEvent} deleteEvent ={deleteEvent}
                handleClose = {handleClose}
                title = {title} description = {description}
                time={time} open={openCalendarModal} duration={duration}
                courseid={courseid}
            />
        </>
    )
}

export default MonthCalendar;
import React, { useState } from "react";
import './monthCalendar.css'
import { Rnd } from "react-rnd";
import EventModal from "../../../components/eventModal/eventModal";
import ClickableCalendarEvent from "../../../components/clickableCalendarEvent/clickableCalendarEvent";
import DeleteComponentButton from "../../../components/deleteComponentButton/deleteComponentButton";

function MonthCalendar(props) {
    const gridHeight = 5;
    const gridWidth = 7;

    const [x, setX] = useState(props.sx.x);
    const [y, setY] = useState(props.sx.y);
    const [width, setWidth] = useState(props.sx.width);
    const [height, setHeight] = useState(props.sx.height);

    const [openEventModal, setOpenEventModal] = useState(false);

    const [chHandler, setChHandler] = useState();

    const [selectedItem, setSelectedItem] = useState({});

    // A function that the parent can use to get the current position and size
    props.innerRef.current = () => { return {x :x, y:y, width: width, height: height} }

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

    const handler = (values) => {
        if (props.editable) return;
        setChHandler(() => values.chHandler);
        setOpenEventModal(true);
        setSelectedItem(values.item)
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
                <DeleteComponentButton editable={props.editable} id={props.id} deleteComponent={props.deleteComponent} />
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
                open = {openEventModal}
                item = {selectedItem}
            />
        </>
    )
}

export default MonthCalendar;
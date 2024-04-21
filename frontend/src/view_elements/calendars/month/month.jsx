import React, { useState } from "react";
import './monthCalendar.css'
import { Rnd } from "react-rnd";
import EventModal from "../../../components/eventModal/eventModal";
import AddIcon from '@mui/icons-material/Add';
import AddEvent from "../../../components/addEvent/addEvent";
import ClickableCalendarEvent from "../../../components/clickableCalendarEvent/clickableCalendarEvent";
import ChangeCalendarTimeButtons from "../../../components/changeCalendarTime/changeCalendarTime";
import DeleteComponentButton from "../../../components/deleteComponentButton/deleteComponentButton";
import { getCalendarMonthRenders } from "../../../utils/calendarEventRenders";
import { getAsList } from "../../../utils/inputElements";

function MonthCalendar(props) {
    const gridHeight = 5;
    const gridWidth = 7;

    const [x, setX] = useState(props.sx.x);
    const [y, setY] = useState(props.sx.y);
    const [width, setWidth] = useState(props.sx.width);
    const [height, setHeight] = useState(props.sx.height);

    const [monthDiff, setMonthDiff] = useState(0);

    const changeMonthDiff = (value) => setMonthDiff(monthDiff+value);

    const [openEventModal, setOpenEventModal] = useState(false);
    const [openAddEventModal, setOpenAddEventModal] = useState(false);

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

    const handleCloseAddModal = () => {
        setOpenAddEventModal(false);
    }
    const handleOpenAddModal = (time) => {
        if (props.editable) return
        setOpenAddEventModal(true);
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
    let curMonth = new Date(today.getFullYear(), today.getMonth()+monthDiff);
    let cur = new Date(curMonth)
    cur.setDate(cur.getDate() - [6,0,1,2,3,4,5][cur.getDay()] - 1);
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
                <h2> {monthNames[curMonth.getMonth()]} {curMonth.getFullYear()} </h2>
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
                <ChangeCalendarTimeButtons changeTime={changeMonthDiff} />
                <button className="newButton" style={{position: 'absolute', top: '5px', right: '80px', height: 'fit-content'}} onClick={() => {
                    handleOpenAddModal()
                }}>
                    <AddIcon/> New
                </button>
                <div className="monthCalendarRoot" >
                    {[...Array(gridHeight*gridWidth)].map((_,i) => {
                        cur.setDate(cur.getDate() + 1);
                        return (
                            <div className="monthDay" key={i} style={{ backgroundColor: today.getMonth() === cur.getMonth() ? '#1d2021' : '#1d212040'}}>
                                <div className={today.toDateString()===cur.toDateString() ? 'currentDateNumber' : "dateNumber"} >
                                    {cur.getDate()}
                                </div>
                                { getAsList(props.userData.events, cur.toDateString())
                                    .map((item) => {
                                    return <ClickableCalendarEvent
                                            item = {item}
                                            duration = {item.duration}
                                            handler = {handler} key = {item.id}
                                            draw = {getCalendarMonthRenders(item.type)} sx = {{'overflow': 'hidden', 'whiteSpace': 'nowrap'}}
                                            //React magic to add 'title' props if item object doesn't have a title
                                            {...(!('title' in item) ? {title: [...props.userData.courses.values()].filter(e => e.id === item.course.id)[0].title} : {})}
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
            <AddEvent courses={props.userData.courses} events={props.userData.events} handleAdd={props.handleAdd} time={new Date().toISOString().slice(0,16)} open={openAddEventModal} onClose={handleCloseAddModal}/>
        </>
    )
}

export default MonthCalendar;
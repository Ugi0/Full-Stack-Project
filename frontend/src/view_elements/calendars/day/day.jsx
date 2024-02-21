import React, { useState } from "react";
import './dayCalendar.css'
import { Rnd } from "react-rnd";
import AddEvent from '../../../components/addEvent/addEvent'


function DayCalendar(props) {
    const [x, setX] = useState(props.sx.x);
    const [y, setY] = useState(props.sx.y);
    const [width, setWidth] = useState(props.sx.width);
    const [height, setHeight] = useState(props.sx.height);

    const [openEventModal, setOpenEventModal] = useState(false);
    const [openAddEventModal, setOpenAddEventModal] = useState(false);

    const [time, setTime] = useState("");

    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const handleCloseAddModal = () => {
        setOpenAddEventModal(false);
    }

    return (
        <>
            <Rnd disableDragging={!props.editable} enableResizing={props.editable} size={{ width: width,  height: height }}
                position={{ x: x, y: y }}
                style={{border: props.editable ? "solid whitesmoke 1px" : ""}}
                onDragStop={(e, d) => { setX(d.x); setY(d.y); }}
                onResizeStop={(e, direction, ref, delta, position) => {
                    setWidth(`${Math.max(Number(ref.style.width.slice(0,-2)), 100)}px`)
                    setHeight(ref.style.height);
                    setX(position.x);
                    setY(position.y);
                }}>
                    <div className="dayCalendarRoot">
                        <h5> {props.weekday} </h5>
                        <div className="dayCalendarEvents">

                        </div>
                    </div>
            </Rnd>
            <AddEvent courses={props.userData.courses} events={props.userData.events} handleAdd={props.handleAdd} time={time} open={openAddEventModal} onClose={handleCloseAddModal}/>
        </>
    )
}

export default DayCalendar;
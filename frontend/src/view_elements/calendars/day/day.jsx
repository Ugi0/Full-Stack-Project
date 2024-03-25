import React, { useState } from "react";
import './dayCalendar.css'
import { Rnd } from "react-rnd";
import { getAsList } from "../../../utils/inputElements";
import DeleteComponentButton from "../../../components/deleteComponentButton/deleteComponentButton";

function DayCalendar(props) {
    const [x, setX] = useState(props.sx.x);
    const [y, setY] = useState(props.sx.y);
    const [width, setWidth] = useState(props.sx.width);
    const [height, setHeight] = useState(props.sx.height);

    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // A function that the parent can use to get the current position and size
    props.innerRef.current = () => { return {x :x, y:y, width: width, height: height} }

    const handleBoxClick = (item) => {
        item.completed = !item.completed;
        props.handleAdd(item.type, item)
    }

    const cur = new Date();
    cur.setDate(cur.getDate()-[6,0,1,2,3,4,5][cur.getDay()]+weekDays.indexOf(props.weekday));
    return (
        <>
            <Rnd disableDragging={!props.editable} enableResizing={props.editable} size={{ width: width,  height: height }}
                position={{ x: x, y: y }}
                style={{border: props.editable ? "solid whitesmoke 1px" : "", position: 'relative'}}
                onDragStop={(e, d) => { setX(d.x); setY(d.y); }}
                onResizeStop={(e, direction, ref, delta, position) => {
                    setWidth(`${Math.max(Number(ref.style.width.slice(0,-2)), 100)}px`)
                    setHeight(ref.style.height);
                    setX(position.x);
                    setY(position.y);
                }}>
                    <div className="dayCalendarRoot">
                        <h5> {props.weekday} </h5>
                        <DeleteComponentButton editable={props.editable} id={props.id} deleteComponent={props.deleteComponent} />
                        <div className="dayCalendarEvents">
                            {getAsList(props.userData.events, cur.toDateString()).map((item,index) => (
                                (<div key={index} className="dayCalendarEvent">
                                    <input type="checkbox" checked={item.completed} onChange={() => handleBoxClick(item)}/>
                                    <p style={{textDecoration: `${item.completed ? "line-through" : ""}`}}>
                                    {item.time.split("T")[1]}
                                    {" "}
                                    {[...props.userData.courses.values()].filter(e => e.id === item.course.id)[0].title}
                                    </p>
                                </div>)
                            ))}
                        </div>
                    </div>
            </Rnd>
        </>
    )
}

export default DayCalendar;
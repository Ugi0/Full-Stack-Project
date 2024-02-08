import React, { useState } from 'react'
import '../styles/clickableCalendarEvent.css'
import '../styles/clickableModal.css'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

function ClickableCalendarEvent(props) {
    const [title, setTitle] = useState(props.title);
    const [time, setTime] = useState(props.time);
    const [duration, setDuration] = useState(props.duration);
    const [description, setDescription] = useState(props.description);

    const handleClick = () => {
        props.handler({
            editable: false,
            id: props.id,
            title: title, newtitle: title,
            time: time, newtime: time,
            duration: duration, newduration: duration,
            description: description, newdescription: description,
            chHandler: handler
        })
    }
    const handler = (e) => {
        if (e === undefined) return;
        setTitle(e.title);
        setTime(e.time);
        setDuration(e.duration);
        setDescription(e.description);
      }
    const [hours, minutes] = time.split("T")[1].split(":").map(e => parseInt(e))
    const [addHours, addMinutes] = duration.split(":").map(e => parseInt(e))
    return (
        <div className="event" key={props.id} onClick={handleClick} style={props.sx}>
            {props.draw.includes("title") ? <div className="eventTitle">
                {props.draw.includes("icon") ? <AccessTimeFilledIcon  style={{fill: '#2b583e'}} sx={{width: '15px', height: '15px'}}/> : "" }
                <p> {title} </p>
            </div> : ""
            }
            {props.draw.includes("time") ? <div className="eventTime">
                <p> {time.split("T")[1]} </p>
                {props.draw.includes("duration") ? <p> {(hours+addHours).toLocaleString(undefined, {minimumIntegerDigits: 2})}:{(minutes+addMinutes).toLocaleString(undefined, {minimumIntegerDigits: 2})} </p> : ""}
            </div> : ""}
        </div>
    )
}

export default ClickableCalendarEvent;
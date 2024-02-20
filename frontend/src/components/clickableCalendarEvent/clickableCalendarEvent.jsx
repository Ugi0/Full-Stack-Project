import React, { useState } from 'react'
import './clickableCalendarEvent.css'
import './clickableModal.css'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

function ClickableCalendarEvent(props) {
    const [item, setItem] = useState(props.item)

    const handleClick = () => {
        props.handler({
            item: props.item,
            chHandler: handler
        })
    }
    const handler = (e) => {
        if (e === undefined) return;
        setItem(e)
    }
    const renderIcon = () => {
        if (props.draw.includes("icon")) {
            return <AccessTimeFilledIcon  style={{fill: '#2b583e'}} sx={{width: '15px', height: '15px'}}/>
        }
    }
    const renderTitle = () => {
        if (props.draw.includes("title")) {
            return <div className="eventTitle">
                        {renderIcon()}
                        <p> {item.title} </p>
                    </div>
        }
    }
    const renderTime = () => {
        if (props.draw.includes("time")) {
            return <div className="eventTime">
                        <p> {item.time.split("T")[1]} </p>
                        {renderDuration()}
                    </div>
        }
    }
    const renderDuration = () => {
        if (props.draw.includes("duration")) {
            return <p> {(hours+addHours).toLocaleString(undefined, {minimumIntegerDigits: 2})}:{(minutes+addMinutes).toLocaleString(undefined, {minimumIntegerDigits: 2})} </p>
        }
    }
    let [hours, minutes] = [0,0];
    if (item.time) {
        [hours, minutes] = item.time.split("T")[1].split(":").map(e => parseInt(e))
    }
    let [addHours, addMinutes] = [0,0];
    if (item.duration) {
        [addHours, addMinutes] = item.duration.split(":").map(e => parseInt(e))
    }
    return (
        <div className="event" key={props.id} onClick={handleClick} style={props.sx}>
            {renderTitle()}
            {renderTime()}
        </div>
    )
}

export default ClickableCalendarEvent;
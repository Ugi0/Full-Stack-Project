import { useState, useEffect } from "react";
import Notification from "../notification/notification";
import React from "react";
import './notificationHandler.css'

function NotificationHandler(props) {
    const currentTime = new Date();
    const [dismissed, setDismissed] = useState([]);
    const [time, setTime] = useState(Date.now());

    useEffect(() => { //check for new notifications to show every 5 minutes
        const interval = setInterval(() => setTime(Date.now()), 1000 * 60 * 5);
        return () => {
            clearInterval(interval);
        };
    }, []);
    

    const handleDismiss = (id) => {
        setDismissed(dismissed.concat([id]));
    }

    return <div className="notificationHandler">
        {Object.values(props.userData.events).map((event, i) => {
            return <React.Fragment key={i}>
                {[...event.values()].map((e, j) => {
                    if (dismissed.includes(e.id)) return <React.Fragment key={j}></React.Fragment>
                    const cur = new Date(e.time);
                    if (cur - currentTime < 60*60*1000 && cur > currentTime) {
                        return <Notification key={j} handleDismiss={handleDismiss} timeDifference={cur - currentTime} item={e}/>
                    }
                    return <React.Fragment key={j}></React.Fragment>
                })}
            </React.Fragment>
        })}
    </div>
}

export default NotificationHandler;
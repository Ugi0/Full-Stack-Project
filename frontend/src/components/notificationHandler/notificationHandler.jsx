import Notification from "../notification/notification";
import './notificationHandler.css'

function NotificationHandler(props) {
    const currentTime = new Date();

    return <div className="notificationHandler">
        {Object.values(props.events).map((event, i) => {
            return <>
                {[...event.values()].map((e, j) => {
                    const cur = new Date(e.time);
                    if (cur - currentTime < 60*60*1000 && cur > currentTime) {
                        return <Notification timeDifference={cur - currentTime} item={e} key={i*200+j} />
                    }
                    return <></>
                })}
            </>
        })}
    </div>
}

export default NotificationHandler;
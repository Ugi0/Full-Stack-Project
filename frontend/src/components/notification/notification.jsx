import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ModeIcon from '@mui/icons-material/Mode';
import EventIcon from '@mui/icons-material/Event';
import './notification.css'

function Notification(props) {
    const icons = {
        'Lecture': <AutoStoriesIcon style={{fontSize: '50px'}} />,
        'Assignment': <CheckCircleIcon style={{fontSize: '50px'}} />,
        'Exam': <ModeIcon style={{fontSize: '50px'}} />,
        'Event': <EventIcon style={{fontSize: '50px'}} />
    }

    const itemType = props.item.type[0].toUpperCase() +
                props.item.type.slice(1,-1);

    const titleText = () => {
        if (itemType === 'Lecture') {
            return props.item.course.title
        }
        return props.item.title
    }

    return (
        <div className="notification">
            <div className='notificationIcon'>
                {icons[itemType]}
            </div>
            <div className="notificationText">
                <div className='notificationTitle'>
                    <h4>
                        {titleText()}
                    </h4>
                </div>
                <div className='notificationDescription'>
                    <p>
                        {itemType} starting in {parseInt(props.timeDifference / (1000*60))} minutes.
                    </p>
                </div>
            </div>
            <div className="notificationButtons">
                <button onClick={() => props.handleDismiss(props.item.id)}>
                    Dismiss
                </button>
            </div>
        </div>
    )
}

export default Notification;
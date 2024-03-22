import useSound from 'use-sound'
import mySound from '../../sounds/notification.wav'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './notification.css'
import { useEffect } from 'react';

function Notification(props) {
    const [playSound] = useSound(mySound)

    //playSound()

    const itemType = props.item.type[0].toUpperCase() +
                props.item.type.slice(1,-1);

    return (
        <div className="notification">
            <div className='notificationIcon'>
                <CheckCircleIcon style={{fontSize: '50px'}} />
            </div>
            <div className="notificationText">
                <div className='notificationTitle'>
                    <h4>
                        {props.item.title}
                    </h4>
                </div>
                <div className='notificationDescription'>
                    <p>
                        {itemType} starting in {parseInt(props.timeDifference / (1000*60))} minutes.
                    </p>
                </div>
            </div>
            <div className="notificationButtons">
                <button>
                    Dismiss
                </button>
            </div>
        </div>
    )
}

export default Notification;
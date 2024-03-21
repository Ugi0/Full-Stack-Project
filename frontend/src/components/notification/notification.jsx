import useSound from 'use-sound'
import mySound from '../../sounds/notification.wav'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './notification.css'
import { useEffect } from 'react';

function Notification(props) {
    const [playSound] = useSound(mySound)

    if (!props.visible) return <></>

    playSound()

    return (
        <div className="notification">
            <div className='notificationIcon'>
                <CheckCircleIcon style={{fontSize: '50px'}} />
            </div>
            <div className="notificationText">
                <div className='notificationTitle'>
                    <h4>
                        Svenska för IT-studenter
                    </h4>
                </div>
                <div className='notificationDescription'>
                    <p>
                        Lecture starting in 59 minutes.
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
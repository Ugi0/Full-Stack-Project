import './changeCalendarTime.css'

function ChangeCalendarTimeButtons(props) {
    return <div className="changeCalendarTimeRoot">
            <button onClick={() => props.changeTime(-1)}>
                <i className="arrow left" />
            </button>
            <button onClick={() => props.changeTime(1)}>
                <i className="arrow right" />
            </button>
        </div>
}

export default ChangeCalendarTimeButtons;
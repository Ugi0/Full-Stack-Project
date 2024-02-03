import React from 'react'
import '../styles/clickableCalendarEvent.css'
import '../styles/clickableModal.css'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

export class ClickableCalendarEvent extends React.Component {
    constructor(props) {
        super(props);
        this.draw = props.draw;
        this.sx = props.sx;
        this.state = { 
            courseid: props.courseid,
            title: props.title,
            time: props.time,
            duration: props.duration,
            description: props.description
        }
    }
    handleClick = () => {
        this.props.handler({
            editable: false,
            courseid: this.state.courseid,
            title: this.state.title, newtitle: this.state.title,
            time: this.state.time, newtime: this.state.time,
            duration: this.state.duration, newduration: this.state.duration,
            description: this.state.description, newdescription: this.state.description,
            chHandler: this.handler
        })
    }
    handler = (props) => {
        this.setState({
            ...props
        })
      }
    render() {
        const [hours, minutes] = this.state.time.split("T")[1].split(":").map(e => parseInt(e))
        const [addHours, addMinutes] = this.state.duration.split(":").map(e => parseInt(e))
        return (
            <div className="event" key={this.state.courseid} onClick={this.handleClick} style={this.sx}>
                {this.draw.includes("title") ? <div className="eventTitle">
                    {this.draw.includes("icon") ? <AccessTimeFilledIcon  style={{fill: '#2b583e'}} sx={{width: '15px', height: '15px'}}/> : "" }
                    <p> {this.state.title} </p>
                </div> : ""
                }
                {this.draw.includes("times") ? <div className="eventTime">
                    <p> {this.state.time.split("T")[1]} </p>
                    <p> {(hours+addHours).toLocaleString(undefined, {minimumIntegerDigits: 2})}:{(minutes+addMinutes).toLocaleString(undefined, {minimumIntegerDigits: 2})} </p>
                </div> : ""}
            </div>
        )
    }
}
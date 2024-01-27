import React from "react";
import '../../styles/weekCalendar.css'
import { Rnd } from "react-rnd";
import AddIcon from '@mui/icons-material/Add';
import { ClickableCalendarEvent } from "../clickableCalendarEvent";
import Box from '@mui/material/Box';
import { IconButton } from "@mui/material";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SaveIcon from '@mui/icons-material/Save';

export class WeekCalendar extends React.Component {
    //Modal can't be closed if it's placed inside the Rnd
    //Therefore, the modal will be located in the WeekCalendar parent
    //and opened through the children
    constructor(props) {
        super(props);
        this.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        this.hourOptions = Array.from(Array(24).keys()).map((e) => {
            return {
                value: e.toLocaleString(undefined, {minimumIntegerDigits: 2}), 
                label: e.toLocaleString(undefined, {minimumIntegerDigits: 2})
            }})
        this.minuteOptions = Array.from(Array(60).keys()).map((e) => {
            return {
                value: e.toLocaleString(undefined, {minimumIntegerDigits: 2}), 
                label: e.toLocaleString(undefined, {minimumIntegerDigits: 2})
            }})
        this.state = {
          editable: props.editable,
          open: false, modalEditable: false,
          chHandler: "",
          title: "", newtitle: "",
          time: "", newtime: "",
          duration: "", newduration: "",
          description: "", newdescription: "",
          courses: [
            {title: "Course 1", date: '2018-06-12', day: 0, time: '12:00', duration: '1:00', description: ""},
            {title: "Course 2", date: '2018-06-12', day: 0, time: '14:00', duration: '2:00', description: ""},
            {title: "Course 3", date: '2018-06-12', day: 0, time: '14:00', duration: '2:00', description: ""},
            {title: "Course 4", date: '2018-06-12', day: 0, time: '14:00', duration: '2:00', description: ""},
            {title: "Course 5", date: '2018-06-12', day: 0, time: '14:00', duration: '2:00', description: ""},
            {title: "Course 6", date: '2018-06-12', day: 0, time: '14:00', duration: '2:00', description: ""},
            {title: "Course 7", date: '2018-06-12', day: 0, time: '14:00', duration: '2:00', description: ""},
            {title: "Course 8", date: '2018-06-12', day: 0, time: '14:00', duration: '2:00', description: ""},
            {title: "Course 2", date: '2018-06-12', day: 1, time: '14:00', duration: '1:30', description: "Test"},
            {title: "Course 2", date: '2018-06-12', day: 2, time: '14:00', duration: '1:30', description: "Test"},
            {title: "Course 2", date: '2018-06-12', day: 3, time: '14:00', duration: '1:30', description: "Test"},
            {title: "Course 2", date: '2018-06-12', day: 4, time: '14:00', duration: '1:30', description: "Test"},
            {title: "Svenska för IT-studenter", day: 5, time: '14:00', duration: '1:30', description: "Test"},
            {title: "Digital Communication", day: 6, time: '14:00', duration: '1:30', description: "Test"}
          ],
          x: 10,
          y: 10,
          width: 815,
          height: 200
        };
      }
      //Create a handler so the children can update the open state
      handler = (props) => {
        this.setState({
            open: true, ...props
        })
      }
      renderTime = () => {
        if (this.state.modalEditable) {
            return (
                <input
                    type="datetime-local"
                    id="newtime"
                    value={this.state.newtime}
                    onChange={this.handleInputChange}
                />
            )
        } else {
            const date = new Date(this.state.time);
            return (
                <Typography id="newduration" sx={{ mt: 2, margin:0 }} suppressContentEditableWarning={true} contentEditable={this.state.modalEditable} onInput={this.handleInputChange}>
                    {date.toLocaleDateString()} {date.toLocaleTimeString().slice(0,5)}
                </Typography>
            )
        }
      }
      renderDuration = () => {
        if (this.state.modalEditable) {
            return (
                <input type="time" id="newduration" value={this.state.newduration.padStart(5,'0')} onChange={this.handleInputChange}/>
            )
        } else {
            return (
                <Typography id="newduration" sx={{ mt: 2, margin:0 }} suppressContentEditableWarning={true} contentEditable={this.state.editable} onInput={this.handleInputChange}>
                    {this.state.duration.split(":")[0]}h {this.state.duration.split(":")[1]}min
                </Typography>
            )
        }
      }
      renderModal = () => {
        return <div>
            <Modal
                open={this.state.open}
                onClose={this.handleClose}
            >
                <Box className="modalContent">
                    <Typography id="newtitle" variant="h6" component="h2" suppressContentEditableWarning={true} contentEditable={this.state.modalEditable} onInput={this.handleInputChange}>
                        {this.state.title}
                    </Typography>
                    <Typography id="newdescription" sx={{ mt: 2 }} suppressContentEditableWarning={true} contentEditable={this.state.modalEditable} onInput={this.handleInputChange}>
                        {this.state.description}
                    </Typography>
                    Time:
                    {this.renderTime()}
                    Duration:
                    {this.renderDuration()}
                    <IconButton sx={{position:'absolute', top:0, right:0}} onClick={this.handleEditClick}>
                        {this.renderIcon()}
                    </IconButton>
                </Box>
            </Modal>
        </div>
    }
    renderIcon = () => {
        if (this.state.modalEditable) {
            return <SaveIcon />
        }
        return <BorderColorIcon/>
    }
    handleClose = () => {
        this.setState({
            open: false,
            modalEditable: false
        })
    }
    handleEditClick = () => {
        this.setState({
            modalEditable: !this.state.modalEditable,
            newtime: this.state.time,
            newduration: this.state.duration
        })
        if (this.state.modalEditable) {
            this.state.chHandler({
                title: this.state.newtitle,
                description: this.state.newdescription,
                duration: this.state.newduration,
                time: this.state.newtime
            })
            this.setState({
                open: false
            })
        }
    }
    handleInputChange = (event) => {
        const name = event.target.id;
        let value = event.target.innerText.replace(/(\r\n|\n|\r)/gm, "");
        if (event.target.value) {
            value = event.target.value;
        }
        this.setState({
          [name]: value,
        });
        event.preventDefault();
    };
    render() {
        return (
            <div>
                <Rnd disableDragging={!this.props.editable} enableResizing={this.props.editable} size={{ width: this.state.width,  height: this.state.height }}
            position={{ x: this.state.x, y: this.state.y }}
            onDragStop={(e, d) => { this.setState({ x: d.x, y: d.y }) }}
            onResizeStop={(e, direction, ref, delta, position) => {
              this.setState({
                width: `${Math.max(Number(ref.style.width.slice(0,-2)), 815)}px`, //Keep at min side enough to show the names of the days
                height: ref.style.height,
                ...position,
              });
            }}>
                <div className="calendarRoot">
                    {
                    //TODO Make add button work
                    //TODO Actually fetch data from the backend to display
                    this.days.map((day, index) => {
                        return (
                            <div className="day" key={index}>
                                <div className="dayName">
                                    <b>{day}</b>
                                    <p className="eventNumber"> {this.state.courses.filter((item) => item.day === index).length} </p>
                                </div>
                                {
                                    this.state.courses.filter((item) => item.day === index).map((item, index) => {
                                        return (
                                            <ClickableCalendarEvent
                                                title = {item.title}
                                                description = {item.description}
                                                time = {`${item.date}T${item.time}`}
                                                duration = {item.duration}
                                                index = {item.index}
                                                handler = {this.handler}
                                                key = {index}
                                            />
                                        )
                                    })
                                }
                                <button className="newButton">
                                    <AddIcon/> New
                                </button>
                            </div>
                        )
                    })
                    }
                </div>
            </Rnd>
                {this.renderModal()}
            </div>
        )
    }
}
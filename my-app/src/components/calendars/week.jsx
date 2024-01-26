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
    constructor() {
        super();
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
          open: false, editable: false,
          chHandler: "",
          title: "", newtitle: "",
          time: "", newtimehour: "", newtimeminute: "",
          duration: "", newdurationhour: "", newdurationminute: "",
          description: "", newdescription: "",
          courses: [
            {title: "Course 1", day: 0, time: '12:00', duration: '1:00', description: ""},
            {title: "Course 2", day: 1, time: '14:00', duration: '1:30', description: "Test"},
            {title: "Course 2", day: 2, time: '14:00', duration: '1:30', description: "Test"},
            {title: "Course 2", day: 3, time: '14:00', duration: '1:30', description: "Test"},
            {title: "Course 2", day: 4, time: '14:00', duration: '1:30', description: "Test"},
            {title: "Course 2", day: 5, time: '14:00', duration: '1:30', description: "Test"},
            {title: "Course 2", day: 6, time: '14:00', duration: '1:30', description: "Test"}
          ],
          x: 10,
          y: 10,
          width: 780,
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
        if (this.state.editable) {
            return (
                <div>
                    <select onChange={this.handleInputChange} id="newtimehour">
                        <option value="">{this.state.time.split(":")[0]}</option>
                        {this.hourOptions.map(e => {
                            return (<option value={e.value} label={e.label}>
                            </option>)
                        })}</select>
                    <select onChange={this.handleInputChange} id="newtimeminute">
                        <option value="">{this.state.time.split(":")[1]}</option>
                        {this.minuteOptions.map(e => {
                            return (<option value={e.value} label={e.label}>
                            </option>)
                        })}</select>
                </div>
            )
        } else {
            return (
                <Typography id="newduration" sx={{ mt: 2, margin:0 }} suppressContentEditableWarning={true} contentEditable={this.state.editable} onInput={this.handleInputChange}>
                    {this.state.time}
                </Typography>
            )
        }
      }
      renderDuration = () => {
        if (this.state.editable) {
            return (
                <div>
                    <select onChange={this.handleInputChange} id="newdurationhour">
                        <option value="">{this.state.duration.split(":")[0]}</option>
                        {this.hourOptions.map(e => {
                            return (<option value={e.value} label={e.label}>
                            </option>)
                        })}</select>
                    <select onChange={this.handleInputChange} id="newdurationminute">
                        <option value="">{this.state.duration.split(":")[1]}</option>
                        {this.minuteOptions.map(e => {
                            return (<option value={e.value} label={e.label}>
                            </option>)
                        })}</select>
                </div>
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
                    <Typography id="newtitle" variant="h6" component="h2" suppressContentEditableWarning={true} contentEditable={this.state.editable} onInput={this.handleInputChange}>
                        {this.state.title}
                    </Typography>
                    <Typography id="newdescription" sx={{ mt: 2 }} suppressContentEditableWarning={true} contentEditable={this.state.editable} onInput={this.handleInputChange}>
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
        if (this.state.editable) {
            return <SaveIcon />
        }
        return <BorderColorIcon/>
    }
    handleClose = () => {
        this.setState({
            open: false
        })
    }
    handleEditClick = () => {
        this.setState({
            editable: !this.state.editable,
            newtimehour: this.state.time.split(":")[0], newtimeminute: this.state.time.split(":")[1],
            newdurationhour: this.state.duration.split(":")[0], newdurationminute: this.state.duration.split(":")[1],
        })
        if (this.state.editable) {
            this.state.chHandler({
                title: this.state.newtitle,
                description: this.state.newdescription,
                duration: this.state.newdurationhour.toLocaleString(undefined, {minimumIntegerDigits: 2})+':'+this.state.newdurationminute.toLocaleString(undefined, {minimumIntegerDigits: 2}),
                time: this.state.newtimehour.toLocaleString(undefined, {minimumIntegerDigits: 2})+':'+this.state.newtimeminute.toLocaleString(undefined, {minimumIntegerDigits: 2})
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
                <Rnd size={{ width: this.state.width,  height: this.state.height }}
            position={{ x: this.state.x, y: this.state.y }}
            onDragStop={(e, d) => { this.setState({ x: d.x, y: d.y }) }}
            onResizeStop={(e, direction, ref, delta, position) => {
              this.setState({
                width: `${Math.max(Number(ref.style.width.slice(0,-2)), 780)}px`, //Keep at min side enough to show the names of the days
                height: ref.style.height,
                ...position,
              });
            }}>
                <div className="calendarRoot">
                    { //TODO Make days take less space vertically
                    //TODO Make add button work
                    //TODO Actually fetch data from the backend to display
                    this.days.map((day, index) => {
                        return (
                            <div className="day">
                                <div className="dayName">
                                    <b>{day}</b>
                                    <p className="eventNumber"> {this.state.courses.filter((item) => item.day === 0).length} </p>
                                </div>
                                {
                                    this.state.courses.filter((item) => item.day === index).map((item, index) => {
                                        return (
                                            <ClickableCalendarEvent
                                                title = {item.title}
                                                description = {item.description}
                                                time = {item.time}
                                                duration = {item.duration}
                                                index = {index}
                                                handler = {this.handler}
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
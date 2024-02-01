import React from "react";
import '../../styles/weekCalendar.css'
import { Rnd } from "react-rnd";
import AddIcon from '@mui/icons-material/Add';
import { ClickableCalendarEvent } from "../clickableCalendarEvent";
import { AddEvent } from "../addEvent";
import { CalendarModal } from "../calendarModal";

export class WeekCalendar extends React.Component {
    //Modal can't be closed if it's placed inside the Rnd
    //Therefore, the modal will be located in the WeekCalendar parent
    //and opened through the children

    // Break this into smaller components
    static getDerivedStateFromProps(props, state) {
        state.courses = props.courses;
        return state;
    }
    constructor(props) {
        super(props);
        this.setCourses = props.setCourses;
        this.openAddEventModal = React.createRef();
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
          courses: [],
          editable: props.editable,
          open: false,
          chHandler: "",
          title: "",
          time: "",
          duration: "",
          description: "",
          courseid: 0,
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
        });
      }
    saveEvent = (title, description, time, duration) => {
        this.state.chHandler({
            title: title,
            description: description,
            duration: duration,
            time: time
        })
        const oldItem = this.state.courses.filter((item) => item.courseid === this.state.courseid ? true: false)[0]
        const newCourses = this.state.courses.filter((item) => item.courseid !== this.state.courseid ? true: false).concat([{
            title: title, time: time, 
            duration: duration, description: description, 
            repeating: oldItem.repeating, repeatingTime: oldItem.repeatingTime,
            courseid: this.state.courseid
        }]);
        this.setState({
            open: false,
            courses: newCourses
        });
        this.setCourses(newCourses);
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
    handleCloseAddModal = (props) => {
        this.openAddEventModal.current.closeModal();
    }
    handleOpenAddModal = () => {
        this.openAddEventModal.current.openModal();
    }
    handleClose = () => {
        this.setState({
            open: false,
        })
    }
    render() {
        return (
            <>
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
                    this.days.map((day, index) => {
                        const today = new Date().getDay() === [1,2,3,4,5,6,0][index];
                        return (
                            <div className="day" key={index} style={{ backgroundColor: today ? '#3c4543' : '#1d2120'}}>
                                <div className="dayName">
                                    <b>{day}</b>
                                    <p className="eventNumber">
                                        {this.state.courses.filter((item) => {
                                            const d = new Date(item.time.split("T")[0]);
                                            return [6,0,1,2,3,4,5][d.getDay()] === index;
                                        }).length} 
                                    </p>
                                </div>
                                {this.state.courses.filter((item) => {
                                        const d = new Date(item.time.split("T")[0]);
                                        return [6,0,1,2,3,4,5][d.getDay()] === index;
                                    }).map((item) => {
                                        return (
                                            <ClickableCalendarEvent
                                                title = {item.title}
                                                description = {item.description}
                                                time = {item.time}
                                                courseid = {item.courseid}
                                                duration = {item.duration}
                                                handler = {this.handler}
                                                key = {item.courseid}
                                            />
                                        )
                                    })
                                }
                                <button className="newButton" onClick={this.handleOpenAddModal}>
                                    <AddIcon/> New
                                </button>
                            </div>
                        )
                    })
                    }
                </div>
            </Rnd>
                <CalendarModal 
                    saveEvent={this.saveEvent} 
                    handleClose = {this.handleClose}
                    title = {this.state.title} description = {this.state.description}
                    time={this.state.time} open={this.state.open} duration={this.state.duration}
                />
                <AddEvent courses={this.state.courses} setCourses={this.setCourses} ref={this.openAddEventModal} onClose={this.handleCloseAddModal}/>
            </>
        )
    }
}
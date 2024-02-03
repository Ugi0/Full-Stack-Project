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

    static getDerivedStateFromProps(props, state) {
        state.editable = props.editable;
        state.courses = props.courses;
        return state;
    }
    constructor(props) {
        super(props);
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
          x: props.sx.x,
          y: props.sx.y,
          width: props.sx.width,
          height: props.sx.height
        };
      }
      //Create a handler so the children can update the open state
    handler = (props) => {
        if (this.state.editable) return
        this.setState({
            open: true, ...props
        });
      }
    deleteEvent = () => {
        this.setState({
            courses: this.state.courses.filter((item) => item.courseid !== this.state.courseid),
            open: false
        })
        this.props.deleteCourse(this.state.courseid)
    }
    saveEvent = (title, description, time, duration) => {
        let newCourses = this.state.courses;
        this.state.chHandler({
            title: title,
            description: description,
            duration: duration,
            time: time
        })
        const oldItem = newCourses.find((item) => item.courseid === this.state.courseid)
        newCourses = newCourses.filter((item) => item.courseid !== this.state.courseid).concat([{
            title: title, time: time, 
            duration: duration, description: description, 
            repeating: oldItem.repeating, repeatingTime: oldItem.repeatingTime,
            courseid: this.state.courseid
        }]);
        this.setState({
            open: false,
            courses: newCourses
        });
        this.props.setCourses(newCourses);
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
    handleOpenAddModal = (time) => {
        if (this.state.editable) return
        this.openAddEventModal.current.openModal(time);
    }
    handleClose = () => {
        this.setState({
            open: false,
        })
    }
    render() {
        const today = new Date();
        let cur = new Date();
        cur.setDate(today.getDate()-[6,0,1,2,3,4,5][today.getDay()]); //Set current to previous monday
        const monday = new Date(cur);
        cur.setDate(cur.getDate() -1);
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
                <div className="weekCalendarRoot">
                    {
                    this.days.map((day, index) => {
                        const isItToday = today.getDay() === [1,2,3,4,5,6,0][index];
                        cur.setDate(cur.getDate()+1);
                        return (
                            <div className="weekDay" key={index} style={{ backgroundColor: isItToday ? '#3c4543' : '#1d2120'}}>
                                <div className="dayName">
                                    <b>{day}</b>
                                    <p className="eventNumber">
                                        {this.state.courses.filter((item) => {
                                            return cur.toDateString() === new Date(item.time.split("T")[0]).toDateString()
                                        }).length} 
                                    </p>
                                </div>
                                { this.state.courses.filter((item) => {
                                        return cur.toDateString() === new Date(item.time.split("T")[0]).toDateString();
                                    })
                                    .sort((a,b) => new Date(a.time) - new Date(b.time))
                                    .map((item) => {
                                        return (
                                            <ClickableCalendarEvent
                                                title = {item.title}
                                                description = {item.description}
                                                time = {item.time}
                                                courseid = {item.courseid}
                                                duration = {item.duration}
                                                handler = {this.handler}
                                                key = {item.courseid}
                                                draw = {["title", "icon", "times"]}
                                                sx = {{padding: '5px 0 5px 0'}}
                                            />
                                        )
                                    })
                                }
                                <button className="newButton" onClick={() => { //Set date to clicked day in addComponent
                                    const d = new Date(monday);
                                    d.setDate(d.getDate() + index);
                                    this.handleOpenAddModal(d.toISOString().slice(0,16))
                                }}>
                                    <AddIcon/> New
                                </button>
                            </div>
                        )
                    })
                    }
                </div>
            </Rnd>
                <CalendarModal 
                    saveEvent={this.saveEvent} deleteEvent ={this.deleteEvent}
                    handleClose = {this.handleClose}
                    title = {this.state.title} description = {this.state.description}
                    time={this.state.time} open={this.state.open} duration={this.state.duration}
                    courseid={this.state.courseid}
                />
                <AddEvent courses={this.state.courses} setCourses={this.props.setCourses} ref={this.openAddEventModal} onClose={this.handleCloseAddModal}/>
            </>
        )
    }
}
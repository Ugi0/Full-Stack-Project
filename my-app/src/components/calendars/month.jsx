import React from "react";
import '../../styles/monthCalendar.css'
import { Rnd } from "react-rnd";
import { CalendarModal } from "../calendarModal";
import { AddEvent } from "../addEvent";

export class MonthCalendar extends React.Component {
    static getDerivedStateFromProps(props, state) {
        state.editable = props.editable;
        state.courses = props.courses;
        return state;
    }
    constructor(props) {
        super(props);
        this.gridWidth = 7;
        this.gridHeight = 5;
        this.state = {
            x: props.sx.x, y: props.sx.y,
            width: props.sx.width, height: props.sx.height,
            title: "", description: "",
            time: "", duration: "",
            courseid: 0,
            open: false
        }
    }
    render() {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        const today = new Date();
        let firstDayOfTheMonth = new Date();
        firstDayOfTheMonth.setDate(0);
        firstDayOfTheMonth.setDate(firstDayOfTheMonth.getDate() - [6,0,1,2,3,4,5][firstDayOfTheMonth.getDay()] - 1);
        return (
            <>
                <Rnd disableDragging={!this.props.editable} enableResizing={this.props.editable} size={{ width: this.state.width,  height: this.state.height }}
                position={{ x: this.state.x, y: this.state.y }}
                onDragStop={(e, d) => { this.setState({ x: d.x, y: d.y }) }}
                onResizeStop={(e, direction, ref, delta, position) => {
                this.setState({
                    width: `${Math.max(Number(ref.style.width.slice(0,-2)), 815)}px`,
                    height: ref.style.height,
                    ...position,
                });
                }}>
                    <h2> {monthNames[today.getMonth()]} {today.getFullYear()} </h2>
                    <div className="dayOfTheWeek">
                        <div className="monthDayName">Mon</div>
                        <div className="monthDayName">Tue</div>
                        <div className="monthDayName">Wed</div>
                        <div className="monthDayName">Thu</div>
                        <div className="monthDayName">Fri</div>
                        <div className="monthDayName">Sat</div>
                        <div className="monthDayName">Sun</div>
                    </div>
                    <div className="monthCalendarRoot" >
                        {[...Array(this.gridHeight*this.gridWidth)].map((_,i) => {
                            firstDayOfTheMonth.setDate(firstDayOfTheMonth.getDate() + 1);
                            return (
                                <div className="monthDay" key={i} style={{ backgroundColor: today.getMonth()===firstDayOfTheMonth.getMonth() ? '#1d2021' : '#1d212040'}}>
                                    <div className={today.toDateString()===firstDayOfTheMonth.toDateString() ? 'currentDateNumber' : "dateNumber"} >
                                        {firstDayOfTheMonth.getDate()}
                                    </div>
                                    <div className="monthEvent"> test </div>
                                </div>
                            )
                        })}
                    </div>
                </Rnd>
                <CalendarModal 
                    saveEvent={this.saveEvent} deleteEvent ={this.deleteEvent}
                    handleClose = {this.handleClose}
                    title = {this.state.title} description = {this.state.description}
                    time={this.state.time} open={this.state.open} duration={this.state.duration}
                    courseid={this.state.courseid}
                />
                <AddEvent courses={this.state.courses} setCourses={this.setCourses} ref={this.openAddEventModal} onClose={this.handleCloseAddModal}/>
            </>
        )
    }
}
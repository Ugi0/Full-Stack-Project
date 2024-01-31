import React from "react";
import '../styles/addEvent.css'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { titleInput, descriptionInput } from "./inputElements";
import { IconButton } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';

export class AddEvent extends React.Component {
    static getDerivedStateFromProps(props, state) {
        state.courses = props.courses;
        return state;
    }
    constructor(props) {
        super(props);
        this.setCourses = props.setCourses;
        this.onClose = props.onClose;
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        this.state = {
            courses: props.courses,
            modalOpen: false,
            type: "0",
            title: "New title", description: "New description",
            time: now.toISOString().slice(0,16), duration: "01:00",
            repeating: false, repeatingTime: "",
            chosenCourse: ""
        }
    }
    openModal = () => { this.setState({ modalOpen: true })}
    closeModal = () => { this.setState({ modalOpen: false })}
    handleModalClose = () => {
        this.setState({
            modalOpen: false
        })
        this.onClose();
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
    handleCheckBoxClick = () => {
        this.setState({
            repeating: !this.state.repeating
        })
    }
    renderTime = () => {
        return (
            <input
                type="datetime-local"
                id="time"
                value={this.state.time}
                onChange={this.handleInputChange}
            />
        )
      }
    renderDuration = () => {
        return (
            <input type="time" id="duration" value={this.state.duration.padStart(5,'0')} onChange={this.handleInputChange}/>
        )
    }
    
    renderCourseOptions = () => {
        return (
            <select id="chosenCourse">

            </select>
        )
    }

    renderOptions = () => {
        switch (this.state.type) {
            case '0': 
                return (
                    <div className="options">
                        {titleInput(this.handleInputChange)}
                        {descriptionInput(this.handleInputChange)}
                        <div>
                            <p>Time</p>
                            {this.renderTime()}
                        </div>
                        <div>
                            <p>Duration</p>
                            {this.renderDuration()}
                        </div>
                        <div>
                            <p>Repeating</p>
                            <input type="checkbox" checked={this.state.repeating} id="repeating" onChange={this.handleCheckBoxClick} />
                        </div>
                        {this.renderRepeating()}
                    </div>
                )
            case '1':
                return (
                    <div className="options">
                        {titleInput(this.handleInputChange)}
                        <div>
                            <p>Course</p>
                            {this.renderCourseOptions()}
                        </div>
                        {descriptionInput(this.handleInputChange)}
                        <div>
                            <p>Deadline</p>
                            {this.renderTime()}
                        </div>
                    </div>
                )
            case '2':
                return (
                    <div className="options">
                        {titleInput(this.handleInputChange)}
                        <div>
                            <p>Course</p>
                            {this.renderCourseOptions()}
                        </div>
                        {descriptionInput(this.handleInputChange)}
                        <div>
                            <p>Time</p>
                            {this.renderTime()}
                        </div>
                    </div>
                )
            case '3':
                return (
                    <div className="options">
                        {titleInput(this.handleInputChange)}
                        {descriptionInput(this.handleInputChange)}
                        <div>
                            <p>Time</p>
                            {this.renderTime()}
                        </div>
                    </div>
                )
            default:
                return (<div></div>)
        }
    }
    renderRepeating = () => {
        if (this.state.repeating) {
            return (
            <div>
                <div>
                    <p>Repeating time</p>
                    <select id="repeatingTime" onChange={this.handleInputChange}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="weekly">Monthly</option>
                    </select>
                </div>
            </div>)
        }

    }
    render() {
        if (this.state.modalOpen) {
            return (
                <div>
                    <Modal
                        open={this.state.modalOpen}
                        onClose={this.handleModalClose}
                    >
                        <Box className="modalContent">
                            <div>
                                <p>Type</p> 
                                <select id="type" onChange={this.handleInputChange}>
                                    <option value="0">Course</option>
                                    <option value="1">Assignment</option>
                                    <option value="2">Exam</option>
                                    <option value="3">Event</option>
                                </select>
                            </div>
                            {this.renderOptions()}
                            <IconButton sx={{position:'absolute', top:0, right:0}} onClick={() => {
                                this.setCourses([...this.state.courses, {
                                    //TODO Give each event a unique courseId that is passed along
                                    title: this.state.title, description: this.state.description,
                                    time: this.state.time, duration: this.state.duration,
                                    repeating: this.state.repeating, repeatingTime: this.state.repeatingTime,
                                    index: this.state.courses.length
                                }]);
                                this.handleModalClose();
                                }}>
                                <SaveIcon />
                            </IconButton>
                        </Box>
                    </Modal>
                </div>
            )
        }
    }
}
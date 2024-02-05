import React, { useEffect, useState } from "react";
import '../styles/addEvent.css'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { titleInput, descriptionInput } from "./inputElements";
import { IconButton } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { getRandomID } from "../api/getRandomID";

function AddEvent(props){
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    const [time, setTime] = useState(props.time);
    const [duration, setDuration] = useState("1:00");
    const [title, setTitle] = useState("New title");
    const [description, setDescription] = useState("New description");
    
    const [type, setType] = useState("0");
    const [repeating, setRepeating] = useState(false);
    const [repeatingTime, setRepeatingTime] = useState("");

    //const [chosenCourse, setChosenCourse] = useState(""); //Not in use yet
    useEffect(() => {
        setTime(props.time)
    }, [props.time])

    const handleModalClose = () => {
        props.onClose();
    }
    const handleCheckBoxClick = () => {
        setRepeating(!repeating)
    }
    const renderTime = () => {
        return (
            <input
                type="datetime-local"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
            />
        )
      }
    const renderDuration = () => {
        return (
            <input type="time" id="duration" value={duration.padStart(5,'0')} onChange={(e => setDuration(e.target.value))}/>
        )
    }
    
    const renderCourseOptions = () => {
        return (
            <select id="chosenCourse">

            </select>
        )
    }

    const renderOptions = () => {
        switch (type) {
            case '0': 
                return (
                    <div className="options">
                        {titleInput(setTitle)}
                        {descriptionInput(setDescription)}
                        <div>
                            <p>Time</p>
                            {renderTime()}
                        </div>
                        <div>
                            <p>Duration</p>
                            {renderDuration()}
                        </div>
                        <div>
                            <p>Repeating</p>
                            <input type="checkbox" checked={repeating} id="repeating" onChange={handleCheckBoxClick} />
                        </div>
                        {renderRepeating()}
                    </div>
                )
            case '1':
                return (
                    <div className="options">
                        {titleInput(setTitle)}
                        <div>
                            <p>Course</p>
                            {renderCourseOptions()}
                        </div>
                        {descriptionInput(setDescription)}
                        <div>
                            <p>Deadline</p>
                            {renderTime()}
                        </div>
                    </div>
                )
            case '2':
                return (
                    <div className="options">
                        {titleInput(setTitle)}
                        <div>
                            <p>Course</p>
                            {renderCourseOptions()}
                        </div>
                        {descriptionInput(setDescription)}
                        <div>
                            <p>Time</p>
                            {renderTime()}
                        </div>
                    </div>
                )
            case '3':
                return (
                    <div className="options">
                        {titleInput(setTitle)}
                        {descriptionInput(setDescription)}
                        <div>
                            <p>Time</p>
                            {renderTime()}
                        </div>
                    </div>
                )
            default:
                return (<></>)
        }
    }
    const renderRepeating = () => {
        if (repeating) {
            return (
            <div>
                <div>
                    <p>Repeating time</p>
                    <select id="repeatingTime" onChange={(e) => setRepeatingTime(e.target.value)}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="weekly">Monthly</option>
                    </select>
                </div>
            </div>)
        }

    }
    
    return (
        <div>
            <Modal
                open={props.open ?? false}
                onClose={handleModalClose}
            >
                <Box className="modalContent">
                    <div>
                        <p>Type</p> 
                        <select id="type" onChange={(e) => setType(e.target.value)}>
                            <option value="0">Course</option>
                            <option value="1">Assignment</option>
                            <option value="2">Exam</option>
                            <option value="3">Event</option>
                        </select>
                    </div>
                    {renderOptions()}
                    <IconButton sx={{position:'absolute', top:0, right:0}} onClick={() => {
                        props.setCourses([...props.courses, {
                            title: title, description: description,
                            time: time, duration: duration,
                            repeating: repeating, repeatingTime: repeatingTime,
                            courseid: getRandomID()
                        }]);
                        handleModalClose();
                        }}>
                        <SaveIcon />
                    </IconButton>
                </Box>
            </Modal>
        </div>
    )
}

export default AddEvent;
import React, { useEffect, useState } from "react";
import './addEvent.css'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { titleInput, descriptionInput } from "../../utils/inputElements";
import { IconButton } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';

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

    const [chosenCourse, setChosenCourse] = useState("");
    const [priority, setPriority] = useState("Lowest");
    useEffect(() => {
        setTime(props.time);
        setDuration('1:00');
        setType('0');
        setRepeating(false);
        setRepeatingTime('');
        setChosenCourse([...props.userData.courses.values()].map((item) => item.id)[0])
    }, [props.time, props.userData.courses, props.open])
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
            <select id="chosenCourse" onChange={(e) => setChosenCourse(e.target.value) }>
                {[...props.userData.courses.keys()]
                    .map((e) => props.userData.courses.get(e))
                    .map((e,i) => {
                    return (
                        <option value={e.id} key={i}>
                            {e.title}
                        </option>
                    )
                })}
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
                        {renderCourseOptions()}
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
                            <input type="checkbox" checked={repeating} id="repeating" onChange={() => setRepeating(!repeating)} />
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
                        <div>
                            <p>Priority</p>
                            <select id="priority" onChange={(e) =>  setPriority(e.target.value)}>
                                <option value="Lowest">Lowest</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
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
            case '4':
                return (
                    <div className="options">
                        {titleInput(setTitle)}
                        {descriptionInput(setDescription)}
                        <div>
                            <p>Time</p>
                            {renderTime()}
                        </div>
                        <div>
                            <p>Priority</p>
                            <select id="priority" onChange={(e) =>  setPriority(e.target.value)}>
                                <option value="Lowest">Lowest</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
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
    const handleAdd = () => {
        switch (type) {
            case '0':
                props.handleAdd("lectures",{
                    course: chosenCourse,
                    title: title, description: description,
                    time: time, duration: duration,
                    repeating: repeating, repeatingTime: repeatingTime
                });
                break;
            case '1':
                props.handleAdd("assignments",{
                    course: chosenCourse,
                    title: title, description: description,
                    status: "Not started",
                    priority: priority, time: time,
                    grade: ""
                })
                break;
            case '2':
                props.handleAdd("exams",{
                    title: title, description: description,
                    time: time, course: chosenCourse
                })
                break;
            case '3':
                props.handleAdd("events",{
                    time: time,
                    title: title, description: description
                })
                break;
            case '4':
                props.handleAdd("projects",{
                    status: "Not started",
                    title: title,
                    description: description,
                    type: type,
                    priority: priority,
                    time: time
                })
                break;
            default:
                return
        }
    }
    return (
        <div>
            <Modal
                open={props.open ?? false}
                onClose={props.onClose}
            >
                <Box className="modalContent">
                    <div className="modalContentEventType">
                        <p>Type</p> 
                        <select id="type" onChange={(e) => setType(e.target.value)}>
                            <option value="0">Lecture</option>
                            <option value="1">Assignment</option>
                            <option value="2">Exam</option>
                            <option value="3">Event</option>
                            <option value="4">Project</option>
                        </select>
                    </div>
                    {renderOptions()}
                    <IconButton sx={{position:'absolute', top:0, right:0}} onClick={() => {
                        handleAdd();
                        props.onClose();
                        }}>
                        <SaveIcon />
                    </IconButton>
                </Box>
            </Modal>
        </div>
    )
}

export default AddEvent;
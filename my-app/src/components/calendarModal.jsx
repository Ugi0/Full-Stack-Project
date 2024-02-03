import React from "react";
import Box from '@mui/material/Box';
import { IconButton } from "@mui/material";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

export class CalendarModal extends React.Component {
    static getDerivedStateFromProps(props, state) {
        state.title = props.title
        state.description = props.description
        state.time = props.time;
        state.duration = props.duration;
        state.open = props.open;
        return state;
    }
    constructor(props) {
        super(props);
        this.saveEvent = props.saveEvent;
        this.deleteEvent = props.deleteEvent;
        this.handleClose = props.handleClose;
        this.state = {
            modalEditable: false,
            time: props.time, newtime: props.time,
            duration: props.duration, newduration: props.duration,
            title: props.title, newtitle: props.title,
            description: props.description, newdescription: props.description,
            open: props.open,
            courseid: props.courseid
        }
    }
    renderTime = (modalEditable, newtime, time) => {
        if (modalEditable) {
            return (
                <input
                    type="datetime-local"
                    id="newtime"
                    value={newtime}
                    onChange={this.handleInputChange}
                />
            )
        } else {
            const date = new Date(time);
            return (
                <Typography id="newduration" sx={{ mt: 2, margin:0 }} >
                    {date.toLocaleDateString()} {date.toLocaleTimeString().slice(0,5)}
                </Typography>
            )
        }
      }
    renderDuration = (modalEditable, newduration, duration) => {
        if (modalEditable) {
            return (
                <input type="time" id="newduration" value={newduration.padStart(5,'0')} onChange={this.handleInputChange}/>
            )
        } else {
            return (
                <Typography id="newduration" sx={{ mt: 2, margin:0 }} >
                    {duration.split(":")[0]}h {duration.split(":")[1]}min
                </Typography>
            )
        }
      }
    renderDeleteIcon = () => {
        if (this.state.modalEditable) {
            return <DeleteIcon />
        }
        return
    }
    renderSaveIcon = () => {
        if (this.state.modalEditable) {
            return <SaveIcon />
        }
        return <BorderColorIcon/>
    }
    handleSaveClick = () => {
        this.setState({
            newtitle: this.state.title,
            newdescription: this.state.description,
            newtime: this.props.time,
            newduration: this.props.duration,
            modalEditable: !this.state.modalEditable
        })
        if (this.state.modalEditable) {
            this.saveEvent(this.state.newtitle, this.state.newdescription, this.state.newtime, this.state.newduration);
        }
    }
    handleDeleteClick = () => {
        this.deleteEvent();
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
                    {this.renderTime(this.state.modalEditable, this.state.newtime, this.state.time)}
                    Duration:
                    {this.renderDuration(this.state.modalEditable, this.state.newduration, this.state.duration)}
                    <IconButton sx={{position:'absolute', top:0, right:0}} onClick={this.handleSaveClick}>
                        {this.renderSaveIcon()}
                    </IconButton>
                    <IconButton sx={{position:'absolute', top:0, left:0}} onClick={this.handleDeleteClick}>
                        {this.renderDeleteIcon()}
                    </IconButton>
                </Box>
            </Modal>
        </div>
    }
}
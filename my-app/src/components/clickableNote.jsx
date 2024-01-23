import React from 'react'
import '../styles/clickableNote.css'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SaveIcon from '@mui/icons-material/Save';

export class ClickableNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false, title: props.title, description: props.description, editable: false, newtitle: props.title, newdescription: props.description }
    }
    handleOpen = () => { 
        this.setState({
            open: true,
            editable: false,
            newdescription: this.state.description,
            newtitle: this.state.title
        });
    }
    handleClose = () => this.setState({open:false})
    handleEditClick = () => {
        this.setState({
            editable: !this.state.editable
        })
        if (this.state.editable) {
            this.setState({
                editable: !this.state.editable,
                title: this.state.newtitle,
                description: this.state.newdescription,
                open: false
            })
        }
    }
    handleInputChange = (event) => {
        const name = event.target.id;
        const value = event.target.innerText.replace(/(\r\n|\n|\r)/gm, "");
        this.setState({
          [name]: value,
        });
        event.preventDefault();
    };
    renderIcon = () => {
        if (this.state.editable) {
            return <SaveIcon />
        }
        return <BorderColorIcon/>
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
                    <IconButton sx={{position:'absolute', top:0, right:0}} onClick={this.handleEditClick}>
                        {this.renderIcon()}
                    </IconButton>
                </Box>
            </Modal>
        </div>
    }
    render() {
        return (
            <div className='noteBody' >
                <p className='noteTitle' onClick={this.handleOpen}> {this.state.title} </p>
                <p className='noteText'> {this.state.description} </p>
                {this.renderModal()}
            </div>
        )
    }
}
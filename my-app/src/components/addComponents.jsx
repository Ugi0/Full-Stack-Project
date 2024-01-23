import React from "react";
import IconButton from '@mui/material/Button';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import '../styles/addComponents.css'

export class AddComponents extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editable: false, addIconClicked: false, secondMenuNumber: -1 }
        this.menuItems = [
            {
                title: 'Calendar',
                subItems: ['Full calendar', 'Smaller calendar']
            },
            {
                title: 'Projects',
                subItems: []
            },
            {
                title: 'Courses',
                subItems: []
            }
        ]
    }

    renderIcon = () => {
        if (this.state.editable) {
            return <SaveIcon />
        }
        return <BorderColorIcon/>
    }

    renderAddMenu = () => {
        if (this.state.addIconClicked) {
            return <ul className="addMenu1">
                {this.menuItems.map((menu, index) => {
                    return (
                        <ul key={index} className="addMenu2" onClick={() => this.handleMenuItemClick(index)}>
                            <p> {menu.title} </p>
                            <div>
                                {(this.state.secondMenuNumber === index) ?
                                    menu.subItems.map((item, index2) => {
                                        return (
                                            <p key={index2} onClick={() => this.handleItemClick(index, index2)}>
                                                {item}
                                            </p>
                                        )
                                    }) : ''
                                }
                            </div>
                        </ul>
                    )
                })}
            </ul>
        }
    }

    renderAddIcon = () => {
        if (this.state.editable) {
            return <div>
                <IconButton sx={{position:'absolute', top:'50%', left:0, scale:'2'}}> 
                    <AddCircleOutlineIcon onClick={this.handleAddClick}/>
                 </IconButton>
                 {this.renderAddMenu()}
            </div>
        }
    }

    handleEditClick = () => {
        this.setState({
            editable: !this.state.editable,
            addIconClicked: false
        })
    }

    handleAddClick = () => {
        this.setState({
            addIconClicked: !this.state.addIconClicked,
            secondMenuNumber: -1
        })
    }

    handleMenuItemClick = (index) => {
        this.setState({
            secondMenuNumber: index
        })
    }

    handleItemClick = (type, typeIndex) => {
        console.log(type, typeIndex)
    }

    render() {
        return (
            <div>
                <IconButton onClick={this.handleEditClick} sx={{position:'absolute', top:0, right:0}}>
                    {this.renderIcon()}
                </IconButton>
                {this.renderAddIcon()}
            </div>
        )
    }
}
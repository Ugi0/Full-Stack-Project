import './courseItemModal.css'
import { useState } from 'react';
import Select from 'react-select';
import { Modal } from '@mui/material';
import { Box } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { IconButton } from '@mui/material';
import { getFilename } from '../../api/getFileName';

const icons = new Map();
const iconsFolder = require.context('../../images/icons/', true);
iconsFolder.keys().map(image => icons.set(getFilename(image), iconsFolder(`${image}`)));

function CourseItemModal(props) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const iconOptions = [
        {value: "Computer Science", label:"Computer Science", icon:"computer_science"},
        {value: "Economics", label:"Economics", icon:'economics'},
        {value: "Geography", label:"Geography", icon:'geography'},
        {value: "History", label: "History", icon: 'history'},
        {value: "Languages", label: "Languages", icon: 'language'},
        {value: "Law", label: "Law", icon: 'law'},
        {value: "Math", label: 'Math', icon: 'math'},
        {value: "Physical Education", label: "Physical Education", icon: "physical_education"},
        {value: "Sciences", label: "Sciences", icon: "sciences"},
        {value: "Social Studies", label: "Social Studies", icon: 'social_studies'},
        {value: "Other", label: "Other", icon: "other"}
    ]

    console.log(Array.from(icons.keys()))

    return (
        <Modal
            open={props.open}
            onClose={() => props.switchOpen()}
        >
            <Box className="modalContent">
                <div>
                    <p>Course name</p>
                    <input value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <div>
                    <p>Course description</p>
                    <input value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <div className='courseItemModalSelect'>
                    <p> Subject </p>
                    <Select
                        styles={{ control: (base, _state) => ({...base, minHeight: '150px', height: '150px'}),
                                container: base => ({...base, flexDirection: "column"}),
                                indicatorsContainer: base => ({...base, height: '40px'}),
                                singleValue: base => ({...base, flexDirection: 'row'})

                    }}
                        options={iconOptions}
                        formatOptionLabel={course => (
                            <div> 
                                <img src={icons.get(course.icon)} alt={course.icon} />
                                <p> {course.label} </p>
                            </div>
                        )}
                    />
                </div>
                <IconButton sx={{position:'absolute', top:0, right:0}} onClick={() => {
                    props.switchOpen();
                    }}>
                    <SaveIcon />
                </IconButton>
            </Box>
        </Modal>
    )
}

export default CourseItemModal;
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
    const [selectedSubject, setSelectedSubject] = useState({});

    const iconOptions = [
        {value:"Computer Science", icon:"computer_science"},
        {value:"Economics", icon:'economics'},
        {value:"Geography", icon:'geography'},
        {value: "History", icon: 'history'},
        {value: "Languages", icon: 'language'},
        {value: "Law", icon: 'law'},
        {value: 'Math', icon: 'math'},
        {value: "Physical Education", icon: "physical_education"},
        {value: "Sciences", icon: "sciences"},
        {value: "Social Studies", icon: 'social_studies'},
        {value: "Other", icon: "other"}
    ]

    const customStyles = {
        option: (provided, state) => ({
          ...provided,
          backgroundColor: 'white',
          color: state.isSelected ? 'red' : 'blue',
          textAlign: 'center',
          height: 100,
          margin: 0 
        }),
        menu: (provided) => ({
            ...provided, width: 150, left: 50, height: 500, margin: 0     
        }),
        MenuList: (provided) => ({
            ...provided, width: 150
        }),
        MenuPortal: (provided) => ({
            ...provided, width: 150
        }),
        valueContainer: (provided) => ({
            ...provided, height: 0, width: 0, padding: 0, margin: '0 !important', display: 'none', position: 'absolute'
        }),
        control: () => ({
          // none of react-select's styles are passed to <Control />
          height: '66px', width: '66px', alignItems: "center"
        }),
        dropdownIndicator: (base) => ({
            ...base,
            transform: 'rotate(270deg)'
          })
      }

    const reset = () => {
        setTitle("");
        setDescription("");
        setSelectedSubject({});
    }

    return (
        <Modal
            open={props.open}
            onClose={() => { reset(); props.switchOpen() }}
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
                        styles={customStyles}
                        value={selectedSubject}
                        options={iconOptions}
                        menuPlacement='top'
                        onChange={(e) => setSelectedSubject(e)}
                        isSearchable={false}
                        maxMenuHeight={500}
                        placeholder=""
                        controlShouldRenderValue = { false }
                        formatOptionLabel={course => (
                            <div style={{width: '100px', height: '100px'}}> 
                                <img src={icons.get(course.icon)} alt={course.icon} />
                                <p> {course.value} </p>
                            </div>
                        )}
                    />
                </div>
                <IconButton sx={{position:'absolute', top:0, right:0}} onClick={() => {
                        props.handleSubmit({title, description, subject: selectedSubject})
                        reset();
                        props.switchOpen();
                    }}>
                    <SaveIcon />
                </IconButton>
            </Box>
        </Modal>
    )
}

export default CourseItemModal;
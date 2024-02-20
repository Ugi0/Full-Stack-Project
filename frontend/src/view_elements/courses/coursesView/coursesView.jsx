import './coursesView.css'
import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import CourseItem from '../../../components/courseItem/courseItem'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import GavelIcon from '@mui/icons-material/Gavel';
import CourseItemModal from '../../../components/courseItemModal/courseItemModal';
import { getFilename } from '../../../api/getFileName';

const icons = new Map();
const iconsFolder = require.context('../../../images/icons/', true);
iconsFolder.keys().map(image => icons.set(getFilename(image), iconsFolder(`${image}`)));

function CoursesView(props) {
    const [x, setX] = useState(props.sx.x);
    const [y, setY] = useState(props.sx.y);
    const [width, setWidth] = useState(props.sx.width);
    const [height, setHeight] = useState(props.sx.height);

    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState();

    const switchOpen = () => {
        setOpen(!open);
    }

    const handleSubmit = (values) => {
        const course = {
            title: values.title,
            description: values.description,
            subject: values.subject.value
        }
        props.addCourse(course);
    }

    const courseIconsFromSubject = (subject) => {
        let icon = subject.toLowerCase().replace(" ","_");
        return [icons.get(icon), icons.get(`${icon}_color`)]
    }

    return (
        <>
        <Rnd disableDragging={!props.editable} enableResizing={props.editable} size={{ width: width,  height: height }}
        position={{ x: x, y: y }}
        style={{border: props.editable ? "solid whitesmoke 1px" : ""}}
        onDragStop={(e, d) => { setX(d.x); setY(d.y); }}
        onResizeStop={(e, direction, ref, delta, position) => {
            setWidth(`${Math.max(Number(ref.style.width.slice(0,-2)), 815)}px`)
            setHeight(ref.style.height);
            setX(position.x);
            setY(position.y);
        }}>
            <div className="coursesViewRoot">
                <h2> Courses </h2>
                <div className='coursesViewSmallText'>
                    <BookmarkBorderIcon />
                    <p> Course </p>
                </div>
                <div className='coursesViewList' style={{'gridTemplateColumns': `repeat(${Math.floor(width/250)}, 1fr)`}}>
                    {[...props.courses.values()].map((e,i) => (
                        <CourseItem icons={courseIconsFromSubject(e.subject)} item={e} key={i} />
                    ))}
                    <CourseItem onClick={() => { setSelectedItem(undefined); setOpen(true) }} title={"+ New"} />
                </div>
            </div>
        </Rnd>
        <CourseItemModal item={selectedItem} switchOpen={switchOpen} open={open} handleSubmit={handleSubmit} />
        </>
    )
}

export default CoursesView;
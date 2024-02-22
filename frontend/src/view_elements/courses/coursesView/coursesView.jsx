import './coursesView.css'
import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import CourseItem from '../../../components/courseItem/courseItem'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DeleteComponentButton from "../../../components/deleteComponentButton/deleteComponentButton";
import CourseItemModal from '../../../components/courseItemModal/courseItemModal';
import { getFilename } from '../../../utils/getFileName';

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

    props.innerRef.current = () => { return {x :x, y:y, width: width, height: height} }

    const switchOpen = () => {
        setOpen(!open);
    }

    const handleSubmit = (values) => {
        let course;
        if (values.item) {
            course = {
                title: values.title,
                description: values.description,
                subject: values.subject.value,
                id: values.item.id
            }
        } else {
            course = {
                title: values.title,
                description: values.description,
                subject: values.subject.value
            }
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
            setWidth(`${Math.max(Number(ref.style.width.slice(0,-2)), 200)}px`)
            setHeight(`${Math.max(Number(ref.style.height.slice(0,-2)), 350)}px`);
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
                    {[...props.courses.values()].sort((a,b) => a.id - b.id).map((e,i) => (
                        <CourseItem onClick={() => { if (props.editable) {return} setSelectedItem(e); setOpen(true); }} icons={courseIconsFromSubject(e.subject)} item={e} key={i} />
                    ))}
                    <CourseItem onClick={() => { if (props.editable) {return} setSelectedItem(undefined); setOpen(true) }} title={"+ New"} />
                </div>
                <DeleteComponentButton editable={props.editable} id={props.id} deleteComponent={props.deleteComponent} />
            </div>
        </Rnd>
        <CourseItemModal item={selectedItem} switchOpen={switchOpen} open={open} handleSubmit={handleSubmit} deleteCourse={props.deleteCourse} />
        </>
    )
}

export default CoursesView;
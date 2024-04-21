import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { getFilename } from '../../../utils/getFileName';
import DeleteComponentButton from '../../../components/deleteComponentButton/deleteComponentButton';
import './singleNote.css'

const icons = new Map();
const iconsFolder = require.context('../../../images/note_icons', true);
iconsFolder.keys().map(image => icons.set(getFilename(image), iconsFolder(`${image}`)));

function SingleNote(props) {
    const [x, setX] = useState(props.sx.x);
    const [y, setY] = useState(props.sx.y);
    const [width, setWidth] = useState(props.sx.width);
    const [height, setHeight] = useState(props.sx.height);

    props.innerRef.current = () => { return {x :x, y:y, width: width, height: height} }

    const getIcon = (iconName) => {
        return icons.get(iconName)    
    }

    const item = [...props.notes.values()].filter(e => e.hostid === props.id)[0];
    if (item === undefined) {
        return <></>
    }

    return <>
        <Rnd disableDragging={!props.editable} enableResizing={props.editable} size={{ width: width,  height: height }}
            position={{ x: x, y: y }}
            style={{border: props.editable ? "solid whitesmoke 1px" : ""}}
            onDragStop={(e, d) => { setX(d.x); setY(d.y); }}
            onResizeStop={(e, direction, ref, delta, position) => {
                setWidth(`${Math.max(Number(ref.style.width.slice(0,-2)), 500)}px`)
                setHeight(`${Math.max(Number(ref.style.height.slice(0,-2)), 200)}px`);
                setX(position.x);
                setY(position.y);
            }}>
            <div className="singleNoteRoot">
                <div className='singleNoteIcon'>
                    <img src={getIcon(item.icon)} alt="icon" style={{width: 20}} />
                    <p>
                        {item.title}
                    </p>
                </div>
                <span className='singleNoteText'>
                    <p>
                        {item.body}
                    </p>
                </span>
                <DeleteComponentButton editable={props.editable} id={props.id} deleteComponent={props.deleteComponent} />
            </div>
        </Rnd>
    </>
}

export default SingleNote;
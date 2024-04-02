import KeyIcon from '@mui/icons-material/Key';
import { useState } from 'react';
import { Rnd } from 'react-rnd';
import './singleNote.css'

function SingleNote(props) {
    const [x, setX] = useState(props.sx.x);
    const [y, setY] = useState(props.sx.y);
    const [width, setWidth] = useState(props.sx.width);
    const [height, setHeight] = useState(props.sx.height);

    const icons = (iconName) => {
        switch (iconName) {
            case "key":
                return <KeyIcon style={{fontSize: 25}} />
            default:
                return
        }
    }

    return <>
        <Rnd disableDragging={!props.editable} enableResizing={props.editable} size={{ width: width,  height: height }}
            position={{ x: x, y: y }}
            style={{border: props.editable ? "solid whitesmoke 1px" : "", position: 'relative'}}
            onDragStop={(e, d) => { setX(d.x); setY(d.y); }}
            onResizeStop={(e, direction, ref, delta, position) => {
                setWidth(`${Math.max(Number(ref.style.width.slice(0,-2)), 500)}px`)
                setHeight(`${Math.max(Number(ref.style.height.slice(0,-2)), 200)}px`);
                setX(position.x);
                setY(position.y);
            }}>
            <div className="singleNoteRoot">
                <div className='singleNoteIcon'>
                    {icons(props.icon)}
                </div>
                <span>
                    {props.body}
                </span>
            </div>
        </Rnd>
    </>
}

export default SingleNote;
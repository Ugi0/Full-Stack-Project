import React, { useState } from 'react'
import { Rnd } from "react-rnd";


function FloatingImage() {
    const [x, setX] = useState(10);
    const [y, setY] = useState(10);
    const [width, setWidth] = useState(406);
    const [height, setHeight] = useState(760);

    return (
        <Rnd
            size={{ width: width, height: height }}
            lockAspectRatio = {true}
            position={{ x: x, y: y }}
            onDragStop={(e, d) => {
                setX(d.x);
                setY(d.y);
            }}
            onResize={(e, direction, ref, delta, position) => {
                setWidth(ref.offsetWidth);
                setHeight(ref.offsetHeight);
                setX(position.x);
                setY(position.y)
            }}
        >
        <img draggable="false" className="profile-photo" src="https://images.nypl.org/index.php?id=1589457&t=w" alt={"Carlie Anglemire"}/>
        </Rnd>
    )
}

export default FloatingImage;
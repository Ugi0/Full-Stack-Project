import React from 'react'
import { Rnd } from "react-rnd";


export class FloatingImage extends React.Component {
    constructor() {
        super();
        this.state = {
          width: 406,
          height: 760,
          x: 10,
          y: 10
        };
      }
    render() {
        return (
            <Rnd
                size={{ width: this.state.width, height: this.state.height }}
                lockAspectRatio = {true}
                position={{ x: this.state.x, y: this.state.y }}
                onDragStop={(e, d) => {
                    this.setState({ x: d.x, y: d.y });
                }}
                onResize={(e, direction, ref, delta, position) => {
                    this.setState({
                        width: ref.offsetWidth,
                        height: ref.offsetHeight,
                        ... position
                    });
                }}
            >
            <img draggable="false" className="profile-photo" src="https://images.nypl.org/index.php?id=1589457&t=w" alt={"Carlie Anglemire"}/>
            </Rnd>
        )
    }
}
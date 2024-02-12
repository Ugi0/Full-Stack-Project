import React from "react";
import './divider.css'



function Divider(props) {
    const views = new Map(props.views);
    views.set(0, {id: 0, title: "Main Page", themecolor: "#2b583e"})

    const getViewTitle = () => {
        if (views.has(props.selectedView)) {
            return (
                <h2>
                    {views.get(props.selectedView).title}
                </h2>
            )
        } else {
            console.log("Can't find id: FIX!")
            return (
                <h2>
                    {views.get(0).title}
                </h2>
            )
        }
    }
    return (
        <div className="divider">
            {getViewTitle()}
        </div>
    )
}

export default Divider;
import React from "react";
import './divider.css'



function Divider(props) {
    const views = new Map(props.views);

    const renderItemTitle = (item) => {
        if (item === undefined || item.title === '_mainpage') {
            return "Main Page"
        }
        return item.title
    }

    const getViewTitle = () => {
        return (
            <h2>
                {renderItemTitle(views.get(props.selectedView))}
            </h2>
        )
    }
    return (
        <div className="divider">
            {getViewTitle()}
            {props.AddComponents}
        </div>
    )
}

export default Divider;